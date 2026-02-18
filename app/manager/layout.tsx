'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, Users, Sparkles, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/manager', icon: Home, label: 'ホーム' },
  { href: '/manager/schedule', icon: Calendar, label: 'シフト' },
  { href: '/manager/staff', icon: Users, label: 'スタッフ' },
  { href: '/manager/ai', icon: Sparkles, label: 'AI' },
  { href: '/manager/settings', icon: Settings, label: '設定' },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show nav on setup page
  const isSetupPage = pathname === '/manager/setup';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      
      {/* Bottom Navigation */}
      {!isSetupPage && (
        <nav className="fixed bottom-0 left-0 right-0 bottom-nav safe-bottom z-50">
          <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                    isActive ? 'text-blue-500' : 'text-gray-400'
                  )}
                >
                  <Icon className={cn(
                    'h-6 w-6 mb-1 transition-transform',
                    isActive && 'scale-110'
                  )} />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
