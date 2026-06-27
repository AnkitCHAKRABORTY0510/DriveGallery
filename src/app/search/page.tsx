import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config/authOptions';
import { UserSearchView } from '@/features/search/components/UserSearchView';

export default async function SearchPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  return <UserSearchView />;
}
