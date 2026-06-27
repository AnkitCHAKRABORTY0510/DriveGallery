import {
  CreateCollectionRequest,
  JoinCollectionRequest,
  ReviewJoinRequest,
  UpdateCollectionRequest,
} from '../schemas/collectionSchema';
import type { GalleryPhoto } from '@/features/gallery/types';

export interface CollectionInfo {
  id: string;
  ownerId: string;
  galleryId: string;
  title: string;
  description?: string;
  coverPhotoId?: string;
  visibility: 'public' | 'private' | 'unlisted';
  inviteCode: string;
  inviteUrl: string;
  joinApprovalRequired: boolean;
  currentUserRole?: 'owner' | 'admin' | 'member';
  pendingRequestsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionJoinRequestInfo {
  id: string;
  collectionId: string;
  userId: string;
  displayName: string;
  username: string;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface CollectionOwner {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
}

export interface CollectionDetailResponse {
  collection: CollectionInfo;
  photos: GalleryPhoto[];
  owner: CollectionOwner;
}

export type {
  CreateCollectionRequest,
  JoinCollectionRequest,
  ReviewJoinRequest,
  UpdateCollectionRequest,
};
