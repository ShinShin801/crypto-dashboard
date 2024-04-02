import Breadcrumbs from '@/app/ui/data/breadcrumbs';
import { Metadata } from 'next';
import ImporttransactionData from '@/app/ui/data/import-data';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transaction Data', href: '/dashboard/data' },
          {
            label: 'Import data',
            href: '/dashboard/data/imports',
            active: true,
          },
        ]}
      />
      <ImporttransactionData />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Import transaction data',
};
