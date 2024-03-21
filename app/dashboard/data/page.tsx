import React from 'react';
import CSVUploadComponent from '@/app/ui/data/csv-upload';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import DataPreviewTable, { DataRow } from '@/app/ui/data/preview-table';

import Papa from 'papaparse';



export default async function Page({}) {


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Uploading Transaction Data</h1>
      </div>
      {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}

      <DataPreviewTable />

      {/* </div> */}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Invoices',
};
