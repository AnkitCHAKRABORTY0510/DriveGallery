import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  ownerId: mongoose.Types.ObjectId;
  galleryId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  coverPhotoId?: mongoose.Types.ObjectId;
  visibility: 'public' | 'private' | 'unlisted';
  inviteCode: string;
  joinApprovalRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    galleryId: { type: Schema.Types.ObjectId, ref: 'Gallery', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    coverPhotoId: { type: Schema.Types.ObjectId, ref: 'Photo' },
    visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public', index: true },
    inviteCode: { type: String, required: true, unique: true, index: true },
    joinApprovalRequired: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CollectionSchema.index({ galleryId: 1, title: 1 });

export const Collection =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
