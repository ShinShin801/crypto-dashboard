'use client';

import React from 'react';
import { handleDrop, handleDragOver, handleFileChange } from '@/app/lib/utils';
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';

interface CSVUploadComponentProps {
  onDataLoaded: (data: any[]) => void;
}

export default function CSVUploadComponent({
  onDataLoaded,
}: CSVUploadComponentProps) {
  return (
    <div className="flex justify-center pt-5">
      <label
        className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4"
        style={{ width: '80%', height: '80%', cursor: 'pointer' }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, onDataLoaded)} // Pass `onDataLoaded` to the handler
      >
        <InboxArrowDownIcon className="h-8 w-8 text-gray-400" />
        Click or drag file to this area to upload
        <input
          type="file"
          id="CSVReader"
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0,
            cursor: 'pointer',
          }}
          accept=".csv"
          onChange={(e) => handleFileChange(e, onDataLoaded)} // Pass `onDataLoaded` to the handler
        />
      </label>
    </div>
  );
}
