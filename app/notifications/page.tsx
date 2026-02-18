'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Bell, Calendar, RefreshCw, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'schedule' | 'swap' | 'reminder' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'swap',
    title: 'シフト交代リクエスト',
    message: '山田太郎さんから2/20のシフト交代リクエストがあります',
    isRead: false,
    createdAt: '2026-02-18T10:30:00',
    actionUrl: '/swap/1',
  },
  {
    id: '2',
    type: 'schedule',
    title: 'シフト確定',
    message: '2/17週のシフトが確定しました',
    isRead: false,
    createdAt: '2026-02-17T18:00:00',
    actionUrl: '/schedule',
  },
  {
    id: '3',
    type: 'reminder',
    title: 'シフト希望提出期限',
    message: '2/24週のシフト希望提出期限は明日です',
    isRead: true,
    createdAt: '2026-02-16T09:00:00',
    actionUrl: '/request',
  },
  {
    id: '4',
    type: 'system',
    title: 'お知らせ',
    message: '新機能「シフト交代」が追加されました',
    isRead: true,
    createdAt: '2026-02-15T12:00:00',
  },
  {
    id: '5',
    type: 'schedule',
    title: 'シフト変更',
    message: '2/18のシフトが9:00〜14:00に変更されました',
    isRead: true,
    createdAt: '2026-02-14T16:30:00',
  },
];

const typeIcons = {
  schedule: Calendar,
  swap: RefreshCw,
  reminder: Bell,
  system: AlertCircle,
};

const typeColors = {
  schedule: 'bg-blue-100 text-blue-600',
  swap: 'bg-green-100 text-green-600',
  reminder: 'bg-orange-100 text-orange-600',
  system: 'bg-purple-100 text-purple-600',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg">通知</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount}件の未読があります
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="mr-1 h-4 w-4" />
            すべて既読
          </Button>
        )}
      </div>

      {/* 通知リスト */}
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            const colorClass = typeColors[notification.type];

            return (
              <Card
                key={notification.id}
                className={cn(
                  'transition-all',
                  !notification.isRead && 'border-primary/50 bg-primary/5'
                )}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                        colorClass
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {notification.title}
                            </span>
                            {!notification.isRead && (
                              <Badge variant="default" className="h-5 text-[10px]">
                                NEW
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(notification.createdAt), 'M/d HH:mm', {
                              locale: ja,
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      {notification.actionUrl && !notification.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => markAsRead(notification.id)}
                        >
                          詳細を見る
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">通知はありません</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
