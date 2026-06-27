import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  visibility: 'public' | 'private' | 'unlisted';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
