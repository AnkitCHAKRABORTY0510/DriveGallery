'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  FolderOpen,
  GalleryHorizontalEnd,
  Images,
  LogIn,
  Search,
  Settings,
  UploadCloud,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { NavigationIconName, primaryNavigationItems } from './navigationItems';

const navigationIcons: Record<NavigationIconName, LucideIcon> = {
  collections: FolderOpen,
  events: GalleryHorizontalEnd,
  gallery: Images,
  profile: UserRound,
  search: Search,
  settings: Settings,
  studio: UploadCloud,
};

export function MobileNavigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const shouldReduceMotion = useReducedMotion();
  const isAuthenticated = status === 'authenticated';
  const userGalleryHref = session?.user?.username ? `/${session.user.username}` : '/';

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 px-4 pb-4 pt-3 backdrop-blur-xl md:hidden">
        <Button
          className="min-h-11 w-full rounded-lg"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <LogIn className="size-4" />
          Sign in with Google
        </Button>
      </div>
    );
  }

  const navigationItems = primaryNavigationItems
    .filter((item) => item.label !== 'Search')
    .map((item) => {
      if (item.label === 'Gallery') {
        return { ...item, href: userGalleryHref };
      }
      return item;
    })
    .slice(0, 4);

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 rounded-xl border border-border/70 bg-background/85 p-1 shadow-sm backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 gap-1">
        {navigationItems.map((item) => {
          const Icon = navigationIcons[item.icon];
          const isActive = item.href ? pathname === item.href : false;
          const content = (
            <>
              <Icon className="size-4" />
              <span className="text-[0.65rem]">{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-lg bg-accent"
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                />
              )}
            </>
          );

          if (!item.isImplemented || !item.href) {
            return (
              <button
                key={item.label}
                type="button"
                disabled
                className="relative flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-muted-foreground opacity-60"
                aria-label={`${item.label}. Not implemented yet.`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'relative flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive && 'text-foreground'
              )}
            >
              <span className="relative z-10 flex flex-col items-center justify-center gap-1">
                <Icon className="size-4" />
                <span className="text-[0.65rem]">{item.label}</span>
              </span>
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-lg bg-accent"
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
