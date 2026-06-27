'use client';

import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { UpdateProfileRequest } from '../types';

export function EditProfileForm() {
  const { profile, updateProfile, isLoading, error } = useProfile();
  
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || '',
  });

  const [message, setMessage] = useState('');

  if (isLoading && !profile) {
    return <div>Loading profile...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await updateProfile(formData);
    if (res.success) {
      setMessage('Profile updated successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {message && <div className="text-green-500 mb-2">{message}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          className="w-full border rounded p-2 dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border rounded p-2 dark:bg-zinc-800 dark:border-zinc-700"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Avatar URL</label>
        <input
          type="text"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="w-full border rounded p-2 dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
