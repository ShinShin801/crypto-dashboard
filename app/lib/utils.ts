import { PolyscanTransactionData, Balance } from './definitions';
import { insertPolyscanTransactions } from '@/app/lib/actions';
import Papa from 'papaparse';
import { ChangeEvent, DragEvent } from 'react';
import { fetchUserId } from './data';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatCurrencyAUD = (amount: number) => {
  const scale = 5;
  let format_amount = Math.floor(amount * 10 ** scale) / 10 ** scale;

  return format_amount.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  });
};

export const formatOnchainBalance = (balance: number) => {
  const scale = 5;
  let format_balance = Math.floor(balance * 10 ** scale) / 10 ** scale;
  return format_balance.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateTime = (dateTimeUtc: Date): string => {
  return dateTimeUtc.toISOString().replace('T', ' ').substring(0, 19);
};

export const generateYAxis = (revenue: Balance[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(
    ...revenue.map((month) => month.matic_balance),
  );

  const topLabel = Math.ceil(highestRecord / 10) * 10;
  const topLabelSpan = Math.floor(topLabel / 5);

  for (let i = topLabel; i >= 0; i -= topLabelSpan) {
    yAxisLabels.push(`${i}`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export interface DataRow extends Record<string, unknown> {}

export const transformCsvDataToPolyscanTransactionData = async (
  renamedCsvData: DataRow[],
): Promise<PolyscanTransactionData[]> => {
  const user_id = await fetchUserId();
  return renamedCsvData.map((row) => {
    return {
      user_id: user_id,
      txhash: String(row.txhash),
      blockno: Number(row.blockno),
      unixtimestamp: Number(row.unixtimestamp),
      dateTime_utc: String(row.dateTime_utc),
      from_address: String(row.from_address),
      to_address: String(row.to_address),
      value_in_matic: parseFloat(row.value_in_matic as string),
      value_out_matic: parseFloat(row.value_out_matic as string),
      contract_address: row.contract_address
        ? String(row.contract_address)
        : undefined,
      current_value: parseFloat(row.current_value as string),
      txnfee_matic: parseFloat(row.txnfee_matic as string),
      txnfee_usd: parseFloat(row.txnfee_usd as string),
      historical_price_matic: parseFloat(row.historical_price_matic as string),
      status: String(row.status),
      errcode: row.errcode ? String(row.errcode) : undefined,
      method: row.method ? String(row.method) : undefined,
    };
  });
};

interface RequiredColumns {
  [key: string]: string;
}
const requiredColumns: RequiredColumns = {
  Txhash: 'txhash',
  Blockno: 'blockno',
  UnixTimestamp: 'unixtimestamp',
  'DateTime (UTC)': 'dateTime_utc',
  From: 'from_address',
  To: 'to_address',
  ContractAddress: 'contract_address',
  'Value_IN(MATIC)': 'value_in_matic',
  'Value_OUT(MATIC)': 'value_out_matic',
  'CurrentValue @ $1.05590349926354/MATIC': 'current_value',
  'TxnFee(MATIC)': 'txnfee_matic',
  'TxnFee(USD)': 'txnfee_usd',
  'Historical $Price/MATIC': 'historical_price_matic',
  Status: 'status',
  ErrCode: 'errcode',
  Method: 'method',
};

export const handleUploadToDatabase = async (
  csvData: DataRow[],
  setErrorMessage: (message: string | null) => void,
) => {
  if (!csvData.length) {
    setErrorMessage('CSV data is empty');
    return;
  }

  // Retrieving columns
  const csvColumns: string[] = Object.keys(csvData[0]);

  // Check if all required columns are included
  const allRequiredColumnsPresent = Object.keys(requiredColumns).every(
    (column) =>
      csvColumns.includes(column) ||
      csvColumns.some((col) => new RegExp('CurrentValue @.*').test(col)),
  );

  if (!allRequiredColumnsPresent) {
    setErrorMessage('CSV data does not contain all required columns');
    return;
  }

  // Rename columns and transform data
  const renamedCsvData: DataRow[] = csvData.map((row) => {
    const newRow: DataRow = {};
    Object.entries(row).forEach(([key, value]) => {
      const newKey =
        requiredColumns[key] ||
        key.replace(/CurrentValue @.*/, 'current_value');
      newRow[newKey] = value;
    });
    return newRow;
  });

  let parsedData: PolyscanTransactionData[];
  try {
    // Assuming transformCsvDataToPolyscanTransactionData is now async due to fetchUserId
    parsedData =
      await transformCsvDataToPolyscanTransactionData(renamedCsvData);
  } catch (error) {
    console.error('Error transforming CSV data:', error);
    setErrorMessage(
      'Error transforming CSV data. Please check the data format.',
    );
    return;
  }

  try {
    await insertPolyscanTransactions(parsedData);
    setErrorMessage(null); // Clear any previous error message
  } catch (error) {
    console.error('Database Error:', error);
    setErrorMessage(`Error while inserting data. Please try again.`);
  }
};

export const parseCSVFile = (
  file: File,
  onDataLoaded: (data: any[]) => void,
) => {
  Papa.parse(file, {
    complete: (result) => {
      onDataLoaded(result.data);
    },
    header: true,
    skipEmptyLines: true,
  });
};

export const handleDrop = (
  event: DragEvent<HTMLLabelElement>,
  onDataLoaded: (data: any[]) => void,
) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files && files.length > 0) {
    const file = files[0];
    parseCSVFile(file, onDataLoaded);
  }
};

export const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
  event.preventDefault();
};

export const handleFileChange = (
  event: ChangeEvent<HTMLInputElement>,
  onDataLoaded: (data: any[]) => void,
) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    parseCSVFile(file, onDataLoaded);
  }
};
