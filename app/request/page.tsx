'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Check, ChevronLeft, ChevronRight, Send, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TIME_SLOT_LABELS, TimeSlot } from '@/types';

type DayPreference = {
  available: boolean;
  preferredTime?: TimeSlot;
  note?: string;
};

type WeekPreferences = {
  [date: string]: DayPreference;
};

const timeSlots: { value: TimeSlot; label: string; icon: string }[] = [
  { value: 'morning', label: '朝', icon: '🌅' },
  { value: 'afternoon', label: '昼', icon: '☀️' },
  { value: 'evening', label: '夜', icon: '🌙' },
  { value: 'full', label: '終日', icon: '📅' },
];

export default function RequestPage() {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(1); // デフォルトは来週
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [preferences, setPreferences] = useState<WeekPreferences>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [desiredHours, setDesiredHours] = useState(20);

  const toggleAvailability = (dateStr: string) => {
    setPreferences((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        available: !prev[dateStr]?.available,
        preferredTime: prev[dateStr]?.available ? undefined : 'full',
      },
    }));
  };

  const setTimePreference = (dateStr: string, time: TimeSlot) => {
    setPreferences((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        available: true,
        preferredTime: time,
      },
    }));
    setSelectedDay(null);
  };

  const handleSubmit = () => {
    const availableDays = Object.entries(preferences).filter(([_, p]) => p.available);
    if (availableDays.length === 0) {
      toast.error('少なくとも1日は出勤可能日を選択してください');
      return;
    }

    // TODO: APIに送信
    toast.success('シフト希望を提出しました！', {
      description: `${format(weekStart, 'M/d', { locale: ja })}〜の週のシフト希望`,
    });
  };

  const availableCount = Object.values(preferences).filter((p) => p.available).length;

  return (
    <div className="space-y-6">
      {/* 週選択 */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset((w) => w - 1)}
          disabled={weekOffset <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <div className="font-bold">
            {format(weekStart, 'M月d日', { locale: ja })} 〜{' '}
            {format(addDays(weekStart, 6), 'M月d日', { locale: ja })}
          </div>
          <div className="text-xs text-muted-foreground">
            {weekOffset === 1 ? '来週' : `${weekOffset}週間後`}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setWeekOffset((w) => w + 1)}
          disabled={weekOffset >= 4}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* カレンダー */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">出勤可能日を選択</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const pref = preferences[dateStr];
            const isAvailable = pref?.available;
            const isSelected = selectedDay === dateStr;

            return (
              <div key={dateStr}>
                <div
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg transition-all',
                    isAvailable
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted border-2 border-transparent'
                  )}
                >
                  <button
                    className="flex items-center gap-3 flex-1"
                    onClick={() => toggleAvailability(dateStr)}
                  >
                    <div
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center font-bold',
                        isAvailable ? 'bg-primary text-white' : 'bg-background'
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">
                        {format(day, 'E曜日', { locale: ja })}
                      </div>
                      {isAvailable && pref?.preferredTime && (
                        <div className="text-xs text-muted-foreground">
                          {TIME_SLOT_LABELS[pref.preferredTime]}
                        </div>
                      )}
                    </div>
                  </button>

                  {isAvailable && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                      >
                        時間帯
                      </Button>
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 時間帯選択 */}
                {isSelected && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">希望時間帯</div>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.value}
                          onClick={() => setTimePreference(dateStr, slot.value)}
                          className={cn(
                            'p-2 rounded-lg text-center transition-all',
                            pref?.preferredTime === slot.value
                              ? 'bg-primary text-white'
                              : 'bg-background hover:bg-background/80'
                          )}
                        >
                          <div className="text-lg">{slot.icon}</div>
                          <div className="text-xs">{slot.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 希望勤務時間 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">希望勤務時間</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDesiredHours((h) => Math.max(8, h - 4))}
            >
              <span className="text-lg">-</span>
            </Button>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{desiredHours}</div>
              <div className="text-xs text-muted-foreground">時間/週</div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDesiredHours((h) => Math.min(40, h + 4))}
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {[16, 20, 24, 32].map((h) => (
              <Badge
                key={h}
                variant={desiredHours === h ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setDesiredHours(h)}
              >
                {h}h
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* サマリー */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">出勤可能日</div>
              <div className="font-bold text-lg">{availableCount}日</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">希望時間</div>
              <div className="font-bold text-lg">{desiredHours}h</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">予想給与</div>
              <div className="font-bold text-lg">
                ¥{(desiredHours * 1200).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 提出ボタン */}
      <Button
        className="w-full h-14 text-lg"
        size="lg"
        onClick={handleSubmit}
        disabled={availableCount === 0}
      >
        <Send className="mr-2 h-5 w-5" />
        希望を提出する
      </Button>

      {/* 提出期限 */}
      <p className="text-center text-sm text-muted-foreground">
        提出期限: {format(addDays(weekStart, -3), 'M月d日(E)', { locale: ja })} 23:59
      </p>
    </div>
  );
}
