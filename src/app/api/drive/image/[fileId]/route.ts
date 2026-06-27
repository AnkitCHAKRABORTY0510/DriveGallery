import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { GoogleDriveService } from '@/features/drive/services/GoogleDriveService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || !token?.accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized or missing Google Access Token', errors: [] },
        { status: 401 }
      );
    }

    const { fileId } = await params;
    if (!fileId) {
      return NextResponse.json(
        { success: false, message: 'File ID is required', errors: [] },
        { status: 400 }
      );
    }

    const imageResponse = await GoogleDriveService.getFileContent(token.accessToken as string, fileId);

    if (!imageResponse?.body) {
      return NextResponse.json(
        { success: false, message: 'Image unavailable', errors: [] },
        { status: 404 }
      );
    }

    return new NextResponse(imageResponse.body, {
      status: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'private, max-age=600, stale-while-revalidate=60',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error', errors: [] },
      { status: 500 }
    );
  }
}
