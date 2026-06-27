import { GalleryRepository } from '@/features/gallery/repositories/GalleryRepository';
import { PhotoRepository } from '@/features/drive/repositories/PhotoRepository';
import { ProfileRepository } from '@/features/profile/repositories/ProfileRepository';
import { ICollection } from '@/models/Collection';
import { ICollectionJoinRequest } from '@/models/CollectionJoinRequest';
import { IUser } from '@/models/User';
import { Logger } from '@/utils/logger';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { CollectionMembershipRepository } from '../repositories/CollectionMembershipRepository';
import {
  CollectionJoinRequestInfo,
  CollectionDetailResponse,
  CollectionInfo,
  CreateCollectionRequest,
  JoinCollectionRequest,
  ReviewJoinRequest,
  UpdateCollectionRequest,
} from '../types';

export class CollectionService {
  private static getInviteUrl(inviteCode: string): string {
    return `/collections/join/${inviteCode}`;
  }

  private static generateInviteCode(): string {
    return Math.random().toString(36).slice(2, 10).toUpperCase();
  }

  private static async mapToCollectionInfo(
    collection: ICollection,
    currentUserId?: string
  ): Promise<CollectionInfo> {
    const membership = currentUserId
      ? await CollectionMembershipRepository.getMembership(collection._id.toString(), currentUserId)
      : null;
    const pendingRequestsCount =
      membership?.role === 'owner' || membership?.role === 'admin'
        ? await CollectionMembershipRepository.countPendingRequests(collection._id.toString())
        : undefined;

    return {
      id: (collection._id as unknown as { toString: () => string }).toString(),
      ownerId: collection.ownerId.toString(),
      galleryId: collection.galleryId.toString(),
      title: collection.title,
      description: collection.description,
      coverPhotoId: collection.coverPhotoId?.toString(),
      visibility: collection.visibility,
      inviteCode: collection.inviteCode,
      inviteUrl: this.getInviteUrl(collection.inviteCode),
      joinApprovalRequired: collection.joinApprovalRequired,
      currentUserRole: membership?.role,
      pendingRequestsCount,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
    };
  }

  private static mapToJoinRequestInfo(
    request: ICollectionJoinRequest,
    user: IUser
  ): CollectionJoinRequestInfo {
    return {
      id: request._id.toString(),
      collectionId: request.collectionId.toString(),
      userId: request.userId.toString(),
      displayName: user.displayName,
      username: user.username,
      avatar: user.avatar,
      status: request.status,
      requestedAt: request.requestedAt.toISOString(),
    };
  }

  private static async getOrCreateUserGallery(userId: string, username: string) {
    const existingGallery = await GalleryRepository.getGalleryByOwnerId(userId);
    if (existingGallery) {
      return existingGallery;
    }

    return GalleryRepository.upsertGallery(userId, username, {
      title: `${username}'s Gallery`,
      visibility: 'public',
      description: '',
    });
  }

  static async createCollection(
    userId: string,
    username: string,
    data: CreateCollectionRequest
  ): Promise<CollectionInfo> {
    try {
      const gallery = await this.getOrCreateUserGallery(userId, username);
      const collection = await CollectionRepository.createCollection({
        ownerId: userId,
        galleryId: gallery._id.toString(),
        title: data.title,
        description: data.description,
        visibility: data.visibility,
        inviteCode: this.generateInviteCode(),
        joinApprovalRequired: data.joinApprovalRequired,
      });
      await CollectionMembershipRepository.addMember(collection._id.toString(), userId, 'owner');

      return this.mapToCollectionInfo(collection, userId);
    } catch (error) {
      Logger.error(`Error creating collection for user: ${userId}`, error);
      throw new Error('Failed to create collection');
    }
  }

  static async getPublicCollectionsForGallery(galleryId: string): Promise<CollectionInfo[]> {
    try {
      const collections = await CollectionRepository.getCollectionsByGalleryId(galleryId);
      return Promise.all(collections.map((collection) => this.mapToCollectionInfo(collection)));
    } catch (error) {
      Logger.error(`Error getting collections for gallery: ${galleryId}`, error);
      throw new Error('Failed to retrieve collections');
    }
  }

  static async getCollectionsForOwner(userId: string): Promise<CollectionInfo[]> {
    try {
      const ownedCollections = await CollectionRepository.getCollectionsByOwnerId(userId);
      const memberships = await CollectionMembershipRepository.getMembershipsForUser(userId);
      const joinedCollections = await Promise.all(
        memberships
          .filter((membership) => membership.role !== 'owner')
          .map((membership) => CollectionRepository.getCollectionById(membership.collectionId.toString()))
      );
      const collections = [
        ...ownedCollections,
        ...joinedCollections.filter((collection): collection is ICollection => collection !== null),
      ];

      return Promise.all(collections.map((collection) => this.mapToCollectionInfo(collection, userId)));
    } catch (error) {
      Logger.error(`Error getting collections for user: ${userId}`, error);
      throw new Error('Failed to retrieve collections');
    }
  }

