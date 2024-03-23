export const getMaticHistoricalBalance = () => `
  WITH months AS (
      SELECT date_trunc('month', series) AS month
      FROM generate_series(
        '2023-01-01'::timestamp, -- 開始日
        '2023-12-31'::timestamp, -- 終了日
        '1 month'::interval       -- 月単位
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
        to_char(date_trunc('month', month), 'Mon/YY') AS month,
        total_in_amount,
        total_out_amount,
        total_in_out_amount,
        matic_balance
      FROM monthly
    )

    SELECT month, matic_balance
    FROM base;
`;

export const getMaticBalanceQuery = () => `
  WITH balance as (
    SELECT
      SUM(CASE WHEN value_in_matic >0 THEN value_in_matic ELSE -value_out_matic END) -
      SUM(CASE WHEN from_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835' THEN txnfee_matic ELSE 0 END) AS matic_balance
    FROM polygonscan_transactions
    WHERE from_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835'
      OR to_address = '0x6d02240549a79e5cc6638a7f0b2cb1fb731bc835'
  )
  SELECT matic_balance, matic_balance*1.5 as matic_balance_aud
  FROM balance;
`;

export const getaddressCountQuery = () => `
  SELECT
    COUNT(*) AS count
  FROM useraddress
  WHERE
    user_id = '410544b2-4001-4271-9855-fec4b6a6442a';
`;

export const getTxCountQuery = () => `
  SELECT
    COUNT(txhash) AS count
  FROM polygonscan_transactions
  WHERE
    user_id = '410544b2-4001-4271-9855-fec4b6a6442a';
`;
