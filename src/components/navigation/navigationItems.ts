export type NavigationIconName =
  | 'collections'
  | 'events'
  | 'gallery'
  | 'profile'
  | 'search'
  | 'settings'
  | 'studio';

export interface NavigationItem {
  label: string;
  href?: string;
  icon: NavigationIconName;
  requiresAuth?: boolean;
  isImplemented: boolean;
}

export const primaryNavigationItems: NavigationItem[] = [
  {
    label: 'Studio',
    href: '/studio',
    icon: 'studio',
    requiresAuth: true,
    isImplemented: true,
  },
  {
    label: 'Gallery',
    href: '/',
    icon: 'gallery',
    isImplemented: true,
  },
  {
    label: 'Collections',
    href: '/collections',
    icon: 'collections',
    requiresAuth: true,
    isImplemented: true,
  },
  {
    label: 'Events',
    icon: 'events',
    requiresAuth: true,
    isImplemented: false,
  },
  {
    label: 'Search',
    href: '/search',
    icon: 'search',
    requiresAuth: true,
    isImplemented: true,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: 'profile',
    requiresAuth: true,
    isImplemented: true,
  },
];

export const utilityNavigationItems: NavigationItem[] = [
  {
    label: 'Settings',
    icon: 'settings',
    requiresAuth: true,
    isImplemented: false,
  },
];