  static async getCollectionDetail(
    collectionId: string,
    currentUserId?: string
  ): Promise<CollectionDetailResponse | null> {
    try {
      const collection = await CollectionRepository.getCollectionById(collectionId);
      if (!collection) {
        return null;
      }

      const membership = currentUserId
        ? await CollectionMembershipRepository.getMembership(collection._id.toString(), currentUserId)
        : null;

      if (collection.visibility === 'private' && !membership) {
        return null;
      }

      const owner = await ProfileRepository.getUserById(collection.ownerId.toString());
      if (!owner) {
        return null;
      }

      const photos = await PhotoRepository.getPublishedPhotosByCollection(collection._id.toString());

      return {
        collection: await this.mapToCollectionInfo(collection, currentUserId),
        photos: photos.map((photo) => ({
          id: photo._id.toString(),
          googleDriveFileId: photo.googleDriveFileId,
          visibility: photo.visibility,
          allowDownload: photo.allowDownload,
          publishDate: photo.publishDate.toISOString(),
          dimensions: photo.dimensions,
        })),
        owner: {
          id: owner._id.toString(),
          username: owner.username,
          displayName: owner.displayName,
          avatar: owner.avatar,
          bio: owner.bio,
        },
      };
    } catch (error) {
      Logger.error(`Error getting collection detail: ${collectionId}`, error);
      throw new Error('Failed to retrieve collection');
    }
  }

  static async updateCollection(
    userId: string,
    collectionId: string,
    data: UpdateCollectionRequest
  ): Promise<CollectionInfo | null> {
    try {
      const updatedCollection = await CollectionRepository.updateCollectionForOwner(
        collectionId,
        userId,
        data
      );

      if (!updatedCollection) {
        return null;
      }

      return this.mapToCollectionInfo(updatedCollection, userId);
    } catch (error) {
      Logger.error(`Error updating collection: ${collectionId}`, error);
      throw new Error('Failed to update collection');
    }
  }

  static async userOwnsCollection(userId: string, collectionId: string): Promise<boolean> {
    const collection = await CollectionRepository.getCollectionById(collectionId);
    return collection?.ownerId.toString() === userId;
  }

  static async userCanPublishToCollection(userId: string, collectionId: string): Promise<boolean> {
    const membership = await CollectionMembershipRepository.getMembership(collectionId, userId);
    return membership !== null;
  }

  static async joinCollection(userId: string, data: JoinCollectionRequest): Promise<CollectionInfo | null> {
    const collection = await CollectionRepository.getCollectionByInviteCode(data.inviteCode);

    if (!collection) {
      return null;
    }

    const existingMembership = await CollectionMembershipRepository.getMembership(
      collection._id.toString(),
      userId
    );

    if (existingMembership) {
      return this.mapToCollectionInfo(collection, userId);
    }

    if (!collection.joinApprovalRequired) {
      await CollectionMembershipRepository.addMember(collection._id.toString(), userId, 'member');
      return this.mapToCollectionInfo(collection, userId);
    }

    await CollectionMembershipRepository.createJoinRequest(collection._id.toString(), userId);
    return this.mapToCollectionInfo(collection, userId);
  }

  static async getPendingJoinRequests(
    userId: string,
    collectionId: string
  ): Promise<CollectionJoinRequestInfo[] | null> {
    const membership = await CollectionMembershipRepository.getMembership(collectionId, userId);

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      return null;
    }

    const requests = await CollectionMembershipRepository.getPendingRequests(collectionId);
    const users = await Promise.all(
      requests.map((request) => ProfileRepository.getUserById(request.userId.toString()))
    );

    return requests.flatMap((request, index) => {
      const user = users[index];
      if (!user) return [];
      return [this.mapToJoinRequestInfo(request, user)];
    });
  }

  static async reviewJoinRequest(
    userId: string,
    collectionId: string,
    data: ReviewJoinRequest
  ): Promise<boolean> {
    const membership = await CollectionMembershipRepository.getMembership(collectionId, userId);

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      return false;
    }

    const nextStatus = data.action === 'approve' ? 'approved' : 'rejected';
    const reviewedRequest = await CollectionMembershipRepository.reviewJoinRequest(
      data.requestId,
      userId,
      nextStatus
    );

    if (!reviewedRequest) {
      return false;
    }

    if (data.action === 'approve') {
      await CollectionMembershipRepository.addMember(
        reviewedRequest.collectionId.toString(),
        reviewedRequest.userId.toString(),
        'member'
      );
    }

    return true;
  }
}
