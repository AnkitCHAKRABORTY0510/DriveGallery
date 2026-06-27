import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config/authOptions';
import { CollectionsStudio } from '@/features/collections/components/CollectionsStudio';

export default async function CollectionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  return <CollectionsStudio />;
}
