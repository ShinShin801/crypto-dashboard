import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { LatestInvoice } from '@/app/lib/definitions';
import { fetchLatestTx } from '@/app/lib/data';
import TableBase from '../table';
import { formatDateTime } from '@/app/lib/utils';

export default async function LatestTx() {
  const latestTx = await fetchLatestTx(); // Fetch data inside the component
  // console.log('latestTx');
  // console.log(latestTx[1]);
  // console.log(latestTx[1].datetime_utc);
  // console.log(formatDateTime(latestTx[1].datetime_utc));
  // console.log(typeof latestTx[1].datetime_utc);
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest TXs
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: comment in this code when you get to this point in the course */}
        <TableBase table_data={latestTx} />
        {/* <div className="bg-white px-6">
          {latestTx.map((tx, i) => {
            return (
              <div
                key={tx.txhash}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              ></div>
            );
          })}
        </div> */}
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
