'use client';

import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function MobileHeader({ title = 'ShiftSync' }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  ShiftSync
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 space-y-2">
                <a href="/" className="block px-4 py-3 rounded-lg hover:bg-muted">
                  ホーム
                </a>
                <a href="/schedule" className="block px-4 py-3 rounded-lg hover:bg-muted">
                  シフト表
                </a>
                <a href="/request" className="block px-4 py-3 rounded-lg hover:bg-muted">
                  希望提出
                </a>
                <a href="/swap" className="block px-4 py-3 rounded-lg hover:bg-muted">
                  シフト交代
                </a>
                <hr className="my-4" />
                <a href="/settings" className="block px-4 py-3 rounded-lg hover:bg-muted">
                  設定
                </a>
                <a href="/help" className="block px-4 py-3 rounded-lg hover:bg-muted">
                  ヘルプ
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="font-bold text-lg">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="text-xs">田中</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
