import Link from 'next/link';

export function BrandMark() {
  return (
    <Link
      href="/"
      className="group inline-flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="DriveGallery home"
    >
      <span className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold tracking-[0.18em] text-foreground transition-colors group-hover:bg-accent">
        DG
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
          DriveGallery
        </span>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Photos stay yours
        </span>
      </span>
    </Link>
  );
}
