import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { joinCollectionSchema } from '@/features/collections/schemas/collectionSchema';
import { CollectionService } from '@/features/collections/services/CollectionService';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = joinCollectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors: result.error.issues },
        { status: 422 }
      );
    }

    const collection = await CollectionService.joinCollection(token.userId as string, result.data);

    if (!collection) {
      return NextResponse.json(
        { success: false, message: 'Collection invite not found.', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Join request submitted.', data: collection },
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
