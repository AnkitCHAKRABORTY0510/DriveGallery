'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileRequest } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/users/me');
      const json = await res.json();
      if (json.success) {
        setProfile(json.data);
      } else {
        setError(json.message);
      }
    } catch {
      setError('An error occurred while fetching the profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setProfile(json.data);
        return { success: true };
      } else {
        setError(json.message);
        return { success: false, error: json.message };
      }
    } catch {
      const msg = 'An error occurred while updating the profile';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, updateProfile, refreshProfile: fetchProfile };
}
