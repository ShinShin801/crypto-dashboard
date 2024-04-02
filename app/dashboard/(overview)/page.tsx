// 'use client';

import CardWrapper from '@/app/ui/dashboard/cards';
import BalanceChart from '@/app/ui/dashboard/balance-chart';
import LatestTx from '@/app/ui/dashboard/latest-tx';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import { Metadata } from 'next';
import FavoriteAddress from '@/app/ui/dashboard/favorite-address';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {/* <Wrapper /> */}
      <div className="mt-6 grid grid-cols-1">
        <FavoriteAddress />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <BalanceChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestTx />
        </Suspense>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Dashboard',
};
