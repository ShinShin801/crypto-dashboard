'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { insertAddress } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

export default function AddWalletForm() {
  const initialState = { message: null, errors: {} };

  const [state, dispatch] = useFormState(insertAddress, initialState);

  return (
    // <form onSubmit={handleSubmit}>
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Enter Wallet Address:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="address"
                type="text"
                name="address"
                placeholder="0x..."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
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
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/wallets"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Wallet</Button>
      </div>
    </form>
  );
}
