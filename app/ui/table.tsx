'use client';

import React, { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { DataRow } from '@/app/lib/utils';

// export interface DataRow extends Record<string, unknown> {}
interface DataPreviewTableProps {
  table_data: DataRow[];
}

export default function TableBase({ table_data }: DataPreviewTableProps) {
  return (
    // <div className="overflow-auto">
    <div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(table_data[0]).map((key) => (
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
              {table_data.map((row, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
