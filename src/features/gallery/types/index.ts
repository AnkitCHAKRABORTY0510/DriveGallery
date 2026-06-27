import type { CollectionInfo } from '@/features/collections/types';

export interface GalleryInfo {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  visibility: 'public' | 'private' | 'unlisted';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPhoto {
  id: string;
  googleDriveFileId: string;
  visibility: 'public' | 'private' | 'event';
  allowDownload: boolean;
  publishDate: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface PublicGalleryResponse {
  gallery: GalleryInfo;
  photos: GalleryPhoto[];
  collections: CollectionInfo[];
  featured: GalleryPhoto[];
}

export type { UpdateGalleryRequest } from '../schemas/gallerySchema';
