'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Check, Eye, FolderPlus, ImageIcon, Loader2, RefreshCw, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollections } from '@/features/collections/hooks/useCollections';
import { useDrive } from '@/features/drive/hooks/useDrive';
import { DriveFileMetadata } from '@/features/drive/types';
import { cn } from '@/utils/cn';

interface DriveStudioProps {
  username: string;
}

type GroupMode = 'none' | 'day' | 'week' | 'month' | 'year';
type LayoutMode = 'album' | 'grid' | 'compact';

function formatDimensions(file: DriveFileMetadata): string {
  const width = file.imageMediaMetadata?.width;
  const height = file.imageMediaMetadata?.height;

  if (!width || !height) {
    return 'Dimensions unavailable';
  }

  return `${width} x ${height}`;
}

function formatGroupLabel(date: Date, groupMode: GroupMode): string {
  if (groupMode === 'year') {
    return new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  }

  if (groupMode === 'month') {
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
  }

  if (groupMode === 'week') {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return `Week of ${new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(weekStart)}`;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getGroupKey(file: DriveFileMetadata, groupMode: GroupMode): string {
  if (groupMode === 'none') return 'All photos';

  const date = new Date(file.createdTime || file.modifiedTime);
  return formatGroupLabel(date, groupMode);
}

function groupFiles(files: DriveFileMetadata[], groupMode: GroupMode) {
  const groupedFiles = new Map<string, DriveFileMetadata[]>();

  for (const file of files) {
    const key = getGroupKey(file, groupMode);
    groupedFiles.set(key, [...(groupedFiles.get(key) ?? []), file]);
  }

  return Array.from(groupedFiles.entries()).map(([label, groupFiles]) => ({
    label,
    files: groupFiles,
  }));
}

function getPreviewFrameClass(file: DriveFileMetadata, layoutMode: LayoutMode): string {
  if (layoutMode === 'grid') {
    return 'aspect-square';
  }

  if (layoutMode === 'compact') {
    return 'aspect-[5/4]';
  }

  const width = file.imageMediaMetadata?.width ?? 4;
  const height = file.imageMediaMetadata?.height ?? 3;
  const ratio = width / height;

  if (ratio < 0.75) return 'aspect-[3/4]';
  if (ratio > 1.45) return 'aspect-[16/10]';
  return 'aspect-[4/3]';
}

function getAlbumColumnsClass(layoutMode: LayoutMode): string {
  if (layoutMode === 'grid') {
    return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }

  if (layoutMode === 'compact') {
    return 'columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5';
  }

  return 'columns-1 gap-4 sm:columns-2 lg:columns-3 2xl:columns-4';
}

function DriveStudioSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface DriveImagePreviewProps {
  file: DriveFileMetadata;
}

function DriveImagePreview({ file }: DriveImagePreviewProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  if (status === 'failed') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-muted text-muted-foreground">
        <ImageIcon className="size-8" />
        <span className="max-w-[80%] truncate text-xs">Preview unavailable</span>
      </div>
    );
  }

  return (
    <>
      {status === 'loading' && <Skeleton className="absolute inset-0 rounded-none" />}
      <Image
        src={`/api/drive/image/${file.id}`}
        alt={file.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={cn(
          'object-contain transition-all duration-200 group-hover:scale-[1.01]',
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('failed')}
        unoptimized
      />
    </>
  );
}

interface DrivePhotoCardProps {
  file: DriveFileMetadata;
  isSelected: boolean;
  layoutMode: LayoutMode;
  onToggle: (fileId: string) => void;
}

function DrivePhotoCard({ file, isSelected, layoutMode, onToggle }: DrivePhotoCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(file.id)}
      className={cn(
        'group mb-4 w-full break-inside-avoid overflow-hidden rounded-xl border bg-card text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected ? 'border-primary ring-2 ring-ring/40' : 'border-border hover:border-foreground/30'
      )}
      aria-pressed={isSelected}
    >
      <div className={cn('relative overflow-hidden bg-black', getPreviewFrameClass(file, layoutMode))}>
        <DriveImagePreview file={file} />
        <span
          className={cn(
            'absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground backdrop-blur-md transition-opacity',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          {isSelected ? <Check className="size-4" /> : <UploadCloud className="size-4" />}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <p className="line-clamp-1 text-sm font-medium text-foreground">{file.name}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDimensions(file)}</span>
          {file.shared && !file.ownedByMe && <span>Shared</span>}
        </div>
      </div>
    </button>
  );
}

export function DriveStudio({ username }: DriveStudioProps) {
  const {
    files,
    nextPageToken,
    stats,
    isLoading,
    isRefreshingCache,
    error,
    fetchFiles,
    fetchStats,
    clearCachedFiles,
    publishFiles,
  } = useDrive();
  const { collections, createCollection, fetchCollections } = useCollections();
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [groupMode, setGroupMode] = useState<GroupMode>('month');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('album');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [isIdleExpired, setIsIdleExpired] = useState(false);

  useEffect(() => {
    void fetchFiles();
    void fetchStats();
    void fetchCollections();
  }, [fetchCollections, fetchFiles, fetchStats]);

  useEffect(() => {
    let timeout = window.setTimeout(() => {
      clearCachedFiles();
      setIsIdleExpired(true);
    }, 5 * 60 * 1000);

    const handleActivity = () => {
      window.clearTimeout(timeout);

      if (isIdleExpired) {
        void fetchFiles();
        void fetchStats();
        setIsIdleExpired(false);
      }

      timeout = window.setTimeout(() => {
        clearCachedFiles();
        setIsIdleExpired(true);
      }, 5 * 60 * 1000);
    };

    window.addEventListener('pointerdown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity, { passive: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [clearCachedFiles, fetchFiles, fetchStats, isIdleExpired]);

  const selectedCount = selectedFileIds.length;
  const groupedFiles = useMemo(() => groupFiles(files, groupMode), [files, groupMode]);
  const selectedFilesLabel = useMemo(() => {
    if (selectedCount === 0) return 'No photos selected';
    if (selectedCount === 1) return '1 photo selected';
    return `${selectedCount} photos selected`;
  }, [selectedCount]);

  const toggleFile = (fileId: string) => {
    setSelectedFileIds((currentIds) => {
      if (currentIds.includes(fileId)) {
        return currentIds.filter((id) => id !== fileId);
      }
      return [...currentIds, fileId];
    });
  };

  const clearSelection = () => {
    setSelectedFileIds([]);
  };

  const selectVisibleFiles = () => {
    setSelectedFileIds(files.map((file) => file.id));
  };

  const createCollectionFromStudio = async () => {
    const title = newCollectionTitle.trim();

    if (!title) {
      toast.info('Name your collection first.');
      return;
    }

    const result = await createCollection({ title, visibility: 'public' });

    if (!result.success || !result.data) {
      toast.error(result.error || 'Could not create collection.');
      return;
    }

    setSelectedCollectionId(result.data.id);
    setNewCollectionTitle('');
    toast.success('Collection created.');
  };

  const publishSelectedPhotos = async () => {
    if (selectedFileIds.length === 0) {
      toast.info('Select at least one photo first.');
      return;
    }

    setIsPublishing(true);
    const result = await publishFiles({
      files: selectedFileIds,
      collectionId: selectedCollectionId || undefined,
    });
    setIsPublishing(false);

    if (!result.success) {
      toast.error(result.error || 'We could not publish those photos.');
      return;
    }

    const publishedCount = result.data?.length ?? 0;
    if (publishedCount === 0) {
      toast.warning('No photos were published. Reconnect Google and try again.');
      return;
    }

    clearSelection();
    toast.success(`${publishedCount} photo${publishedCount === 1 ? '' : 's'} published.`);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 py-10 lg:px-8">
      <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Studio
          </p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Publish from Google Drive.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
            Select existing Drive images and publish their metadata into DriveGallery. Originals stay exactly where they are.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="block text-2xl font-semibold text-foreground">
                {stats?.totalImages ?? files.length}
              </span>
              Drive photos
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="block text-2xl font-semibold text-foreground">
                {stats?.ownedImages ?? files.filter((file) => file.ownedByMe).length}
              </span>
              Owned by you
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <span className="block text-2xl font-semibold text-foreground">
                {stats?.sharedImages ?? files.filter((file) => file.shared && !file.ownedByMe).length}
              </span>
              Shared with you
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:items-center">
          <Button asChild variant="outline" className="min-h-11 rounded-lg">
            <Link href={`/${username}`}>
              <Eye className="size-4" />
              View Gallery
            </Link>
          </Button>
          <Button
            className="min-h-11 rounded-lg"
            disabled={selectedCount === 0 || isPublishing || isLoading}
            onClick={publishSelectedPhotos}
          >
            {isPublishing ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            Publish Selected
          </Button>
        </div>
      </section>

      <div className="sticky top-16 z-30 mb-6 flex flex-col gap-4 border-y border-border bg-background/85 py-4 backdrop-blur-xl">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={layoutMode}
              onChange={(event) => setLayoutMode(event.target.value as LayoutMode)}
              className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              aria-label="Layout mode"
            >
              <option value="album">Album masonry</option>
              <option value="grid">Grid</option>
              <option value="compact">Compact</option>
            </select>
            <select
              value={groupMode}
              onChange={(event) => setGroupMode(event.target.value as GroupMode)}
              className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              aria-label="Group photos by"
            >
              <option value="none">No grouping</option>
              <option value="day">Group by day</option>
              <option value="week">Group by week</option>
              <option value="month">Group by month</option>
              <option value="year">Group by year</option>
            </select>
            <select
              value={selectedCollectionId}
              onChange={(event) => setSelectedCollectionId(event.target.value)}
              className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              aria-label="Collection"
            >
              <option value="">Publish to main gallery</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" className="min-h-11 rounded-lg" onClick={selectVisibleFiles}>
              Select Visible
            </Button>
            <Button
              variant="ghost"
              className="min-h-11 rounded-lg"
              disabled={selectedCount === 0}
              onClick={clearSelection}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              className="min-h-11 rounded-lg"
              disabled={isLoading}
              onClick={() => {
                clearCachedFiles();
                void fetchFiles();
                void fetchStats();
              }}
            >
              <RefreshCw className={cn('size-4', isLoading && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-2">
            <input
              value={newCollectionTitle}
              onChange={(event) => setNewCollectionTitle(event.target.value)}
              className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              placeholder="New collection name"
              aria-label="New collection name"
            />
            <Button variant="outline" className="min-h-11 rounded-lg" onClick={createCollectionFromStudio}>
              <FolderPlus className="size-4" />
              Create
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedFilesLabel}
            {isRefreshingCache && ' - refreshing cached metadata'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading && files.length === 0 ? (
        <DriveStudioSkeleton />
      ) : files.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
          <ImageIcon className="mb-6 size-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">No Drive images found</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Add images to Google Drive or reconnect your account, then refresh this studio.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {groupedFiles.map((group) => (
            <section key={group.label}>
              {groupMode !== 'none' && (
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <h2 className="font-serif text-2xl font-semibold text-foreground">{group.label}</h2>
                  <span className="text-sm text-muted-foreground">{group.files.length} photos</span>
                </div>
              )}
              <div className={getAlbumColumnsClass(layoutMode)}>
                {group.files.map((file) => (
                  <DrivePhotoCard
                    key={file.id}
                    file={file}
                    layoutMode={layoutMode}
                    isSelected={selectedFileIds.includes(file.id)}
                    onToggle={toggleFile}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {nextPageToken && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="min-h-11 rounded-lg"
            disabled={isLoading}
            onClick={() => fetchFiles(nextPageToken)}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
