import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config/authOptions';
import { CollectionDetailView } from '@/features/collections/components/CollectionDetailView';
import { CollectionService } from '@/features/collections/services/CollectionService';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const collection = await CollectionService.getCollectionDetail(id, session.user.id);

  if (!collection) {
    notFound();
  }

  return <CollectionDetailView initialData={collection} />;
}
