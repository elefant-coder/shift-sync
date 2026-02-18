'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, startOfWeek, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Calendar, 
  Users, 
  Sparkles, 
  Settings, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo data
const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

const mockScheduleStatus = weekDays.map((date, i) => ({
  date,
  assigned: [2, 3, 2, 4, 3, 2, 1][i],
  required: [3, 3, 3, 3, 3, 2, 2][i],
}));

const pendingRequests = [
  { id: '1', name: '田中', date: '明日', time: '09:00-14:00', emoji: '🙂' },
  { id: '2', name: '山田', date: '2/22', time: '18:00-22:00', emoji: '😊' },
  { id: '3', name: '佐藤', date: '2/23', time: '14:00-18:00', emoji: '😄' },
];

const quickActions = [
  { 
    href: '/manager/schedule', 
    icon: Calendar, 
    label: 'シフト作成', 
    description: 'カレンダーでシフトを編集',
    color: 'bg-blue-500',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  { 
    href: '/manager/staff', 
    icon: Users, 
    label: 'スタッフ管理', 
    description: 'スタッフの追加・編集',
    color: 'bg-green-500',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  { 
    href: '/manager/ai', 
    icon: Sparkles, 
    label: 'AI自動作成', 
    description: 'AIがシフトを最適化',
    color: 'bg-purple-500',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  { 
    href: '/manager/settings', 
    icon: Settings, 
    label: '設定', 
    description: '店舗設定・通知',
    color: 'bg-gray-500',
    iconColor: 'text-gray-500',
    bgColor: 'bg-gray-100'
  },
];

export default function ManagerDashboard() {
  const shortageCount = mockScheduleStatus.filter(d => d.assigned < d.required).length;
  const totalAssigned = mockScheduleStatus.reduce((acc, d) => acc + d.assigned, 0);
  const totalRequired = mockScheduleStatus.reduce((acc, d) => acc + d.required, 0);
  const fillRate = Math.round((totalAssigned / totalRequired) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-8">
        {/* Header */}
        <header className="mb-8">
          <p className="text-gray-400 text-sm">管理者ダッシュボード</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">渋谷店</h1>
        </header>

        {/* Week Overview */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">今週のシフト状況</h2>
            <Link 
              href="/manager/schedule"
              className="text-sm text-blue-500 flex items-center"
            >
              詳細を見る
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {mockScheduleStatus.map(({ date, assigned, required }) => {
              const isShortage = assigned < required;
              const isFull = assigned >= required;
              
              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    'flex flex-col items-center py-2 rounded-xl',
                    isShortage ? 'bg-red-50' : isFull ? 'bg-green-50' : 'bg-gray-50'
                  )}
                >
                  <span className="text-[10px] text-gray-400">
                    {format(date, 'E', { locale: ja })}
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {format(date, 'd')}
                  </span>
                  <span className={cn(
                    'text-[10px] font-medium mt-1',
                    isShortage ? 'text-red-500' : 'text-green-500'
                  )}>
                    {assigned}/{required}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {shortageCount > 0 ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className={cn(
              'text-2xl font-bold',
              shortageCount > 0 ? 'text-red-500' : 'text-green-500'
            )}>
              {shortageCount}
            </div>
            <div className="text-[10px] text-gray-400">人員不足の日</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {pendingRequests.length}
            </div>
            <div className="text-[10px] text-gray-400">未確認の希望</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500">
              {fillRate}%
            </div>
            <div className="text-[10px] text-gray-400">充足率</div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">シフト希望</h2>
              <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                {pendingRequests.length}件
              </span>
            </div>
            
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{req.emoji}</span>
                    <div>
                      <div className="font-medium text-gray-700 text-sm">{req.name}</div>
                      <div className="text-xs text-gray-400">{req.date} {req.time}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg">
                      承認
                    </button>
                    <button className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-lg">
                      却下
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <h2 className="font-bold text-gray-800 mb-3">クイックアクション</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ href, icon: Icon, label, description, iconColor, bgColor }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bgColor)}>
                <Icon className={cn('h-5 w-5', iconColor)} />
              </div>
              <span className="font-bold text-gray-800 text-sm">{label}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
