import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config/authOptions';
import { ProfileService } from '@/features/profile/services/ProfileService';
import { GalleryService } from '@/features/gallery/services/GalleryService';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { GalleryGrid } from '@/features/gallery/components/GalleryGrid';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicGalleryPage({ params }: PageProps) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const publicProfile = await ProfileService.getPublicProfile(username);
  if (!publicProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">User Not Found</h1>
        <p className="text-zinc-500 mb-6">The user @{username} does not exist.</p>
        <Link href="/" className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-medium rounded-full hover:opacity-90 transition-opacity">
          Go Home
        </Link>
      </div>
    );
  }

  const galleryResponse = await GalleryService.getPublicGallery(username);
  if (!galleryResponse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Gallery Private</h1>
        <p className="text-zinc-500 mb-6">@{username}&apos;s gallery is private or unavailable.</p>
        <Link href="/" className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-medium rounded-full hover:opacity-90 transition-opacity">
          Go Home
        </Link>
      </div>
    );
  }

  const isOwner = session?.user?.username === username;

  // Adapt PublicProfile to the format expected by ProfileHeader
  const headerProfile = {
    id: publicProfile.id,
    username: publicProfile.username,
    displayName: publicProfile.displayName,
    avatar: publicProfile.avatar,
    bio: publicProfile.bio,
    email: '',
    createdAt: '',
    updatedAt: '',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Profile Header section */}
      <div className="relative">
        <ProfileHeader profile={headerProfile} />
        {isOwner && (
          <div className="absolute top-4 right-4 flex space-x-2">
            <Link 
              href="/profile" 
              className="px-4 py-2 text-xs md:text-sm font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-full transition-all border border-zinc-200 dark:border-zinc-700"
            >
              Edit Profile & Settings
            </Link>
          </div>
        )}
      </div>

      {/* Gallery Metadata and Photos */}
      <div className="mt-8">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {galleryResponse.gallery.title}
          </h2>
          {galleryResponse.gallery.description && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {galleryResponse.gallery.description}
            </p>
          )}
        </div>

        <GalleryGrid photos={galleryResponse.photos} />
      </div>
    </div>
  );
}
