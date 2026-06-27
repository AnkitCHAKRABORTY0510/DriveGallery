'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FolderOpen,
  GalleryHorizontalEnd,
  Images,
  LogIn,
  LogOut,
  Search,
  Settings,
  UploadCloud,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/common/BrandMark';
import { NotImplementedBadge } from '@/components/common/NotImplementedBadge';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/cn';
import {
  NavigationIconName,
  primaryNavigationItems,
  utilityNavigationItems,
} from './navigationItems';

const navigationIcons: Record<NavigationIconName, LucideIcon> = {
  collections: FolderOpen,
  events: GalleryHorizontalEnd,
  gallery: Images,
  profile: UserRound,
  search: Search,
  settings: Settings,
  studio: UploadCloud,
};

function getInitials(name?: string | null): string {
  if (!name) return 'DG';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function AppHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const shouldReduceMotion = useReducedMotion();
  const isAuthenticated = status === 'authenticated';
  const userGalleryHref = session?.user?.username ? `/${session.user.username}` : '/';

  const navigationItems = primaryNavigationItems.map((item) => {
    if (item.label === 'Gallery' && isAuthenticated) {
      return { ...item, href: userGalleryHref };
    }
    return item;
  });

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border/70 bg-background/80 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 lg:px-8">
        <BrandMark />

        <nav className="flex items-center gap-1" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            const Icon = navigationIcons[item.icon];
            const isHidden = item.requiresAuth && !isAuthenticated;
            const isActive = item.href ? pathname === item.href : false;

            if (isHidden) return null;

            if (!item.isImplemented || !item.href) {
              return (
                <div key={item.label} className="group relative">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="min-h-11 gap-2 rounded-lg px-3 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                    disabled
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                  <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <NotImplementedBadge />
                  </div>
                </div>
              );
            }

            return (
              <Button
                key={item.label}
                asChild
                variant="ghost"
                size="lg"
                className={cn(
                  'relative min-h-11 gap-2 rounded-lg px-3 text-xs uppercase tracking-[0.18em] text-muted-foreground',
                  isActive && 'text-foreground'
                )}
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  {item.label}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="desktop-nav-active"
                        className="absolute inset-x-2 bottom-1 h-px bg-foreground"
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="min-h-11 min-w-11 rounded-lg"
                  aria-label="Open user menu"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={session.user?.image ?? undefined} alt="" />
                    <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel>
                  <span className="block truncate text-sm">{session.user?.name ?? 'Photographer'}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {session.user?.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserRound className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {utilityNavigationItems.map((item) => {
                  const Icon = navigationIcons[item.icon];
                  return (
                    <DropdownMenuItem key={item.label} disabled>
                      <Icon className="size-4" />
                      {item.label}
                      <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="min-h-11 gap-2 rounded-lg"
              onClick={() => signIn('google', { callbackUrl: '/' })}
            >
              <LogIn className="size-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
