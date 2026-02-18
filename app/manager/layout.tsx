'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, Sparkles, Wallet, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/manager', icon: Calendar, label: 'シフト' },
  { href: '/manager/staff', icon: Users, label: 'スタッフ' },
  { href: '/manager/ai', icon: Sparkles, label: 'AI作成' },
  { href: '/manager/cost', icon: Wallet, label: '人件費' },
  { href: '/manager/settings', icon: Settings, label: '設定' },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">ShiftSync</h1>
            <p className="text-xs text-gray-400">店長モード</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">店</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="animate-fade-in">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            
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
                    'h-5 w-5 transition-transform',
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
