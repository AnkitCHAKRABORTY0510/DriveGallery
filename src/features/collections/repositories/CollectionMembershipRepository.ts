import mongoose from 'mongoose';
import { connectToDatabase } from '@/repositories/db';
import { CollectionJoinRequest, ICollectionJoinRequest } from '@/models/CollectionJoinRequest';
import { CollectionMember, CollectionMemberRole, ICollectionMember } from '@/models/CollectionMember';

export class CollectionMembershipRepository {
  static async addMember(
    collectionId: string,
    userId: string,
    role: CollectionMemberRole = 'member'
  ): Promise<ICollectionMember> {
    await connectToDatabase();
    return CollectionMember.findOneAndUpdate(
      {
        collectionId: new mongoose.Types.ObjectId(collectionId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      {
        $set: {
          role,
          joinedAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );
  }

  static async getMembership(collectionId: string, userId: string): Promise<ICollectionMember | null> {
    await connectToDatabase();
    return CollectionMember.findOne({
      collectionId: new mongoose.Types.ObjectId(collectionId),
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  static async getMembershipsForUser(userId: string): Promise<ICollectionMember[]> {
    await connectToDatabase();
    return CollectionMember.find({ userId: new mongoose.Types.ObjectId(userId) });
  }

  static async createJoinRequest(collectionId: string, userId: string): Promise<ICollectionJoinRequest> {
    await connectToDatabase();
    return CollectionJoinRequest.findOneAndUpdate(
      {
        collectionId: new mongoose.Types.ObjectId(collectionId),
        userId: new mongoose.Types.ObjectId(userId),
        status: 'pending',
      },
      {
        $setOnInsert: {
          collectionId: new mongoose.Types.ObjectId(collectionId),
          userId: new mongoose.Types.ObjectId(userId),
          status: 'pending',
          requestedAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );
  }

  static async getPendingRequests(collectionId: string): Promise<ICollectionJoinRequest[]> {
    await connectToDatabase();
    return CollectionJoinRequest.find({
      collectionId: new mongoose.Types.ObjectId(collectionId),
      status: 'pending',
    }).sort({ requestedAt: -1 });
  }

  static async countPendingRequests(collectionId: string): Promise<number> {
    await connectToDatabase();
    return CollectionJoinRequest.countDocuments({
      collectionId: new mongoose.Types.ObjectId(collectionId),
      status: 'pending',
    });
  }

  static async reviewJoinRequest(
    requestId: string,
    reviewerId: string,
    status: 'approved' | 'rejected'
  ): Promise<ICollectionJoinRequest | null> {
    await connectToDatabase();
    if (!mongoose.isValidObjectId(requestId)) {
      return null;
    }

    return CollectionJoinRequest.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status,
          reviewedBy: new mongoose.Types.ObjectId(reviewerId),
          reviewedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );
  }
}
