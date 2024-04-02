import { UserCircleIcon } from '@heroicons/react/24/outline';
import { fetchFavorateAddress } from '@/app/lib/data';

export default async function FavoriteAddress() {
  const address = await fetchFavorateAddress();

  return (
    <div className="mb-4">
      <div className="relative flex items-center space-x-2">
        <UserCircleIcon className="h-5 w-5 text-gray-500" />
        <span className="block text-sm font-medium text-gray-700">
          Favorite Address:
        </span>
        <span className="block text-sm text-gray-500">
          {address != null ? address : 'not set yet'}
        </span>
      </div>
    </div>
  );
}
