'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShiftRequest {
  date: string;
  startTime: string;
  endTime: string;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const TIME_PRESETS = [
  { label: '朝', start: '09:00', end: '13:00', emoji: '🌅', color: 'bg-orange-100 text-orange-600' },
  { label: '昼', start: '12:00', end: '17:00', emoji: '☀️', color: 'bg-yellow-100 text-yellow-600' },
  { label: '夜', start: '17:00', end: '22:00', emoji: '🌙', color: 'bg-indigo-100 text-indigo-600' },
  { label: '終日', start: '09:00', end: '18:00', emoji: '📅', color: 'bg-green-100 text-green-600' },
];

export default function RequestPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [requests, setRequests] = useState<ShiftRequest[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = monthDays[0].getDay();
  const paddingDays = Array(firstDayOfMonth).fill(null);

  const handleDateTap = (date: Date) => {
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    if (isPast) return;
    setSelectedDate(date);
  };

  const handleTimeSelect = (preset: typeof TIME_PRESETS[0]) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // 既存の希望があれば削除
    const filtered = requests.filter(r => r.date !== dateStr);
    
    // 新しい希望を追加
    setRequests([...filtered, {
      date: dateStr,
      startTime: preset.start,
      endTime: preset.end,
    }]);
    
    setSelectedDate(null);
    toast.success(`${format(selectedDate, 'M/d')} ${preset.label}シフトを追加`);
  };

  const removeRequest = (dateStr: string) => {
    setRequests(requests.filter(r => r.date !== dateStr));
  };

  const getRequestForDate = (date: Date): ShiftRequest | undefined => {
    return requests.find(r => r.date === format(date, 'yyyy-MM-dd'));
  };

  const submitAllRequests = () => {
    if (requests.length === 0) {
      toast.error('希望を1つ以上入力してください');
      return;
    }
    toast.success(`${requests.length}件の希望を送信しました！`);
    setRequests([]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b">
        <h1 className="text-2xl font-bold">シフト希望</h1>
      </div>

      <div className="px-4 py-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-3 -ml-3 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-3 -mr-3 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={cn(
                'text-center text-sm font-medium py-2',
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="aspect-square" />
          ))}

          {monthDays.map((date) => {
            const request = getRequestForDate(date);
            const isTodayDate = isToday(date);
            const dayOfWeek = date.getDay();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateTap(date)}
                disabled={isPast}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center rounded-xl text-sm relative transition-all',
                  isPast && 'opacity-30',
                  isSelected && 'ring-2 ring-blue-500 bg-blue-50',
                  request && 'bg-green-50',
                  !isPast && !isSelected && !request && 'hover:bg-gray-50 active:bg-gray-100'
                )}
              >
                <span
                  className={cn(
                    'font-semibold',
                    dayOfWeek === 0 && 'text-red-500',
                    dayOfWeek === 6 && 'text-blue-500',
                    isTodayDate && 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center'
                  )}
                >
                  {format(date, 'd')}
                </span>
                
                {request && (
                  <span className="text-[10px] text-green-600 font-medium mt-0.5">
                    {request.startTime.slice(0, 2)}時〜
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Time Selection (shows when date is selected) */}
        {selectedDate && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200">
            <div className="bg-white w-full rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">
                    {format(selectedDate, 'M月d日（E）', { locale: ja })}
                  </h3>
                  <p className="text-gray-500 text-sm">希望する時間帯を選択</p>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TIME_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleTimeSelect(preset)}
                    className={cn(
                      'p-4 rounded-2xl text-left transition-all active:scale-95',
                      preset.color
                    )}
                  >
                    <span className="text-3xl mb-2 block">{preset.emoji}</span>
                    <span className="font-bold text-lg block">{preset.label}</span>
                    <span className="text-sm opacity-70">{preset.start} - {preset.end}</span>
                  </button>
                ))}
              </div>

              {/* Custom time (simplified) */}
              <button
                onClick={() => {
                  handleTimeSelect({ label: 'カスタム', start: '10:00', end: '19:00', emoji: '⏰', color: '' });
                }}
                className="w-full mt-3 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:bg-gray-50"
              >
                その他の時間
              </button>
            </div>
          </div>
        )}

        {/* Requests Summary */}
        {requests.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold mb-3">入力済み（{requests.length}件）</h3>
            <div className="space-y-2 mb-4">
              {requests.sort((a, b) => a.date.localeCompare(b.date)).map((req) => (
                <div
                  key={req.date}
                  className="flex items-center justify-between bg-white p-3 rounded-xl"
                >
                  <div>
                    <span className="font-medium">
                      {format(new Date(req.date), 'M/d（E）', { locale: ja })}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {req.startTime} - {req.endTime}
                    </span>
                  </div>
                  <button
                    onClick={() => removeRequest(req.date)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      {requests.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4">
          <Button
            onClick={submitAllRequests}
            className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg"
          >
            <Send className="h-5 w-5 mr-2" />
            {requests.length}件の希望を送信
          </Button>
        </div>
      )}
    </div>
  );
}
