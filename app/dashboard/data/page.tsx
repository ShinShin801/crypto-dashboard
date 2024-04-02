import React from 'react';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { Importdata } from '@/app/ui/data/buttons';

export default async function Page({}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Transaction Data</h1>
      </div>
      <Importdata />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Transaction Data',
};
