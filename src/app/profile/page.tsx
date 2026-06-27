'use client';

import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { EditProfileForm } from '@/features/profile/components/EditProfileForm';

export default function ProfilePage() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error || 'Profile not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProfileHeader profile={profile} />
      
      <div className="mt-8">
        <EditProfileForm />
      </div>
    </div>
  );
}
