'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CSVUploadComponent from '@/app/ui/data/csv-upload';
import { lusitana } from '@/app/ui/fonts';
import { DataRow } from '@/app/lib/utils';

// export interface DataRow extends Record<string, unknown> {}
interface DataPreviewTableProps {
  csvData: DataRow[];
}

export default function DataPreviewTable({ csvData }: DataPreviewTableProps) {
  // const [csvData, setCsvData] = useState<DataRow[]>([]);

  const hasData = csvData.length > 0 && Object.keys(csvData[0]).length > 0;

  // const handleCancel = () => {
  //   setCsvData([]);
  // };

  return (
    // <div className="overflow-auto">
    <div>
      {/* <CSVUploadComponent onDataLoaded={setCsvData} />
      <div className="mt-5 flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Preview</h1>
      </div> */}
      {hasData && (
        <>
          <h2>(Showing first 5 rows)</h2>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(csvData[0]).map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {csvData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {Object.entries(row).map(([key, value], i) => (
                        <td
                          key={`${key}-${i}`}
                          className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                        >
                          {typeof value === 'string' ||
                          typeof value === 'number'
                            ? value
                            : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {!hasData && <p>No data to display</p>}
    </div>
  );
}
