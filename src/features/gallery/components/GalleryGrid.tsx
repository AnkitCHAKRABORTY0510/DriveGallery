'use client';

import { GalleryPhoto } from '../types';
import { PhotoCard } from './PhotoCard';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface GalleryGridProps {
  photos: GalleryPhoto[];
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
        <p className="text-lg font-medium">No photos published in this gallery yet.</p>
        <p className="text-sm mt-1">Photos published from Google Drive will appear here.</p>
      </div>
    );
  }

  return (
    <PhotoProvider>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 2xl:columns-4">
        {photos.map((photo) => (
          <PhotoView 
            key={photo.id} 
            src={`https://lh3.googleusercontent.com/d/${photo.googleDriveFileId}=w2400`}
          >
            {/* The child of PhotoView needs to trigger it. Div works perfectly */}
            <div className="h-full">
              <PhotoCard photo={photo} onView={() => {}} />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
