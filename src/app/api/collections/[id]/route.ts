import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateCollectionSchema } from '@/features/collections/schemas/collectionSchema';
import { CollectionService } from '@/features/collections/services/CollectionService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void req;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Collection ID is required', errors: [] },
        { status: 400 }
      );
    }

    const collection = await CollectionService.getCollectionDetail(id);

    if (!collection) {
      return NextResponse.json(
        { success: false, message: 'Collection not found or is private', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Collection retrieved successfully.', data: collection },
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req });

    if (!token?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Collection ID is required', errors: [] },
        { status: 400 }
      );
    }

    const body = await req.json();
    const result = updateCollectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors: result.error.issues },
        { status: 422 }
      );
    }

    const updatedCollection = await CollectionService.updateCollection(
      token.userId as string,
      id,
      result.data
    );

    if (!updatedCollection) {
      return NextResponse.json(
        { success: false, message: 'Collection not found or forbidden', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Collection updated successfully.', data: updatedCollection },
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
