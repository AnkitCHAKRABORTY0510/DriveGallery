import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="border-t border-border/70 pb-24 pt-10 md:pb-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between lg:px-8">
        <p>DriveGallery keeps your originals in Google Drive.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="transition-colors hover:text-foreground">
            Gallery
          </Link>
          <Link href="/profile" className="transition-colors hover:text-foreground">
            Profile
          </Link>
          <span aria-label="Events not implemented yet">Events: Not implemented yet</span>
        </div>
      </div>
    </footer>
  );
}
