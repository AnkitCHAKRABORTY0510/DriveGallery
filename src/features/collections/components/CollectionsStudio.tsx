'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Copy, FolderPlus, QrCode, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollections } from '@/features/collections/hooks/useCollections';
import { CollectionInfo } from '@/features/collections/types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

function InviteQr({ inviteUrl }: { inviteUrl: string }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    void QRCode.toDataURL(inviteUrl, {
      margin: 1,
      width: 144,
      color: {
        dark: '#111111',
        light: '#ffffff',
      },
    }).then(setQrDataUrl);
  }, [inviteUrl]);

  if (!qrDataUrl) {
    return <div className="size-36 rounded-lg bg-muted" aria-label="QR code loading" />;
  }

  return (
    <Image
      src={qrDataUrl}
      alt="Collection invite QR code"
      width={144}
      height={144}
      className="rounded-lg"
      unoptimized
    />
  );
}

function CollectionCard({ collection }: { collection: CollectionInfo }) {
  const inviteUrl =
    typeof window === 'undefined'
      ? collection.inviteUrl
      : `${window.location.origin}${collection.inviteUrl}`;

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied.');
  };

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {collection.currentUserRole ?? 'collection'}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground">{collection.title}</h2>
          {collection.description && (
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{collection.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-lg border border-border px-2 py-1">Code {collection.inviteCode}</span>
            <span className="rounded-lg border border-border px-2 py-1">
              {collection.joinApprovalRequired ? 'Admin approval required' : 'Open join'}
            </span>
            {collection.pendingRequestsCount ? (
              <span className="rounded-lg border border-border px-2 py-1">
                {collection.pendingRequestsCount} pending requests
              </span>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild variant="outline" className="min-h-11 rounded-lg">
              <Link href={`/collections/${collection.id}`}>Open Collection</Link>
            </Button>
            <Button variant="ghost" className="min-h-11 rounded-lg" onClick={copyInvite}>
              <Copy className="size-4" />
              Copy Invite
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-2">
          <InviteQr inviteUrl={inviteUrl} />
        </div>
      </div>
    </article>
  );
}

export function CollectionsStudio() {
  const { collections, createCollection, fetchCollections, isLoading } = useCollections();
  const [title, setTitle] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    void fetchCollections();
  }, [fetchCollections]);

  const handleCreateCollection = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.info('Name your collection first.');
      return;
    }

    const result = await createCollection({
      title: trimmedTitle,
      visibility: 'public',
      joinApprovalRequired: true,
    });

    if (!result.success) {
      toast.error(result.error || 'Could not create collection.');
      return;
    }

    setTitle('');
    toast.success('Collection created.');
  };

  const handleJoinCollection = async () => {
    const code = inviteCode.trim();

    if (!code) {
      toast.info('Enter an invite code first.');
      return;
    }

    const res = await fetch('/api/collections/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode: code }),
    });
    const json = (await res.json()) as ApiResponse<CollectionInfo>;

    if (!json.success) {
      toast.error(json.message || 'Could not join collection.');
      return;
    }

    setInviteCode('');
    await fetchCollections();
    toast.success('Join request sent.');
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 py-10 lg:px-8">
      <section className="mb-10 max-w-4xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Collections
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
          Shared albums for real moments.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
          Create a collection, share the invite code or QR link, approve members, and let everyone publish their Drive photos into one album.
        </p>
      </section>

      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <FolderPlus className="mb-6 size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Create collection</h2>
          <div className="mt-4 flex gap-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              placeholder="Birthday, wedding, trip..."
            />
            <Button className="min-h-11 rounded-lg" onClick={handleCreateCollection}>
              Create
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <QrCode className="mb-6 size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Join by invite code</h2>
          <div className="mt-4 flex gap-2">
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm uppercase text-foreground"
              placeholder="INVITE CODE"
            />
            <Button variant="outline" className="min-h-11 rounded-lg" onClick={handleJoinCollection}>
              Join
            </Button>
          </div>
        </div>
      </section>

      {collections.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
          <Users className="mb-6 size-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">No collections yet</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Create your first collaborative album or join one with an invite code.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {isLoading && <p className="mt-4 text-sm text-muted-foreground">Refreshing collections...</p>}
    </div>
  );
}
