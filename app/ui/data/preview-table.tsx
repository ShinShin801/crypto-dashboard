'use client';

import React, { useState } from 'react';
import CSVUploadComponent from '@/app/ui/data/csv-upload';
import { lusitana } from '@/app/ui/fonts';

export interface DataRow extends Record<string, unknown> {}

export default function DataPreviewTable() {
  const [csvData, setCsvData] = useState<DataRow[]>([]);

  const hasData = csvData.length > 0 && Object.keys(csvData[0]).length > 0;

  // CSVデータをデータベースにアップロードする処理
  const handleUploadToDatabase = () => {
    // ここでCSVデータをデータベースに送信する処理を実装
    console.log('Uploading CSV data to database...', csvData);
    // 実際にはAPI呼び出しなどで実装
  };

  // 読み込んだCSVデータを取り消す処理
  const handleCancel = () => {
    setCsvData([]); // CSVデータをクリア
  };

  return (
    <div className="overflow-auto">
      <CSVUploadComponent onDataLoaded={setCsvData} />
      <div className="flex w-full items-center justify-between mt-5">
        <h1 className={`${lusitana.className} text-2xl`}>Preview</h1><h2>(Showing first 5 rows)</h2>
      </div>
      {hasData && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ overflowX: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {csvData.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).map(([key, value], i) => (
                    <td key={`${key}-${i}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof value === 'string' || typeof value === 'number' ? value : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleUploadToDatabase}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload to Database
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {!hasData && <p>No data to display</p>}
    </div>
  );
}
