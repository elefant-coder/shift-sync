'use client';

import { ChevronRight, Bell, Clock, HelpCircle, LogOut, Shield, User } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { icon: User, label: 'プロフィール編集', href: '/profile/edit' },
  { icon: Bell, label: '通知設定', href: '/profile/notifications' },
  { icon: Clock, label: '勤怠履歴', href: '/profile/history' },
  { icon: Shield, label: 'プライバシー', href: '/profile/privacy' },
  { icon: HelpCircle, label: 'ヘルプ', href: '/profile/help' },
];

export default function ProfilePage() {
  return (
    <div className="px-6 pt-12 pb-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">設定</h1>
      </header>

      {/* User Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl">
            🙂
          </div>
          <div>
            <h2 className="text-xl font-bold">田中 太郎</h2>
            <p className="text-gray-400 text-sm">渋谷店 • アルバイト</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold">52</div>
            <div className="text-xs text-gray-400">今月の時間</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-gray-400">シフト数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">¥1,200</div>
            <div className="text-xs text-gray-400">時給</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 mb-8">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors touch-active"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium hover:bg-red-50 rounded-2xl transition-colors">
        <LogOut className="h-5 w-5" />
        ログアウト
      </button>

      {/* Version */}
      <p className="text-center text-xs text-gray-300 mt-8">
        ShiftSync v2.0.0
      </p>
    </div>
  );
}
