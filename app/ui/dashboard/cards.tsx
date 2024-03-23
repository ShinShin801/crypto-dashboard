import {
  BanknotesIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  balance: BanknotesIcon,
  address: UserGroupIcon,
  balance_aud: BanknotesIcon,
  transaction: InboxIcon,
};

export default async function CardWrapper() {
  const { maticBalance, maticBalanceAUD, numberOfAddress, numberOfTx } =
    await fetchCardData();
  return (
    <>
      <Card title="Balance (MATIC)" value={maticBalance} type="balance" />
      <Card title="Balance (AUD)" value={maticBalanceAUD} type="balance_aud" />
      <Card title="Total Addresses" value={numberOfAddress} type="address" />
      <Card title="Total TXs" value={numberOfTx} type="transaction" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'balance' | 'address' | 'balance_aud' | 'transaction';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
