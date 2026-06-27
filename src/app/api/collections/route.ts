import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createCollectionSchema } from '@/features/collections/schemas/collectionSchema';
import { CollectionService } from '@/features/collections/services/CollectionService';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const collections = await CollectionService.getCollectionsForOwner(token.userId as string);

    return NextResponse.json(
      { success: true, message: 'Collections loaded successfully.', data: collections },
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

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.userId || !token?.username) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', errors: [] },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = createCollectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors: result.error.issues },
        { status: 422 }
      );
    }

    const collection = await CollectionService.createCollection(
      token.userId as string,
      token.username as string,
      result.data
    );

    return NextResponse.json(
      { success: true, message: 'Collection created successfully.', data: collection },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error', errors: [] },
      { status: 500 }
    );
  }
}
