// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type Address = {
  // user_id: string;
  address: number;
};

export type Balance = {
  month: string;
  matic_balance: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type LatestTx = {
  txhash: string;
  datetime_utc: Date; // 'YYYY-MM-DD HH:MM:SS'
  from_address: string;
  to_address: string;
  matic_amount: number;
  current_value: number;
  txnfee_matic: number;
  txnfee_usd: number;
  historical_price_matic: number;
  method?: string;
};

export type LatestTxRaw = Omit<LatestTx, 'current_value'> & {
  current_value: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type PolyscanTransactionData = {
  user_id: string;
  txhash: string;
  blockno: number;
  unixtimestamp: number;
  dateTime_utc: string; // 'YYYY-MM-DD HH:MM:SS'
  from_address: string;
  to_address: string;
  value_in_matic: number;
  value_out_matic: number;
  contract_address?: string;
  current_value: number;
  txnfee_matic: number;
  txnfee_usd: number;
  historical_price_matic: number;
  status: string;
  errcode?: string;
  method?: string;
};
