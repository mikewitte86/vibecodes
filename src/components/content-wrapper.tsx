'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <div
      className={cn(
        'transition-all duration-300',
        !isAuthPage && (isCollapsed ? 'lg:ml-16' : 'lg:ml-64')
      )}
    >
      {children}
    </div>
  );
} 