'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X, Repeat, Calendar, Clock, ChevronRight } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { TimeSelector, QuickTimePresets } from './TimeSelector';
import { cn } from '@/lib/utils';

interface ShiftInputDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDates: Date[];
  onSubmit: (data: ShiftInputData) => void;
}

export interface ShiftInputData {
  dates: Date[];
  startTime: string;
  endTime: string;
  recurring?: {
    type: 'weekly' | 'biweekly';
    days: number[];
    until?: Date;
  };
  note?: string;
}

const WEEKDAYS = [
  { label: '日', value: 0 },
  { label: '月', value: 1 },
  { label: '火', value: 2 },
  { label: '水', value: 3 },
  { label: '木', value: 4 },
  { label: '金', value: 5 },
  { label: '土', value: 6 },
];

export function ShiftInputDrawer({
  open,
  onOpenChange,
  selectedDates,
  onSubmit,
}: ShiftInputDrawerProps) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [showRecurring, setShowRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'weekly' | 'biweekly'>('weekly');
  const [recurringDays, setRecurringDays] = useState<number[]>([]);

  // Reset when opening
  useEffect(() => {
    if (open && selectedDates.length > 0) {
      // Pre-select weekdays based on selected dates
      const days = [...new Set(selectedDates.map(d => d.getDay()))];
      setRecurringDays(days);
    }
  }, [open, selectedDates]);

  const toggleRecurringDay = (day: number) => {
    setRecurringDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleQuickPreset = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleSubmit = () => {
    onSubmit({
      dates: selectedDates,
      startTime,
      endTime,
      recurring: showRecurring
        ? {
            type: recurringType,
            days: recurringDays,
          }
        : undefined,
    });
    onOpenChange(false);
  };

  const displayDate = selectedDates.length === 1
    ? format(selectedDates[0], 'M月d日（E）', { locale: ja })
    : `${selectedDates.length}日間`;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold">
              シフト希望を入力
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </DrawerClose>
          </div>
          
          {/* Selected date display */}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{displayDate}</span>
          </div>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto">
          {/* Quick presets */}
          <QuickTimePresets onSelect={handleQuickPreset} />

          {/* Time selection */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">時間を選択</span>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <TimeSelector
                value={startTime}
                onChange={setStartTime}
                label="開始"
              />
              <div className="text-2xl text-gray-300">→</div>
              <TimeSelector
                value={endTime}
                onChange={setEndTime}
                label="終了"
              />
            </div>

            {/* Duration display */}
            <div className="text-center mt-4 text-sm text-gray-500">
              勤務時間: <span className="font-bold text-gray-700">
                {calculateDuration(startTime, endTime)}時間
              </span>
            </div>
          </div>

          {/* Recurring settings */}
          <button
            onClick={() => setShowRecurring(!showRecurring)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl mb-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Repeat className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">繰り返し設定</div>
                <div className="text-xs text-gray-400">毎週同じ日に勤務</div>
              </div>
            </div>
            <ChevronRight className={cn(
              'h-5 w-5 text-gray-400 transition-transform',
              showRecurring && 'rotate-90'
            )} />
          </button>

          {showRecurring && (
            <div className="bg-white rounded-2xl p-4 mb-4 animate-in slide-in-from-top-2 duration-200">
              {/* Recurring type */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                <button
                  onClick={() => setRecurringType('weekly')}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                    recurringType === 'weekly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  )}
                >
                  毎週
                </button>
                <button
                  onClick={() => setRecurringType('biweekly')}
                  className={cn(
                    'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                    recurringType === 'biweekly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  )}
                >
                  隔週
                </button>
              </div>

              {/* Weekday selection */}
              <div className="text-xs text-gray-400 mb-2">繰り返す曜日</div>
              <div className="flex gap-1">
                {WEEKDAYS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => toggleRecurringDay(value)}
                    className={cn(
                      'flex-1 py-2 text-sm font-bold rounded-lg transition-all',
                      recurringDays.includes(value)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-400',
                      value === 0 && 'text-red-400',
                      value === 6 && 'text-blue-400'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-gray-100">
          <Button
            onClick={handleSubmit}
            className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-500 hover:bg-blue-600"
          >
            希望を送信
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function calculateDuration(start: string, end: string): number {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const duration = (endMinutes - startMinutes) / 60;
  return Math.max(0, duration);
}
