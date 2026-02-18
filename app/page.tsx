'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronRight, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// サンプルデータ
const mockShifts = [
  { id: '1', date: '2026-02-18', startTime: '09:00', endTime: '14:00', store: '渋谷店', position: 'ホール' },
  { id: '2', date: '2026-02-20', startTime: '18:00', endTime: '23:00', store: '渋谷店', position: 'キッチン' },
  { id: '3', date: '2026-02-21', startTime: '14:00', endTime: '18:00', store: '渋谷店', position: 'ホール' },
  { id: '4', date: '2026-02-22', startTime: '09:00', endTime: '18:00', store: '新宿店', position: 'ホール' },
];

const mockNotifications = [
  { id: '1', type: 'swap', message: '山田さんからシフト交代のリクエストがあります', isNew: true },
  { id: '2', type: 'schedule', message: '来週のシフトが確定しました', isNew: true },
];

export default function Home() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 月曜始まり
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [selectedDate, setSelectedDate] = useState(today);

  // 選択日のシフトを取得
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const todayShifts = mockShifts.filter(s => s.date === selectedDateStr);

  // 次のシフトを取得
  const upcomingShifts = mockShifts
    .filter(s => new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextShift = upcomingShifts[0];

  return (
    <div className="space-y-6">
      {/* 次のシフト */}
      {nextShift && (
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-90">次のシフト</span>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {format(new Date(nextShift.date), 'M/d(E)', { locale: ja })}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {nextShift.startTime} - {nextShift.endTime}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm opacity-90">
              <MapPin className="h-4 w-4" />
              <span>{nextShift.store}</span>
              <span>•</span>
              <span>{nextShift.position}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 通知 */}
      {mockNotifications.some(n => n.isNew) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-orange-800">
                  {mockNotifications.filter(n => n.isNew).length}件の新しい通知
                </p>
                <p className="text-xs text-orange-600 mt-0.5 truncate">
                  {mockNotifications[0].message}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-orange-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 週間カレンダー */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">今週のシフト</h2>
          <Link href="/schedule" className="text-sm text-primary flex items-center">
            すべて見る <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasShift = mockShifts.some(s => s.date === dateStr);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'flex flex-col items-center justify-center min-w-[52px] h-[72px] rounded-xl transition-all',
                  isSelected
                    ? 'bg-primary text-white'
                    : isTodayDate
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted'
                )}
              >
                <span className="text-[10px] font-medium opacity-70">
                  {format(day, 'E', { locale: ja })}
                </span>
                <span className="text-lg font-bold">{format(day, 'd')}</span>
                {hasShift && (
                  <div className={cn(
                    'h-1.5 w-1.5 rounded-full mt-1',
                    isSelected ? 'bg-white' : 'bg-primary'
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択日のシフト */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-3">
          {format(selectedDate, 'M月d日(E)', { locale: ja })}のシフト
        </h3>
        
        {todayShifts.length > 0 ? (
          <div className="space-y-3">
            {todayShifts.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{shift.store}</span>
                        <Badge variant="outline" className="text-xs">
                          {shift.position}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                この日のシフトはありません
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/request">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <span className="text-sm font-medium">希望を提出</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/swap">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="h-10 w-10 rounded-full bg-green-100 mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">🔄</span>
              </div>
              <span className="text-sm font-medium">シフト交代</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 今週のサマリー */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-3">今週のサマリー</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-xs text-muted-foreground">シフト回数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24h</div>
              <div className="text-xs text-muted-foreground">勤務時間</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">¥28,800</div>
              <div className="text-xs text-muted-foreground">予定給与</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
