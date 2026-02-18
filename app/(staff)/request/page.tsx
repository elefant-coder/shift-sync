'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShiftInputDrawer, ShiftInputData } from '@/components/shift/ShiftInputDrawer';
import { useSwipe } from '@/lib/hooks/use-swipe';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShiftRequest {
  date: string;
  startTime: string;
  endTime: string;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function RequestPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [requests, setRequests] = useState<ShiftRequest[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setCurrentMonth(addMonths(currentMonth, 1)),
    onSwipeRight: () => setCurrentMonth(subMonths(currentMonth, 1)),
  });

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Add padding days for calendar grid
  const firstDayOfMonth = monthDays[0].getDay();
  const paddingDays = Array(firstDayOfMonth).fill(null);

  const toggleDateSelection = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (selectedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr)) {
      setSelectedDates(prev => prev.filter(d => format(d, 'yyyy-MM-dd') !== dateStr));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  };

  const handleSubmit = (data: ShiftInputData) => {
    const newRequests: ShiftRequest[] = data.dates.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      startTime: data.startTime,
      endTime: data.endTime,
    }));

    setRequests(prev => [...prev, ...newRequests]);
    setSelectedDates([]);
    toast.success(`${newRequests.length}日分の希望を入力しました`);
  };

  const removeRequest = (dateStr: string) => {
    setRequests(prev => prev.filter(r => r.date !== dateStr));
    toast.success('希望を削除しました');
  };

  const getRequestForDate = (date: Date): ShiftRequest | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return requests.find(r => r.date === dateStr);
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };

  const submitAllRequests = () => {
    // In real app, this would send to API
    toast.success('全ての希望を送信しました！');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-24">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">シフト希望入力</h1>
          <p className="text-sm text-gray-400">日付をタップして希望を入力</p>
        </header>

        {/* Month Navigation */}
        <div {...swipeHandlers} className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">
              {format(currentMonth, 'yyyy年M月', { locale: ja })}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={cn(
                  'text-center text-xs font-medium py-2',
                  index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-400'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Padding days */}
            {paddingDays.map((_, index) => (
              <div key={`padding-${index}`} className="aspect-square" />
            ))}

            {/* Month days */}
            {monthDays.map((date) => {
              const request = getRequestForDate(date);
              const isSelected = isDateSelected(date);
              const isTodayDate = isToday(date);
              const dayOfWeek = date.getDay();
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => !isPast && toggleDateSelection(date)}
                  disabled={isPast}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-center rounded-xl transition-all text-sm relative',
                    isPast && 'opacity-30',
                    isSelected && 'bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2',
                    !isSelected && !request && 'hover:bg-gray-100',
                    request && !isSelected && 'bg-green-100'
                  )}
                >
                  <span
                    className={cn(
                      'font-medium',
                      !isSelected && dayOfWeek === 0 && 'text-red-500',
                      !isSelected && dayOfWeek === 6 && 'text-blue-500',
                      isTodayDate && !isSelected && 'text-blue-600 font-bold'
                    )}
                  >
                    {format(date, 'd')}
                  </span>
                  
                  {request && !isSelected && (
                    <span className="text-[8px] text-green-600 font-medium">
                      {request.startTime.slice(0, 2)}時〜
                    </span>
                  )}
                  
                  {isSelected && (
                    <Check className="h-3 w-3 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected dates action */}
        {selectedDates.length > 0 && (
          <div className="bg-blue-500 rounded-2xl p-4 mb-6 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between text-white">
              <div>
                <div className="font-bold">{selectedDates.length}日選択中</div>
                <div className="text-xs text-blue-100">タップして希望時間を入力</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDates([])}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <Button
                  onClick={() => setShowInput(true)}
                  className="bg-white text-blue-500 hover:bg-blue-50"
                >
                  時間を選択
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Requests List */}
        {requests.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">入力済みの希望</h3>
            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.date}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <div className="font-medium text-gray-800 text-sm">
                      {format(new Date(req.date), 'M/d（E）', { locale: ja })}
                    </div>
                    <div className="text-xs text-gray-400">
                      {req.startTime} - {req.endTime}
                    </div>
                  </div>
                  <button
                    onClick={() => removeRequest(req.date)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              onClick={submitAllRequests}
              className="w-full mt-4 h-12 rounded-xl bg-green-500 hover:bg-green-600"
            >
              <Check className="h-4 w-4 mr-2" />
              {requests.length}件の希望を送信
            </Button>
          </div>
        )}
      </div>

      {/* Shift Input Drawer */}
      <ShiftInputDrawer
        open={showInput}
        onOpenChange={setShowInput}
        selectedDates={selectedDates}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
