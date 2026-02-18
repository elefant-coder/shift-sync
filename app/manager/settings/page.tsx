'use client';

import { useState } from 'react';
import { 
  Store, 
  Clock, 
  Users, 
  Bell, 
  Palette,
  ChevronRight,
  Save,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SettingSection {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const settingSections: SettingSection[] = [
  {
    icon: <Store className="h-5 w-5" />,
    label: '店舗情報',
    description: '店舗名、住所の編集',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: '営業時間',
    description: '開店・閉店時間の設定',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: '人員設定',
    description: '必要人数の設定',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: <Bell className="h-5 w-5" />,
    label: '通知設定',
    description: 'リマインダー、アラート',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    icon: <Palette className="h-5 w-5" />,
    label: '外観設定',
    description: 'カラーテーマの変更',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
];

export default function SettingsPage() {
  const [showStoreEdit, setShowStoreEdit] = useState(false);
  const [showHoursEdit, setShowHoursEdit] = useState(false);
  const [showStaffEdit, setShowStaffEdit] = useState(false);
  const [showNotificationEdit, setShowNotificationEdit] = useState(false);

  const [storeData, setStoreData] = useState({
    name: '渋谷カフェ店',
    address: '東京都渋谷区道玄坂1-1-1',
  });

  const [hoursData, setHoursData] = useState({
    openTime: '09:00',
    closeTime: '22:00',
  });

  const [staffData, setStaffData] = useState({
    minStaff: 2,
    maxStaff: 5,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    shiftConfirm: true,
    shiftReminder: true,
    requestAlert: true,
    shortageAlert: true,
  });

  const handleSectionClick = (label: string) => {
    switch (label) {
      case '店舗情報':
        setShowStoreEdit(true);
        break;
      case '営業時間':
        setShowHoursEdit(true);
        break;
      case '人員設定':
        setShowStaffEdit(true);
        break;
      case '通知設定':
        setShowNotificationEdit(true);
        break;
      default:
        toast.info('準備中です');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-24">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">設定</h1>
          <p className="text-sm text-gray-400">店舗の設定を管理</p>
        </header>

        {/* Settings List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {settingSections.map((section, index) => (
            <button
              key={section.label}
              onClick={() => handleSectionClick(section.label)}
              className={cn(
                'w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors',
                index !== settingSections.length - 1 && 'border-b border-gray-100'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', section.bgColor)}>
                  <span className={section.color}>{section.icon}</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800">{section.label}</div>
                  <div className="text-xs text-gray-400">{section.description}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </button>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl p-4">
          <h3 className="font-bold text-red-600 mb-2">危険な操作</h3>
          <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl text-red-500 hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5" />
              <span className="font-medium">店舗を削除</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Store Edit Drawer */}
      <Drawer open={showStoreEdit} onOpenChange={setShowStoreEdit}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>店舗情報</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">店舗名</label>
              <Input
                value={storeData.name}
                onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">住所</label>
              <Input
                value={storeData.address}
                onChange={(e) => setStoreData(prev => ({ ...prev, address: e.target.value }))}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                toast.success('保存しました');
                setShowStoreEdit(false);
              }}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Hours Edit Drawer */}
      <Drawer open={showHoursEdit} onOpenChange={setShowHoursEdit}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>営業時間</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">開店時間</label>
              <select
                value={hoursData.openTime}
                onChange={(e) => setHoursData(prev => ({ ...prev, openTime: e.target.value }))}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                    {String(i).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">閉店時間</label>
              <select
                value={hoursData.closeTime}
                onChange={(e) => setHoursData(prev => ({ ...prev, closeTime: e.target.value }))}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                    {String(i).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                toast.success('保存しました');
                setShowHoursEdit(false);
              }}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Staff Edit Drawer */}
      <Drawer open={showStaffEdit} onOpenChange={setShowStaffEdit}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>人員設定</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                最小人数: <span className="text-blue-500 font-bold">{staffData.minStaff}人</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={staffData.minStaff}
                onChange={(e) => setStaffData(prev => ({ ...prev, minStaff: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                最大人数: <span className="text-blue-500 font-bold">{staffData.maxStaff}人</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={staffData.maxStaff}
                onChange={(e) => setStaffData(prev => ({ ...prev, maxStaff: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                toast.success('保存しました');
                setShowStaffEdit(false);
              }}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Notification Edit Drawer */}
      <Drawer open={showNotificationEdit} onOpenChange={setShowNotificationEdit}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>通知設定</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {[
              { key: 'shiftConfirm', label: 'シフト確定通知', description: 'シフトが確定したとき' },
              { key: 'shiftReminder', label: 'シフトリマインダー', description: 'シフト前日にお知らせ' },
              { key: 'requestAlert', label: '希望申請アラート', description: '新しい希望が来たとき' },
              { key: 'shortageAlert', label: '人員不足アラート', description: '人員が不足しているとき' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <div className="font-medium text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
                <Switch
                  checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, [item.key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
          <DrawerFooter>
            <Button
              onClick={() => {
                toast.success('保存しました');
                setShowNotificationEdit(false);
              }}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
