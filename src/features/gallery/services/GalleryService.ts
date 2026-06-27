import { GalleryRepository } from '../repositories/GalleryRepository';
import { PhotoRepository } from '../../drive/repositories/PhotoRepository';
import { ProfileRepository } from '../../profile/repositories/ProfileRepository';
import { GalleryInfo, PublicGalleryResponse, UpdateGalleryRequest } from '../types';
import { IGallery } from '@/models/Gallery';
import { CollectionService } from '@/features/collections/services/CollectionService';

export class GalleryService {
  private static mapToGalleryInfo(gallery: IGallery): GalleryInfo {
    return {
      id: (gallery._id as unknown as { toString: () => string }).toString(),
      ownerId: (gallery.ownerId as unknown as { toString: () => string }).toString(),
      title: gallery.title,
      slug: gallery.slug,
      visibility: gallery.visibility,
      description: gallery.description,
      createdAt: gallery.createdAt.toISOString(),
      updatedAt: gallery.updatedAt.toISOString(),
    };
  }

  /**
   * Retrieves a gallery and all of its published photos by the username (slug).
   */
  static async getPublicGallery(username: string): Promise<PublicGalleryResponse | null> {
    const gallery = await GalleryRepository.getGalleryBySlug(username);
    if (!gallery) {
      // If no gallery exists yet, check if the user exists.
      // If user exists, lazily create a default gallery for them.
      const user = await ProfileRepository.getUserByUsername(username);
      if (!user) {
        return null;
      }
      
      const defaultGallery = await GalleryRepository.upsertGallery(
        user._id.toString(),
        username,
        {
          title: `${user.displayName}'s Gallery`,
          visibility: 'public',
          description: '',
        }
      );
      
      return this.assembleGalleryResponse(defaultGallery);
    }

    if (gallery.visibility === 'private') {
      return null;
    }

    return this.assembleGalleryResponse(gallery);
  }

  private static async assembleGalleryResponse(gallery: IGallery): Promise<PublicGalleryResponse> {
    const [photos, collections] = await Promise.all([
      PhotoRepository.getPublishedPhotosByUser(gallery.ownerId.toString()),
      CollectionService.getPublicCollectionsForGallery(gallery._id.toString()),
    ]);
    
    const mappedPhotos = photos.map(p => ({
      id: p._id.toString(),
      googleDriveFileId: p.googleDriveFileId,
      visibility: p.visibility,
      allowDownload: p.allowDownload,
      publishDate: p.publishDate.toISOString(),
      dimensions: p.dimensions,
    }));

    return {
      gallery: this.mapToGalleryInfo(gallery),
      photos: mappedPhotos,
      collections,
      featured: [], // Future task
    };
  }

  /**
   * Updates settings for a user's gallery.
   */
  static async updateGallerySettings(userId: string, username: string, data: UpdateGalleryRequest): Promise<GalleryInfo> {
    const gallery = await GalleryRepository.upsertGallery(userId, username, {
      title: data.title,
      description: data.description,
      visibility: data.visibility,
    });

    return this.mapToGalleryInfo(gallery);
  }
}
