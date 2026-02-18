'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, isSameDay, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// サンプルデータ
const mockShifts = [
  { id: '1', date: '2026-02-16', startTime: '09:00', endTime: '14:00', store: '渋谷店', position: 'ホール', status: 'confirmed' },
  { id: '2', date: '2026-02-17', startTime: '18:00', endTime: '23:00', store: '渋谷店', position: 'キッチン', status: 'confirmed' },
  { id: '3', date: '2026-02-18', startTime: '09:00', endTime: '14:00', store: '渋谷店', position: 'ホール', status: 'confirmed' },
  { id: '4', date: '2026-02-20', startTime: '14:00', endTime: '18:00', store: '渋谷店', position: 'ホール', status: 'scheduled' },
  { id: '5', date: '2026-02-21', startTime: '09:00', endTime: '18:00', store: '新宿店', position: 'ホール', status: 'scheduled' },
  { id: '6', date: '2026-02-22', startTime: '18:00', endTime: '23:00', store: '渋谷店', position: 'キッチン', status: 'scheduled' },
  { id: '7', date: '2026-02-23', startTime: '09:00', endTime: '14:00', store: '渋谷店', position: 'ホール', status: 'scheduled' },
];

export default function SchedulePage() {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [selectedDate, setSelectedDate] = useState(today);

  // 選択日のシフトを取得
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayShifts = mockShifts.filter((s) => s.date === selectedDateStr);

  // 週の合計時間を計算
  const weekShifts = mockShifts.filter((s) => {
    const shiftDate = new Date(s.date);
    return shiftDate >= weekStart && shiftDate < addDays(weekStart, 7);
  });

  const totalHours = weekShifts.reduce((acc, s) => {
    const start = parseInt(s.startTime.split(':')[0]);
    const end = parseInt(s.endTime.split(':')[0]);
    return acc + (end - start);
  }, 0);

  return (
    <div className="space-y-6">
      {/* 週選択 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset((w) => w - 1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <div className="font-bold">
            {format(weekStart, 'M月d日', { locale: ja })} 〜{' '}
            {format(addDays(weekStart, 6), 'M月d日', { locale: ja })}
          </div>
          <div className="text-xs text-muted-foreground">
            {weekOffset === 0 ? '今週' : weekOffset > 0 ? `${weekOffset}週間後` : `${Math.abs(weekOffset)}週間前`}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset((w) => w + 1)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* 週間カレンダー */}
      <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayShift = mockShifts.find((s) => s.date === dateStr);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'flex-1 min-w-[48px] rounded-xl transition-all p-2',
                isSelected
                  ? 'bg-primary text-white'
                  : isTodayDate
                  ? 'bg-primary/10'
                  : 'bg-muted'
              )}
            >
              <div className="text-[10px] font-medium opacity-70">
                {format(day, 'E', { locale: ja })}
              </div>
              <div className="text-lg font-bold">{format(day, 'd')}</div>
              {dayShift && (
                <div
                  className={cn(
                    'text-[10px] mt-1 px-1 rounded',
                    isSelected ? 'bg-white/20' : 'bg-primary/20 text-primary'
                  )}
                >
                  {dayShift.startTime.slice(0, 2)}時〜
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 週間サマリー */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">{weekShifts.length}</div>
            <div className="text-xs text-muted-foreground">シフト</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">{totalHours}h</div>
            <div className="text-xs text-muted-foreground">勤務時間</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">
              ¥{(totalHours * 1200).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">予定給与</div>
          </CardContent>
        </Card>
      </div>

      {/* 選択日の詳細 */}
      <div>
        <h3 className="font-bold mb-3">
          {format(selectedDate, 'M月d日(E)', { locale: ja })}のシフト
        </h3>

        {dayShifts.length > 0 ? (
          <div className="space-y-3">
            {dayShifts.map((shift) => (
              <Card key={shift.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* 時間バー */}
                    <div className="w-1 bg-primary" />
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-bold text-lg">
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </div>
                        <Badge
                          variant={shift.status === 'confirmed' ? 'default' : 'secondary'}
                        >
                          {shift.status === 'confirmed' ? '確定' : '予定'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {shift.store}
                        </div>
                        <Badge variant="outline">{shift.position}</Badge>
                      </div>
                      {shift.status === 'scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full"
                        >
                          <RefreshCw className="mr-2 h-3 w-3" />
                          交代をリクエスト
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">この日のシフトはありません</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* リスト表示 */}
      <div>
        <h3 className="font-bold mb-3">今後のシフト一覧</h3>
        <div className="space-y-2">
          {mockShifts
            .filter((s) => new Date(s.date) >= today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((shift) => (
              <Card key={shift.id}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-lg flex flex-col items-center justify-center text-xs',
                      new Date(shift.date).getDay() === 0 || new Date(shift.date).getDay() === 6
                        ? 'bg-red-100 text-red-600'
                        : 'bg-muted'
                    )}
                  >
                    <span className="font-bold text-sm">
                      {format(new Date(shift.date), 'd')}
                    </span>
                    <span className="text-[10px]">
                      {format(new Date(shift.date), 'E', { locale: ja })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {shift.startTime} - {shift.endTime}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {shift.store} • {shift.position}
                    </div>
                  </div>
                  <Badge
                    variant={shift.status === 'confirmed' ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {shift.status === 'confirmed' ? '確定' : '予定'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
