'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Check, Copy, UserCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryGrid } from '@/features/gallery/components/GalleryGrid';
import { CollectionDetailResponse, CollectionJoinRequestInfo } from '@/features/collections/types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface CollectionDetailViewProps {
  initialData: CollectionDetailResponse;
}

export function CollectionDetailView({ initialData }: CollectionDetailViewProps) {
  const [requests, setRequests] = useState<CollectionJoinRequestInfo[]>([]);
  const canReview =
    initialData.collection.currentUserRole === 'owner' ||
    initialData.collection.currentUserRole === 'admin';

  const inviteUrl =
    typeof window === 'undefined'
      ? initialData.collection.inviteUrl
      : `${window.location.origin}${initialData.collection.inviteUrl}`;

  useEffect(() => {
    if (!canReview) return;

    const loadRequests = async () => {
      const res = await fetch(`/api/collections/${initialData.collection.id}/requests`);
      const json = (await res.json()) as ApiResponse<CollectionJoinRequestInfo[]>;
      if (json.success && json.data) {
        setRequests(json.data);
      }
    };

    void loadRequests();
  }, [canReview, initialData.collection.id]);

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite copied.');
  };

  const reviewRequest = async (requestId: string, action: 'approve' | 'reject') => {
    const res = await fetch(`/api/collections/${initialData.collection.id}/requests`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, action }),
    });
    const json = (await res.json()) as ApiResponse<Record<string, never>>;

    if (!json.success) {
      toast.error(json.message || 'Could not review request.');
      return;
    }

    setRequests((currentRequests) => currentRequests.filter((request) => request.id !== requestId));
    toast.success(action === 'approve' ? 'Member approved.' : 'Request rejected.');
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 py-10 lg:px-8">
      <section className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Collection
          </p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            {initialData.collection.title}
          </h1>
          {initialData.collection.description && (
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
              {initialData.collection.description}
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Owned by @{initialData.owner.username}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="min-h-11 rounded-lg" onClick={copyInvite}>
            <Copy className="size-4" />
            Copy Invite
          </Button>
          <Button asChild className="min-h-11 rounded-lg">
            <Link href="/studio">Publish Photos</Link>
          </Button>
        </div>
      </section>

      {canReview && requests.length > 0 && (
        <section className="mb-10 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <UserCheck className="size-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Pending members</h2>
          </div>
          <div className="grid gap-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{request.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{request.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="min-h-11 rounded-lg"
                    onClick={() => reviewRequest(request.id, 'approve')}
                  >
                    <Check className="size-4" />
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    className="min-h-11 rounded-lg"
                    onClick={() => reviewRequest(request.id, 'reject')}
                  >
                    <X className="size-4" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <GalleryGrid photos={initialData.photos} />
    </div>
  );
}
