import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config/authOptions';
import { JoinCollectionView } from '@/features/collections/components/JoinCollectionView';

interface JoinCollectionPageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function JoinCollectionPage({ params }: JoinCollectionPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { inviteCode } = await params;

  return <JoinCollectionView inviteCode={inviteCode} />;
}
