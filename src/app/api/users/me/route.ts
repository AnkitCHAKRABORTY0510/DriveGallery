import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config/authOptions';
import { ProfileService } from '@/features/profile/services/ProfileService';
import { updateProfileSchema } from '@/features/profile/schemas/profileSchema';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const profile = await ProfileService.getCurrentUserProfile(session.user.id);
    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: profile },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', errors: [] },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed.', 
          errors: result.error.issues 
        },
        { status: 422 }
      );
    }

    const updatedProfile = await ProfileService.updateCurrentUserProfile(session.user.id, result.data);
    
    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Profile updated successfully.', data: updatedProfile },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', errors: [] },
      { status: 500 }
    );
  }
}
