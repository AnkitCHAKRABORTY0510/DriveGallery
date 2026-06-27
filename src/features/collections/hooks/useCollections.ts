'use client';

import { useCallback, useState } from 'react';
import {
  CollectionDetailResponse,
  CollectionInfo,
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function useCollections() {
  const [collection, setCollection] = useState<CollectionDetailResponse | null>(null);
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/collections');
      const json = (await res.json()) as ApiResponse<CollectionInfo[]>;

      if (!json.success || !json.data) {
        const message = json.message || 'An error occurred while fetching collections';
        setError(message);
        return { success: false, error: message };
      }

      setCollections(json.data);
      return { success: true, data: json.data };
    } catch {
      const message = 'An error occurred while fetching collections';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCollection = async (data: CreateCollectionRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as ApiResponse<CollectionInfo>;

      if (!json.success || !json.data) {
        const message = json.message || 'An error occurred while creating the collection';
        setError(message);
        return { success: false, error: message };
      }

      const createdCollection = json.data;

      setCollections((currentCollections) => [createdCollection, ...currentCollections]);
      return { success: true, data: createdCollection };
    } catch {
      const message = 'An error occurred while creating the collection';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollection = async (collectionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/collections/${collectionId}`);
      const json = (await res.json()) as ApiResponse<CollectionDetailResponse>;

      if (!json.success || !json.data) {
        const message = json.message || 'An error occurred while fetching the collection';
        setError(message);
        return { success: false, error: message };
      }

      setCollection(json.data);
      return { success: true, data: json.data };
    } catch {
      const message = 'An error occurred while fetching the collection';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollection = async (collectionId: string, data: UpdateCollectionRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as ApiResponse<CollectionInfo>;

      if (!json.success || !json.data) {
        const message = json.message || 'An error occurred while updating the collection';
        setError(message);
        return { success: false, error: message };
      }

      const updatedCollection = json.data;

      setCollection((currentCollection) => {
        if (!currentCollection) return currentCollection;
        return {
          ...currentCollection,
          collection: updatedCollection,
        };
      });

      return { success: true, data: updatedCollection };
    } catch {
      const message = 'An error occurred while updating the collection';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    collection,
    collections,
    isLoading,
    error,
    fetchCollections,
    createCollection,
    fetchCollection,
    updateCollection,
  };
}
