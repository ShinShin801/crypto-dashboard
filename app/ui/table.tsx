import React from 'react';
import { DataRow } from '@/app/lib/utils';

interface DataPreviewTableProps {
  table_data: DataRow[];
}

export default function TableBase({ table_data }: DataPreviewTableProps) {
  // Determine the number of columns from the first row of data
  const columnCount = table_data[0] ? Object.keys(table_data[0]).length : 1;

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {table_data[0] ? (
                Object.keys(table_data[0]).map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {key}
                  </th>
                ))
              ) : (
                // If no data is available, still render a header row but with a single cell
                <th
                  colSpan={columnCount}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                ></th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table_data[0] ? (
              table_data.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).map(([key, value], i) => (
                    <td
                      key={`${key}-${i}`}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                    >
                      {typeof value === 'string' || typeof value === 'number'
                        ? value
                        : ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Render a row with a single cell that spans all columns when no data is available
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
