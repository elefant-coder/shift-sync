'use client';

import { ChevronRight, Store, Users, Clock, Bell, Shield, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const menuSections = [
  {
    title: '店舗設定',
    items: [
      { icon: Store, label: '店舗情報', href: '/manager/settings/store', desc: '住所・営業時間' },
      { icon: Users, label: '必要人員', href: '/manager/settings/requirements', desc: '時間帯ごとの人数' },
      { icon: Clock, label: 'シフトルール', href: '/manager/settings/rules', desc: '最大勤務時間など' },
    ],
  },
  {
    title: '通知',
    items: [
      { icon: Bell, label: '通知設定', href: '/manager/settings/notifications', desc: '希望提出リマインド' },
    ],
  },
  {
    title: 'その他',
    items: [
      { icon: Shield, label: 'アカウント', href: '/manager/settings/account', desc: 'メール・パスワード' },
      { icon: HelpCircle, label: 'ヘルプ', href: '/manager/settings/help', desc: '使い方・お問い合わせ' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">設定</h2>
      </div>

      {/* Store Info Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">渋谷店</h3>
            <p className="text-blue-100 text-sm">東京都渋谷区...</p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3 px-1">
            {section.title}
          </h3>
          <div className="bg-white rounded-2xl overflow-hidden">
            {section.items.map(({ icon: Icon, label, href, desc }, index) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index !== section.items.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">{label}</div>
                    <div className="text-xs text-gray-400">{desc}</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Version */}
      <p className="text-center text-xs text-gray-300 mt-8">
        ShiftSync v2.0.0 (Manager)
      </p>
    </div>
  );
}
