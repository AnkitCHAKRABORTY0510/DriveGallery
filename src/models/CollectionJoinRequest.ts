import mongoose, { Schema, Document } from 'mongoose';

export type CollectionJoinRequestStatus = 'pending' | 'approved' | 'rejected';

export interface ICollectionJoinRequest extends Document {
  collectionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: CollectionJoinRequestStatus;
  requestedAt: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionJoinRequestSchema = new Schema<ICollectionJoinRequest>(
  {
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    requestedAt: { type: Date, default: Date.now },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

CollectionJoinRequestSchema.index({ collectionId: 1, userId: 1, status: 1 });

export const CollectionJoinRequest =
  mongoose.models.CollectionJoinRequest ||
  mongoose.model<ICollectionJoinRequest>('CollectionJoinRequest', CollectionJoinRequestSchema);
