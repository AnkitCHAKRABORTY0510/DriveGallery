import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { GoogleDriveService } from '@/features/drive/services/GoogleDriveService';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || !token?.accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized or missing Google Access Token', errors: [] },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const pageToken = searchParams.get('pageToken') || undefined;

    const result = await GoogleDriveService.listFiles(token.accessToken as string, pageToken);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error', errors: [] },
      { status: 500 }
    );
  }
}
