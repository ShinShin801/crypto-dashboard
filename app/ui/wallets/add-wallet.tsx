'use client';

import { StarIcon } from '@heroicons/react/24/outline';

import React, { useState } from 'react';
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
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the favorite address
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex items-center gap-4">
              <label
                htmlFor="favorite"
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white"
              >
                <StarIcon className="h-4 w-4" />
                Favorite
              </label>
              <input
                id="is_favorite"
                name="is_favorite"
                type="checkbox"
                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
              />
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/wallets"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Add Address</Button>
      </div>
    </form>
  );
}
