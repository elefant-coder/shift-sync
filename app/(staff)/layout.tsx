'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Calendar, label: 'シフト' },
  { href: '/clock', icon: Clock, label: '打刻' },
  { href: '/request', icon: Send, label: '希望' },
  { href: '/profile', icon: User, label: '設定' },
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Main Content */}
      <main className="animate-fade-in">
        {children}
      </main>

      {/* Bottom Navigation - Apple style */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-100 safe-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || 
              (href !== '/' && pathname.startsWith(href));
            
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center w-16 h-full transition-all touch-active',
                  isActive 
                    ? 'text-blue-500' 
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Icon 
                  className={cn(
                    'h-6 w-6 transition-transform',
                    isActive && 'scale-110'
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] mt-1 font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
