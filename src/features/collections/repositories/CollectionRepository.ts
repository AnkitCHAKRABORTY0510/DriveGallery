import mongoose from 'mongoose';
import { connectToDatabase } from '@/repositories/db';
import { Collection, ICollection } from '@/models/Collection';

interface CreateCollectionData {
  ownerId: string;
  galleryId: string;
  title: string;
  description?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  inviteCode: string;
  joinApprovalRequired?: boolean;
}

interface UpdateCollectionData {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  coverPhotoId?: string;
  joinApprovalRequired?: boolean;
}

export class CollectionRepository {
  static async createCollection(data: CreateCollectionData): Promise<ICollection> {
    await connectToDatabase();
    return Collection.create({
      ownerId: new mongoose.Types.ObjectId(data.ownerId),
      galleryId: new mongoose.Types.ObjectId(data.galleryId),
      title: data.title,
      description: data.description,
      visibility: data.visibility ?? 'public',
      inviteCode: data.inviteCode,
      joinApprovalRequired: data.joinApprovalRequired ?? true,
    });
  }

  static async getCollectionById(collectionId: string): Promise<ICollection | null> {
    await connectToDatabase();
    if (!mongoose.isValidObjectId(collectionId)) {
      return null;
    }
    return Collection.findById(collectionId);
  }

  static async getCollectionByInviteCode(inviteCode: string): Promise<ICollection | null> {
    await connectToDatabase();
    return Collection.findOne({ inviteCode: inviteCode.toUpperCase() });
  }

  static async getCollectionsByGalleryId(galleryId: string, includePrivate = false): Promise<ICollection[]> {
    await connectToDatabase();
    const query = includePrivate
      ? { galleryId: new mongoose.Types.ObjectId(galleryId) }
      : {
          galleryId: new mongoose.Types.ObjectId(galleryId),
          visibility: 'public',
        };

    return Collection.find(query).sort({ createdAt: -1 });
  }

  static async getCollectionsByOwnerId(ownerId: string): Promise<ICollection[]> {
    await connectToDatabase();
    return Collection.find({ ownerId: new mongoose.Types.ObjectId(ownerId) }).sort({ createdAt: -1 });
  }

  static async updateCollectionForOwner(
    collectionId: string,
    ownerId: string,
    data: UpdateCollectionData
  ): Promise<ICollection | null> {
    await connectToDatabase();
    if (!mongoose.isValidObjectId(collectionId)) {
      return null;
    }

    const update: {
      title?: string;
      description?: string;
      visibility?: 'public' | 'private' | 'unlisted';
      coverPhotoId?: mongoose.Types.ObjectId;
      joinApprovalRequired?: boolean;
    } = {};

    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.visibility !== undefined) update.visibility = data.visibility;
    if (data.joinApprovalRequired !== undefined) update.joinApprovalRequired = data.joinApprovalRequired;
    if (data.coverPhotoId !== undefined) {
      update.coverPhotoId = new mongoose.Types.ObjectId(data.coverPhotoId);
    }

    return Collection.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(collectionId),
        ownerId: new mongoose.Types.ObjectId(ownerId),
      },
      { $set: update },
      { new: true, runValidators: true }
    );
  }
}
