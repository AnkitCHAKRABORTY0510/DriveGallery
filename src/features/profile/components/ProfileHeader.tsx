import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '../types';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm mb-6">
      <Avatar className="mb-4 size-24">
        <AvatarImage src={profile.avatar} alt={profile.displayName} />
        <AvatarFallback className="text-2xl">
          {profile.displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <h1 className="text-2xl font-bold">{profile.displayName}</h1>
      <p className="text-gray-500 dark:text-gray-400">@{profile.username}</p>
      
      {profile.bio && (
        <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-lg">
          {profile.bio}
        </p>
      )}
    </div>
  );
}
