import React from 'react';
import CSVUploadComponent from '@/app/ui/data/csv-upload';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { Importdata } from '@/app/ui/data/buttons';

export default async function Page({}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transaction Data</h1>
      </div>
      <Importdata />

      {/* </div> */}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Transaction Data',
};
