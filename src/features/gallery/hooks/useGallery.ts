'use client';

import { useState, useEffect } from 'react';
import { GalleryInfo, GalleryPhoto, UpdateGalleryRequest } from '../types';

export function useGallery(username?: string) {
  const [gallery, setGallery] = useState<GalleryInfo | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = async (targetUsername: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/gallery/${targetUsername}`);
      const json = await res.json();
      if (json.success) {
        setGallery(json.data.gallery);
        setPhotos(json.data.photos);
      } else {
        setError(json.message);
      }
    } catch {
      setError('An error occurred while fetching the gallery');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchGallery(username);
    }
  }, [username]);

  const updateGallery = async (data: UpdateGalleryRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setGallery(json.data);
        return { success: true };
      } else {
        setError(json.message);
        return { success: false, error: json.message };
      }
    } catch {
      const msg = 'An error occurred while updating the gallery settings';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    gallery,
    photos,
    isLoading,
    error,
    updateGallery,
    refreshGallery: () => username && fetchGallery(username),
  };
}
