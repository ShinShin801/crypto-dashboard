'use client';

import { useFormState } from 'react-dom';
import { updatefavAddress } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { Address } from '@/app/lib/definitions';
import { WalletIcon } from '@heroicons/react/24/outline';

export default function ChangeFavWalletForm({
  address,
}: {
  address: Address[];
}) {
  const initialState = { message: null, errors: {} };

  const [state, dispatch] = useFormState(updatefavAddress, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose address
          </label>
          <div className="relative">
            <select
              id="address"
              name="address"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
              required
            >
              <option value="" disabled>
                Select an address
              </option>
              {address.map((address) => (
                <option key={address.address} value={address.address}>
                  {address.address}
                </option>
              ))}
            </select>
            <WalletIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.address &&
              state.errors.address.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <input type="hidden" name="is_favorite" value="on" />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/wallets"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Set as favorite</Button>
      </div>
    </form>
  );
}
