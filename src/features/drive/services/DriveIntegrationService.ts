import { GoogleDriveService } from './GoogleDriveService';
import { PhotoRepository } from '../repositories/PhotoRepository';
import { PhotoResponse } from '../types';
import mongoose from 'mongoose';
import { Logger } from '@/utils/logger';
import { CollectionRepository } from '@/features/collections/repositories/CollectionRepository';
import { CollectionService } from '@/features/collections/services/CollectionService';

export class DriveIntegrationService {
  /**
   * Publishes files by validating them via Google Drive and saving metadata to MongoDB.
   * Modifies Drive permissions if needed so the images are viewable in the gallery.
   */
  static async publishFiles(
    userId: string,
    accessToken: string,
    fileIds: string[],
    collectionId?: string
  ): Promise<PhotoResponse[]> {
    const publishedPhotos: PhotoResponse[] = [];
    const collection = collectionId
      ? await CollectionRepository.getCollectionById(collectionId)
      : null;

    if (collectionId && (!collection || !(await CollectionService.userCanPublishToCollection(userId, collectionId)))) {
      throw new Error('Collection not found or forbidden');
    }
    
    for (const fileId of fileIds) {
      try {
        // 1. Fetch metadata from Google Drive to ensure user has access to it
        const driveFile = await GoogleDriveService.getFileMetadata(accessToken, fileId);
        
        if (!driveFile || !driveFile.id) {
          throw new Error('File not found in Google Drive');
        }

        // 2. Update sharing permissions to 'reader' so anyone with the link (the gallery) can view it
        await GoogleDriveService.updateFilePermissions(accessToken, fileId, 'reader');

        // 3. Save to MongoDB
        const metadata = {
          owner: new mongoose.Types.ObjectId(userId),
          googleDriveFileId: fileId,
          dimensions: driveFile.imageMediaMetadata ? {
            width: driveFile.imageMediaMetadata.width || 0,
            height: driveFile.imageMediaMetadata.height || 0,
          } : undefined,
          collectionId: collection ? new mongoose.Types.ObjectId(collection._id.toString()) : undefined,
          galleryId: collection ? new mongoose.Types.ObjectId(collection.galleryId.toString()) : undefined,
          visibility: 'public' as const,
          allowDownload: true, // Default to true, users can change this later
        };

        const photo = await PhotoRepository.saveMetadata(metadata);
        
        publishedPhotos.push({
          id: photo._id.toString(),
          googleDriveFileId: photo.googleDriveFileId,
          visibility: photo.visibility,
          allowDownload: photo.allowDownload,
          publishDate: photo.publishDate.toISOString(),
          dimensions: photo.dimensions,
        });

      } catch (error) {
        Logger.error(`Error publishing file ${fileId}`, error);
        // Continue to the next file even if one fails
      }
    }

    return publishedPhotos;
  }

  /**
   * Unpublishes a file by removing it from MongoDB and optionally reverting Drive permissions.
   */
  static async unpublishFile(userId: string, accessToken: string, fileId: string): Promise<boolean> {
    try {
      // 1. Revert Drive permissions
      await GoogleDriveService.revertFilePermissions(accessToken, fileId);

      // 2. Remove from MongoDB
      return await PhotoRepository.deleteMetadata(userId, fileId);
    } catch (error) {
      Logger.error(`Error unpublishing file ${fileId}`, error);
      throw new Error('Failed to unpublish file');
    }
  }
}
