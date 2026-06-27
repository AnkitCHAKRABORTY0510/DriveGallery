import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppFooter } from './AppFooter';
import { AppHeader } from '@/components/navigation/AppHeader';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
      <MobileNavigation />
      <Toaster richColors closeButton />
    </div>
  );
}
