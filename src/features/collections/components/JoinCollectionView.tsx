'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollectionInfo } from '@/features/collections/types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface JoinCollectionViewProps {
  inviteCode: string;
}

export function JoinCollectionView({ inviteCode }: JoinCollectionViewProps) {
  const [collection, setCollection] = useState<CollectionInfo | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const joinCollection = async () => {
    setIsJoining(true);
    const res = await fetch('/api/collections/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode }),
    });
    const json = (await res.json()) as ApiResponse<CollectionInfo>;
    setIsJoining(false);

    if (!json.success || !json.data) {
      toast.error(json.message || 'Could not join collection.');
      return;
    }

    setCollection(json.data);
    toast.success(
      json.data.currentUserRole ? 'Collection joined.' : 'Join request sent for approval.'
    );
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-10 text-center">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        Collection Invite
      </p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
        Join this shared album.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
        Invite code <span className="text-foreground">{inviteCode}</span> will request access to this collection.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button className="min-h-11 rounded-lg" disabled={isJoining} onClick={joinCollection}>
          {isJoining ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
          Join Collection
        </Button>
        {collection && (
          <Button asChild variant="outline" className="min-h-11 rounded-lg">
            <Link href={`/collections/${collection.id}`}>Open Collection</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
