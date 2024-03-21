'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CSVUploadComponent from '@/app/ui/data/csv-upload';
import { lusitana } from '@/app/ui/fonts';
import DataPreviewTable from './preview-table';
import { DataRow } from '@/app/lib/utils';
import { handleUploadToDatabase } from '@/app/lib/utils';

export default function ImporttransactionData() {
  const [csvData, setCsvData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  // const router = useRouter();

  const hasData = csvData.length > 0 && Object.keys(csvData[0]).length > 0;

  const uploadData = async () => {
    setIsLoading(true);
    setIsCompleted(false);
    try {
      await handleUploadToDatabase(csvData, setErrorMessage);
      setIsCompleted(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Upload failed. Please try again.');
      setIsCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-auto">
      <CSVUploadComponent onDataLoaded={setCsvData} />
      <div className="mt-5 flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Preview</h1>
      </div>
      <DataPreviewTable csvData={csvData} />
      {hasData && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={uploadData}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            disabled={isLoading} // Disable the button while loading
          >
            {isLoading ? 'Uploading...' : 'Upload to Database'}
          </button>
          <Link
            href="/dashboard/data"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
      )}
      {isCompleted && (
        <div style={{ color: 'green' }}>Upload completed successfully!</div>
      )}
    </div>
  );
}
