'use client';

import React, { ChangeEvent, DragEvent, useState } from 'react';
import Papa from 'papaparse';
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';

interface CSVUploadComponentProps {
  onDataLoaded: (data: any[]) => void;
}

export default function CSVUploadComponent({ onDataLoaded }: CSVUploadComponentProps) {
  // Handler for drag & drop
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      Papa.parse(file, {
        complete: (result) => {
          onDataLoaded(result.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  // Prevent defaul action during drag & drop (ex. open file)
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      Papa.parse(file, {
        complete: (result) => {
          onDataLoaded(result.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <div className="flex justify-center pt-5">
      <label
        className="flex flex-col items-center justify-center p-4 border-dashed border-2 border-gray-300 rounded-md"
        style={{ width: '80%', height: '80%', cursor: 'pointer' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <InboxArrowDownIcon className="h-8 w-8 text-gray-400" />
        Click or drag file to this area to upload
        <input
          type="file"
          id="CSVReader"
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, cursor: 'pointer' }}
          accept=".csv"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
