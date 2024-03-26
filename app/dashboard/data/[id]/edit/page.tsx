import Form from '@/app/ui/data/edit-form';
import Breadcrumbs from '@/app/ui/data/breadcrumbs';
import { updateInvoice } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export default async function Page({ params }: { params: { id: string } }) {
  // const id = params.id;
  // const [invoice, customers] = await Promise.all([
  //   fetchInvoiceById(id),
  //   fetchCustomers(),
  // ]);

  // if (!invoice) {
  //   notFound();
  // }

  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} /> */}
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Invoices edit',
};
