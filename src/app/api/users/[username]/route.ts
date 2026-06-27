import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/features/profile/services/ProfileService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const publicProfile = await ProfileService.getPublicProfile(username);

    if (!publicProfile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: publicProfile },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', errors: [] },
      { status: 500 }
    );
  }
}
