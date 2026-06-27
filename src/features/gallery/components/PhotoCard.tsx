'use client';

import Image from 'next/image';
import { GalleryPhoto } from '../types';
import { Download, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PhotoCardProps {
  photo: GalleryPhoto;
  onView: (photo: GalleryPhoto) => void;
}

function getGalleryAspectClass(photo: GalleryPhoto): string {
  const width = photo.dimensions?.width ?? 4;
  const height = photo.dimensions?.height ?? 3;
  const ratio = width / height;

  if (ratio < 0.75) return 'aspect-[3/4]';
  if (ratio > 1.45) return 'aspect-[16/10]';
  return 'aspect-[4/3]';
}

export function PhotoCard({ photo, onView }: PhotoCardProps) {
  const imageUrl = `https://lh3.googleusercontent.com/d/${photo.googleDriveFileId}=w1800`;
  
  const formattedDate = formatDistanceToNow(new Date(photo.publishDate), { addSuffix: true });

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={() => onView(photo)}
      className="group relative mb-4 w-full break-inside-avoid cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30"
    >
      <div className={`relative w-full bg-black ${getGalleryAspectClass(photo)}`}>
        <Image
          src={imageUrl}
          alt="Gallery Photo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          unoptimized
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
          <div className="flex justify-end space-x-2">
            {photo.allowDownload && (
              <a
                href={`https://drive.google.com/uc?export=download&id=${photo.googleDriveFileId}`}
                onClick={handleDownload}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-colors"
                title="Download original"
              >
                <Download size={18} />
              </a>
            )}
            <button
              className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-colors"
              title="View full size"
            >
              <Eye size={18} />
            </button>
          </div>
          
          <div>
            <p className="text-xs text-zinc-300">Published {formattedDate}</p>
            {photo.dimensions && (
              <p className="text-[10px] text-zinc-400">
                {photo.dimensions.width} x {photo.dimensions.height} px
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
