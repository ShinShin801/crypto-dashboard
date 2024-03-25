// 'use client';

import CardWrapper from '@/app/ui/dashboard/cards';
import BalanceChart from '@/app/ui/dashboard/balance-chart';
import LatestTx from '@/app/ui/dashboard/latest-tx';
import { useState, Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import { Metadata } from 'next';
import AddressDropdown from '@/app/ui/dashboard/choose-address';

export default async function Wrapper() {
  return (
    <div>
      <div className="mt-6 grid grid-cols-1">
        <AddressDropdown />
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
    </div>
  );
}
