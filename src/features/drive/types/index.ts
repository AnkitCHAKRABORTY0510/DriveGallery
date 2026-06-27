export interface PublishRequest {
  files: string[];
  collectionId?: string;
}

export interface UnpublishRequest {
  fileId: string;
}

export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  ownedByMe?: boolean;
  shared?: boolean;
  imageMediaMetadata?: {
    width: number;
    height: number;
  };
  createdTime: string;
  modifiedTime: string;
}

export interface DriveStats {
  totalImages: number;
  ownedImages: number;
  sharedImages: number;
}

export interface PhotoResponse {
  id: string;
  googleDriveFileId: string;
  visibility: string;
  allowDownload: boolean;
  publishDate: string;
  dimensions?: {
    width: number;
    height: number;
  };
}
