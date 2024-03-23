import AddWalletForm from '@/app/ui/wallets/add-wallet';
import Breadcrumbs from '@/app/ui/data/breadcrumbs';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Wallets', href: '/dashboard/wallets' },
          {
            label: 'Add Wallet',
            href: '/dashboard/wallets/create',
            active: true,
          },
        ]}
      />
      <AddWalletForm />
    </main>
  );
}
