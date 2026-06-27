'use client';

import { useState, useCallback } from 'react';
import { DriveFileMetadata, DriveStats, PublishRequest, UnpublishRequest, PhotoResponse } from '../types';

const DRIVE_CACHE_KEY = 'drivegallery:drive-files-cache';
const DRIVE_CACHE_TTL_MS = 5 * 60 * 1000;

interface DriveFilesCache {
  files: DriveFileMetadata[];
  nextPageToken: string | null;
  cachedAt: number;
}

function readDriveCache(): DriveFilesCache | null {
  if (typeof window === 'undefined') return null;

  try {
    const rawCache = window.sessionStorage.getItem(DRIVE_CACHE_KEY);
    if (!rawCache) return null;

    const cache = JSON.parse(rawCache) as DriveFilesCache;
    if (Date.now() - cache.cachedAt > DRIVE_CACHE_TTL_MS) {
      window.sessionStorage.removeItem(DRIVE_CACHE_KEY);
      return null;
    }

    return cache;
  } catch {
    window.sessionStorage.removeItem(DRIVE_CACHE_KEY);
    return null;
  }
}

function writeDriveCache(files: DriveFileMetadata[], nextPageToken: string | null) {
  if (typeof window === 'undefined') return;

  const cache: DriveFilesCache = {
    files,
    nextPageToken,
    cachedAt: Date.now(),
  };

  window.sessionStorage.setItem(DRIVE_CACHE_KEY, JSON.stringify(cache));
}

export function useDrive() {
  const initialCache = readDriveCache();
  const [files, setFiles] = useState<DriveFileMetadata[]>(initialCache?.files ?? []);
  const [nextPageToken, setNextPageToken] = useState<string | null>(initialCache?.nextPageToken ?? null);
  const [stats, setStats] = useState<DriveStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingCache, setIsRefreshingCache] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async (pageToken?: string) => {
    setIsLoading(true);
    setIsRefreshingCache(!pageToken);
    setError(null);
    try {
      const url = pageToken ? `/api/drive/files?pageToken=${pageToken}` : '/api/drive/files';
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.success) {
        const incomingFiles = json.data.files as DriveFileMetadata[];
        const incomingNextPageToken = json.data.nextPageToken || null;

        if (pageToken) {
          setFiles((prev) => {
            const updatedFiles = [...prev, ...incomingFiles];
            writeDriveCache(updatedFiles, incomingNextPageToken);
            return updatedFiles;
          });
        } else {
          setFiles(incomingFiles);
          writeDriveCache(incomingFiles, incomingNextPageToken);
        }
        setNextPageToken(incomingNextPageToken);
      } else {
        setError(json.message);
      }
    } catch {
      setError('An error occurred while fetching Drive files');
    } finally {
      setIsLoading(false);
      setIsRefreshingCache(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/drive/stats');
      const json = await res.json();

      if (json.success) {
        setStats(json.data);
      }
    } catch {
      // Stats are helpful but should not block the publishing experience.
    }
  }, []);

  const clearCachedFiles = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(DRIVE_CACHE_KEY);
    }
    setFiles([]);
    setNextPageToken(null);
  }, []);

  const publishFiles = async (data: PublishRequest): Promise<{ success: boolean; data?: PhotoResponse[]; error?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/drive/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      
      if (json.success) {
        return { success: true, data: json.data };
      } else {
        setError(json.message);
        return { success: false, error: json.message };
      }
    } catch {
      const msg = 'An error occurred while publishing files';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const unpublishFile = async (data: UnpublishRequest): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/drive/unpublish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      
      if (json.success) {
        return { success: true };
      } else {
        setError(json.message);
        return { success: false, error: json.message };
      }
    } catch {
      const msg = 'An error occurred while unpublishing the file';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    files,
    nextPageToken,
    stats,
    isLoading,
    isRefreshingCache,
    error,
    fetchFiles,
    fetchStats,
    clearCachedFiles,
    publishFiles,
    unpublishFile
  };
}
