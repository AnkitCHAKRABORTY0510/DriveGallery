import { connectToDatabase } from '@/repositories/db';
import { Photo, IPhoto } from '@/models/Photo';
import mongoose from 'mongoose';

export class PhotoRepository {
  static async saveMetadata(data: Partial<IPhoto>): Promise<IPhoto> {
    await connectToDatabase();
    // If the photo is already published (same googleDriveFileId), we update it instead of creating a duplicate
    const updated = await Photo.findOneAndUpdate(
      { googleDriveFileId: data.googleDriveFileId, owner: data.owner },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
    return updated;
  }

  static async deleteMetadata(ownerId: string, googleDriveFileId: string): Promise<boolean> {
    await connectToDatabase();
    const result = await Photo.deleteOne({
      owner: new mongoose.Types.ObjectId(ownerId),
      googleDriveFileId,
    });
    return result.deletedCount === 1;
  }

  static async getPublishedPhotosByUser(ownerId: string): Promise<IPhoto[]> {
    await connectToDatabase();
    return Photo.find({ owner: new mongoose.Types.ObjectId(ownerId) }).sort({ publishDate: -1 });
  }

  static async getPublishedPhotosByCollection(collectionId: string): Promise<IPhoto[]> {
    await connectToDatabase();
    return Photo.find({ collectionId: new mongoose.Types.ObjectId(collectionId) }).sort({ publishDate: -1 });
  }

  static async getPhotoByDriveId(googleDriveFileId: string): Promise<IPhoto | null> {
    await connectToDatabase();
    return Photo.findOne({ googleDriveFileId });
  }

  static async getPhotoById(photoId: string): Promise<IPhoto | null> {
    await connectToDatabase();
    if (!mongoose.isValidObjectId(photoId)) {
      return null;
    }
    return Photo.findById(photoId);
  }

  static async removePhotoFromCollection(photoId: string): Promise<IPhoto | null> {
    await connectToDatabase();
    if (!mongoose.isValidObjectId(photoId)) {
      return null;
    }
    return Photo.findByIdAndUpdate(
      photoId,
      { $unset: { collectionId: '' } },
      { new: true, runValidators: true }
    );
  }
}
