import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { publishRequestSchema } from '@/features/drive/schemas/driveSchema';
import { DriveIntegrationService } from '@/features/drive/services/DriveIntegrationService';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || !token?.accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized or missing Google Access Token', errors: [] },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = publishRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors: result.error.issues },
        { status: 422 }
      );
    }

    const publishedPhotos = await DriveIntegrationService.publishFiles(
      token.userId as string,
      token.accessToken as string,
      result.data.files,
      result.data.collectionId
    );

    return NextResponse.json(
      { success: true, message: 'Files published successfully.', data: publishedPhotos },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error', errors: [] },
      { status: 500 }
    );
  }
}
