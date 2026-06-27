import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config/authOptions';
import { DriveStudio } from '@/features/drive/components/DriveStudio';

export default async function StudioPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    redirect('/login');
  }

  return <DriveStudio username={session.user.username} />;
}
