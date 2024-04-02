import ChangeFavWalletForm from '@/app/ui/wallets/change-fav-wallet';
import Breadcrumbs from '@/app/ui/data/breadcrumbs';
import { fetchAddress } from '@/app/lib/data';

export default async function Page() {
  const addresses = await fetchAddress();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Wallets', href: '/dashboard/wallets' },
          {
            label: 'Change Favorite Wallet',
            href: '/dashboard/wallets/changefav',
            active: true,
          },
        ]}
      />
      <ChangeFavWalletForm address={addresses} />
    </main>
  );
}
