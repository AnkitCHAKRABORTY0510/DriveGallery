import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { PhotoRepository } from '@/features/drive/repositories/PhotoRepository';
import { CollectionMembershipRepository } from '@/features/collections/repositories/CollectionMembershipRepository';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void req;

  try {
    const token = await getToken({ req });

    if (!token?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const { id } = await params;
    const photo = await PhotoRepository.getPhotoById(id);

    if (!photo?.collectionId) {
      return NextResponse.json(
        { success: false, message: 'Photo not found in a collection.', errors: [] },
        { status: 404 }
      );
    }

    const isPhotoOwner = photo.owner.toString() === token.userId;
    const membership = await CollectionMembershipRepository.getMembership(
      photo.collectionId.toString(),
      token.userId as string
    );
    const isCollectionAdmin = membership?.role === 'owner' || membership?.role === 'admin';

    if (!isPhotoOwner && !isCollectionAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden', errors: [] },
        { status: 403 }
      );
    }

    const updatedPhoto = await PhotoRepository.removePhotoFromCollection(id);

    return NextResponse.json(
      { success: true, message: 'Photo removed from collection.', data: updatedPhoto },
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
