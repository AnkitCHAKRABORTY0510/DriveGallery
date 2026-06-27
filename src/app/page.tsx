import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/config/authOptions";
import { Button } from "@/components/ui/button";
import { Camera, GalleryHorizontalEnd, LockKeyhole, Sparkles, UploadCloud } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const publicGalleryHref = session?.user?.username ? `/${session.user.username}` : '/login';

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 py-16 md:py-24 lg:px-8">
      <section className="grid min-h-[calc(100vh-16rem)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <LockKeyhole className="size-3.5" />
            Google Drive remains the source of truth
          </div>
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
            A quiet gallery for photographs you still own.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            DriveGallery frames your Google Drive images as a premium photography experience while storing only metadata, gallery information, and relationships.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-11 rounded-lg">
              <Link href={session ? '/studio' : '/login'}>
                <UploadCloud className="size-4" />
                {session ? 'Publish Photos' : 'Sign in to begin'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-11 rounded-lg">
              <Link href={publicGalleryHref}>
                <GalleryHorizontalEnd className="size-4" />
                View Gallery
              </Link>
            </Button>
          </div>
          {session && (
            <p className="mt-6 max-w-xl text-sm text-muted-foreground">
              Publishing is available in Studio. If you signed in before this update, sign out and sign in again so Google grants publishing permissions.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <Sparkles className="mb-8 size-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Photography first</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Minimal navigation, dark-first surfaces, and generous whitespace keep attention on the image.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Camera className="mb-8 size-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Publish, do not upload</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Choose images from Google Drive and publish only their metadata into your gallery.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <LockKeyhole className="mb-8 size-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Metadata only</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Originals stay in Google Drive. DriveGallery stores only the information needed to present them beautifully.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
