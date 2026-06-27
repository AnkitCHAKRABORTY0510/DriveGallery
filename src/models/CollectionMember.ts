import mongoose, { Schema, Document } from 'mongoose';

export type CollectionMemberRole = 'owner' | 'admin' | 'member';

export interface ICollectionMember extends Document {
  collectionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: CollectionMemberRole;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionMemberSchema = new Schema<ICollectionMember>(
  {
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CollectionMemberSchema.index({ collectionId: 1, userId: 1 }, { unique: true });

export const CollectionMember =
  mongoose.models.CollectionMember ||
  mongoose.model<ICollectionMember>('CollectionMember', CollectionMemberSchema);
