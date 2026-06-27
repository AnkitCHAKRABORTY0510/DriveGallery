import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ProfileService } from '@/features/profile/services/ProfileService';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() ?? '';

    if (query.length < 2) {
      return NextResponse.json(
        { success: true, message: 'Search query too short.', data: [] },
        { status: 200 }
      );
    }

    const users = await ProfileService.searchUsers(query);

    return NextResponse.json(
      { success: true, message: 'Users loaded successfully.', data: users },
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
