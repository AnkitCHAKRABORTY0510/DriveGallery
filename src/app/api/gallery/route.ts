import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateGallerySchema } from '@/features/gallery/schemas/gallerySchema';
import { GalleryService } from '@/features/gallery/services/GalleryService';

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || !token?.username) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = updateGallerySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors: result.error.issues },
        { status: 422 }
      );
    }

    const updatedGallery = await GalleryService.updateGallerySettings(
      token.userId as string,
      token.username as string,
      result.data
    );

    return NextResponse.json(
      { success: true, message: 'Gallery updated successfully.', data: updatedGallery },
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
