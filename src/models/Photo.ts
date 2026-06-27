import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  owner: mongoose.Types.ObjectId;
  googleDriveFileId: string;
  collectionId?: mongoose.Types.ObjectId;
  galleryId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  dimensions?: {
    width: number;
    height: number;
  };
  visibility: 'public' | 'private' | 'event';
  allowDownload: boolean;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    googleDriveFileId: { type: String, required: true, unique: true },
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection' },
    galleryId: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    visibility: { type: String, enum: ['public', 'private', 'event'], default: 'private' },
    allowDownload: { type: Boolean, default: false },
    publishDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Photo = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
