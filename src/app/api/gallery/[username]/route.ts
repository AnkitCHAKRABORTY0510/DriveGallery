import { NextRequest, NextResponse } from 'next/server';
import { GalleryService } from '@/features/gallery/services/GalleryService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username is required', errors: [] },
        { status: 400 }
      );
    }

    const publicGallery = await GalleryService.getPublicGallery(username);

    if (!publicGallery) {
      return NextResponse.json(
        { success: false, message: 'Gallery not found or is private', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: publicGallery },
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
