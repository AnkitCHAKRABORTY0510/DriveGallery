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

    const stats = await GoogleDriveService.getImageStats(token.accessToken as string);

    return NextResponse.json(
      { success: true, message: 'Drive stats loaded successfully.', data: stats },
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
