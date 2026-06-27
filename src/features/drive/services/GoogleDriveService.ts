import { google, drive_v3 } from 'googleapis';

export class GoogleDriveService {
  private static getDriveClient(accessToken: string): drive_v3.Drive {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.drive({ version: 'v3', auth });
  }

  static async listFiles(accessToken: string, pageToken?: string) {
    const drive = this.getDriveClient(accessToken);
    const response = await drive.files.list({
      q: "mimeType contains 'image/' and trashed = false",
      fields: 'nextPageToken, files(id, name, mimeType, thumbnailLink, ownedByMe, shared, imageMediaMetadata, createdTime, modifiedTime)',
      pageSize: 50,
      pageToken,
    });
    return {
      files: response.data.files || [],
      nextPageToken: response.data.nextPageToken,
    };
  }

  static async getImageStats(accessToken: string) {
    let pageToken: string | undefined;
    let totalImages = 0;
    let ownedImages = 0;
    let sharedImages = 0;

    do {
      const result = await this.listFiles(accessToken, pageToken);

      for (const file of result.files) {
        totalImages += 1;
        if (file.ownedByMe) {
          ownedImages += 1;
        } else if (file.shared) {
          sharedImages += 1;
        }
      }

      pageToken = result.nextPageToken || undefined;
    } while (pageToken);

    return {
      totalImages,
      ownedImages,
      sharedImages,
    };
  }

  static async getFileMetadata(accessToken: string, fileId: string) {
    const drive = this.getDriveClient(accessToken);
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, thumbnailLink, ownedByMe, shared, imageMediaMetadata, createdTime, modifiedTime',
    });
    return response.data;
  }

  static async getFileContent(accessToken: string, fileId: string): Promise<Response | null> {
    const metadata = await this.getFileMetadata(accessToken, fileId);

    if (!metadata.mimeType?.startsWith('image/')) {
      return null;
    }

    if (this.needsBrowserSafePreview(metadata.mimeType)) {
      return this.getBrowserSafePreview(accessToken, metadata.thumbnailLink);
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response;
  }

  private static needsBrowserSafePreview(mimeType: string): boolean {
    return mimeType === 'image/heic' || mimeType === 'image/heif';
  }

  private static getHighResolutionPreviewUrl(thumbnailLink?: string | null): string | null {
    if (!thumbnailLink) {
      return null;
    }

    if (/[=]s\d+/.test(thumbnailLink)) {
      return thumbnailLink.replace(/[=]s\d+/, '=s2400');
    }

    return `${thumbnailLink}=s2400`;
  }

  private static async getBrowserSafePreview(
    accessToken: string,
    thumbnailLink?: string | null
  ): Promise<Response | null> {
    const previewUrl = this.getHighResolutionPreviewUrl(thumbnailLink);

    if (!previewUrl) {
      return null;
    }

    const response = await fetch(previewUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response;
  }

  static async updateFilePermissions(accessToken: string, fileId: string, role: 'reader' | 'commenter' | 'writer') {
    const drive = this.getDriveClient(accessToken);
    // Create a public permission
    await drive.permissions.create({
      fileId,
      requestBody: {
        role,
        type: 'anyone',
      },
    });
  }

  static async revertFilePermissions(accessToken: string, fileId: string) {
    const drive = this.getDriveClient(accessToken);
    // Remove "anyone" permissions if we can find them
    const permissions = await drive.permissions.list({ fileId });
    const anyonePermission = permissions.data.permissions?.find((p) => p.type === 'anyone');
    if (anyonePermission?.id) {
      await drive.permissions.delete({
        fileId,
        permissionId: anyonePermission.id,
      });
    }
  }
}
