'use client';

import { useState } from 'react';
import { 
  User, 
  Bell, 
  Moon, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Store,
  Clock,
  Calendar
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SettingItem {
  icon: React.ReactNode;
  label: string;
  description?: string;
  type: 'link' | 'toggle' | 'info';
  value?: boolean | string;
  onClick?: () => void;
}

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const userInfo = {
    name: '山田太郎',
    emoji: '😊',
    store: '渋谷カフェ店',
    joinedDate: '2024年1月',
    thisMonthHours: 48,
    thisMonthShifts: 12,
  };

  const settings: SettingItem[] = [
    {
      icon: <Bell className="h-5 w-5 text-orange-500" />,
      label: '通知',
      description: 'シフト確定やリマインダー',
      type: 'toggle',
      value: notifications,
      onClick: () => {
        setNotifications(!notifications);
        toast.success(notifications ? '通知をオフにしました' : '通知をオンにしました');
      },
    },
    {
      icon: <Moon className="h-5 w-5 text-purple-500" />,
      label: 'ダークモード',
      description: '画面を暗くする',
      type: 'toggle',
      value: darkMode,
      onClick: () => {
        setDarkMode(!darkMode);
        toast.success(darkMode ? 'ライトモードに切り替えました' : 'ダークモードは準備中です');
      },
    },
    {
      icon: <HelpCircle className="h-5 w-5 text-blue-500" />,
      label: 'ヘルプ',
      description: '使い方やよくある質問',
      type: 'link',
    },
    {
      icon: <LogOut className="h-5 w-5 text-red-500" />,
      label: 'ログアウト',
      type: 'link',
      onClick: () => toast.error('ログアウトしました（デモ）'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-24">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">マイページ</h1>
        </header>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
              {userInfo.emoji}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{userInfo.name}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Store className="h-4 w-4" />
                <span>{userInfo.store}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{userInfo.thisMonthHours}h</div>
              <div className="text-xs text-blue-400">今月の勤務</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold text-green-600">{userInfo.thisMonthShifts}</div>
              <div className="text-xs text-green-400">シフト回数</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {settings.map((setting, index) => (
            <button
              key={setting.label}
              onClick={setting.onClick}
              className={cn(
                'w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors',
                index !== settings.length - 1 && 'border-b border-gray-100'
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  {setting.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">{setting.label}</div>
                  {setting.description && (
                    <div className="text-xs text-gray-400">{setting.description}</div>
                  )}
                </div>
              </div>
              
              {setting.type === 'toggle' ? (
                <Switch checked={setting.value as boolean} />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-300" />
              )}
            </button>
          ))}
        </div>

        {/* Version */}
        <div className="text-center mt-8 text-sm text-gray-300">
          ShiftSync v1.0.0
        </div>
      </div>
    </div>
  );
}
