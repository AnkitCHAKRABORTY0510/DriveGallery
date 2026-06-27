import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { reviewJoinRequestSchema } from '@/features/collections/schemas/collectionSchema';
import { CollectionService } from '@/features/collections/services/CollectionService';

export async function GET(
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
    const requests = await CollectionService.getPendingJoinRequests(token.userId as string, id);

    if (!requests) {
      return NextResponse.json(
        { success: false, message: 'Collection not found or forbidden.', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Join requests loaded successfully.', data: requests },
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
    const body = await req.json();
    const result = reviewJoinRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors: result.error.issues },
        { status: 422 }
      );
    }

    const reviewed = await CollectionService.reviewJoinRequest(
      token.userId as string,
      id,
      result.data
    );

    if (!reviewed) {
      return NextResponse.json(
        { success: false, message: 'Join request not found or forbidden.', errors: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Join request reviewed successfully.', data: {} },
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
