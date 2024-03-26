'use server';

import { sql } from '@vercel/postgres';
import { auth } from '@/auth';

import { User, Balance, Address, LatestTxRaw } from './definitions';
import {
  formatOnchainBalance,
  formatCurrencyAUD,
  formatDateTime,
} from './utils';
import { unstable_noStore as noStore } from 'next/cache';
// import {
//   getMaticHistoricalBalance,
//   getMaticBalanceQuery,
//   getaddressCountQuery,
//   getTxCountQuery,
// } from './queries';

export async function fetchBalance() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    console.log('Fetching wallet balance data...');

    const data = await sql<Balance>`WITH months AS (
      SELECT date_trunc('month', series) AS month
      FROM generate_series(
        '2023-01-01'::timestamp,
        '2023-12-31'::timestamp,
        '1 month'::interval
      ) AS series
      ORDER BY month
    ),
    tx AS (
      SELECT
        date_trunc('month', dateTime_utc) AS month,
        SUM(value_in_matic) AS total_matic_in,
        SUM(value_out_matic) AS total_matic_out,
        SUM(value_in_matic) - SUM(value_out_matic) AS total_in_out,
        SUM(CASE WHEN from_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835' THEN txnfee_matic ELSE 0 END) AS total_txfee_matic
      FROM polygonscan_transactions
      WHERE from_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835'
      OR to_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835'
      GROUP BY 1
        ORDER BY month desc
    ),
    monthly AS (
      SELECT
        months.month,
        COALESCE(tx.total_matic_in, 0) AS total_in_amount,
        COALESCE(tx.total_matic_out, 0) AS total_out_amount,
        COALESCE(tx.total_in_out, 0) AS total_in_out_amount,
        SUM(COALESCE(tx.total_in_out, 0) - COALESCE(tx.total_txfee_matic, 0))
        OVER (ORDER BY months.month) AS matic_balance
      FROM months
      LEFT JOIN tx ON months.month = tx.month
      ORDER BY month
    ), base AS (
        SELECT
        to_char(date_trunc('month', month), 'Mon') AS month,
        total_in_amount,
        total_out_amount,
        total_in_out_amount,
        matic_balance
      FROM monthly
    )

    SELECT month, matic_balance
    FROM base;`;

    console.log('Data fetch completed.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchUserId() {
  const session = await auth();
  const email = session?.user?.email;
  const user_id_q = await sql`
      SELECT id
      FROM users
      WHERE email = ${`${email}`}
    `;
  // console.log(user_id_q);
  return user_id_q.rows[0].id;
}

const ITEMS_PER_PAGE_ADDRESS = 10;
export async function fetchFilteredAddress(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE_ADDRESS;

  try {
    const user_id = await fetchUserId();
    const addresses = await sql<Address>`
      SELECT address
      FROM useraddress
      WHERE user_id = ${`${user_id}`}
        AND address ILIKE ${`%${query}%`}
      ORDER BY address
      LIMIT ${ITEMS_PER_PAGE_ADDRESS} OFFSET ${offset}
    `;
    return addresses.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch addresses.');
  }
}

export async function fetchAddressPages(query: string) {
  noStore();

  try {
    const user_id = await fetchUserId();
    const count = await sql`SELECT COUNT(address)
    FROM useraddress
    WHERE user_id = ${`${user_id}`}
    AND address ILIKE ${`%${query}%`}
    ;
  `;

    const totalPages = Math.ceil(
      Number(count.rows[0].count) / ITEMS_PER_PAGE_ADDRESS,
    );
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of address.');
  }
}

export async function fetchLatestTx() {
  noStore();
  try {
    const user_id = await fetchUserId();
    const data = await sql<LatestTxRaw>`
      SELECT
        txhash, datetime_utc, from_address, to_address,
        CASE WHEN value_in_matic >0 THEN value_in_matic ELSE value_out_matic END AS matic_amount,
        current_value, txnfee_matic, txnfee_usd, historical_price_matic, method
      FROM polygonscan_transactions
      WHERE user_id = ${`${user_id}`}
      ORDER BY datetime_utc desc
      LIMIT 7
      `;

    const latestTx = data.rows.map((tx) => ({
      ...tx,
      // current_value: formatCurrency(tx.current_value),
      matic_amount: formatOnchainBalance(tx.matic_amount),
      current_value: formatCurrencyAUD(tx.current_value),
      txnfee_matic: formatOnchainBalance(tx.txnfee_matic),
      txnfee_usd: formatCurrencyAUD(tx.txnfee_usd),
      historical_price_matic: formatOnchainBalance(tx.historical_price_matic),
      datetime_utc: formatDateTime(tx.datetime_utc),
    }));
    return latestTx;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest Tx.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const user_id = await fetchUserId();
    const maticBalancePromise = sql`
    WITH balance as (
      SELECT
        SUM(CASE WHEN value_in_matic >0 THEN value_in_matic ELSE -value_out_matic END) -
        SUM(CASE WHEN from_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835' THEN txnfee_matic ELSE 0 END) AS matic_balance
      FROM polygonscan_transactions
      WHERE from_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835'
        OR to_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835'
      )
      SELECT matic_balance, matic_balance*1.5 as matic_balance_aud
      FROM balance;`;
    const addressCountPromise = sql`
    SELECT
      COUNT(*) AS count
    FROM useraddress
    WHERE user_id = ${`${user_id}`};`;
    const txCountPromise = sql`
    SELECT
      COUNT(txhash) AS count
    FROM polygonscan_transactions
    WHERE user_id = ${`${user_id}`};`;

    const data = await Promise.all([
      maticBalancePromise,
      addressCountPromise,
      txCountPromise,
    ]);

    const maticBalance = formatOnchainBalance(
      data[0].rows[0].matic_balance ?? '0',
    );
    const maticBalanceAUD = formatCurrencyAUD(
      data[0].rows[0].matic_balance_aud ?? '0',
    );
    const numberOfAddress = Number(data[1].rows[0].count ?? '0');
    const numberOfTx = Number(data[2].rows[0].count ?? '0');

    return {
      maticBalance,
      maticBalanceAUD,
      numberOfAddress,
      numberOfTx,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function getUser(email: string) {
  noStore();
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
