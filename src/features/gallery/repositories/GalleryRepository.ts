import { connectToDatabase } from '@/repositories/db';
import { Gallery, IGallery } from '@/models/Gallery';
import mongoose from 'mongoose';

export class GalleryRepository {
  static async getGalleryByOwnerId(ownerId: string): Promise<IGallery | null> {
    await connectToDatabase();
    return Gallery.findOne({ ownerId: new mongoose.Types.ObjectId(ownerId) });
  }

  static async getGalleryBySlug(slug: string): Promise<IGallery | null> {
    await connectToDatabase();
    return Gallery.findOne({ slug });
  }

  static async upsertGallery(ownerId: string, slug: string, data: Partial<IGallery>): Promise<IGallery> {
    await connectToDatabase();
    const updated = await Gallery.findOneAndUpdate(
      { ownerId: new mongoose.Types.ObjectId(ownerId) },
      {
        $set: {
          ...data,
          slug, // Keep slug consistent (usually username)
        },
      },
      { new: true, upsert: true, runValidators: true }
    );
    return updated;
  }
}
