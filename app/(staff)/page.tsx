'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo data
const mockShifts = [
  { id: '1', date: '2025-02-18', start: '09:00', end: '14:00', store: '渋谷店' },
  { id: '2', date: '2025-02-20', start: '18:00', end: '23:00', store: '渋谷店' },
  { id: '3', date: '2025-02-21', start: '14:00', end: '18:00', store: '渋谷店' },
  { id: '4', date: '2025-02-22', start: '09:00', end: '18:00', store: '新宿店' },
];

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const todayShift = mockShifts.find(s => s.date === selectedDateStr);

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  return (
    <div className="px-6 pt-12 pb-8">
      {/* Header - Clean & Minimal */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          シフト
        </h1>
        <p className="text-gray-400 mt-1">
          {format(currentDate, 'yyyy年M月', { locale: ja })}
        </p>
      </header>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={prevWeek}
          className="p-2 rounded-full hover:bg-gray-50 transition-colors touch-active"
        >
          <ChevronLeft className="h-5 w-5 text-gray-400" />
        </button>
        
        <span className="text-sm font-medium text-gray-500">
          {format(weekStart, 'M/d', { locale: ja })} - {format(addDays(weekStart, 6), 'M/d', { locale: ja })}
        </span>
        
        <button 
          onClick={nextWeek}
          className="p-2 rounded-full hover:bg-gray-50 transition-colors touch-active"
        >
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Week Calendar - Super Clean */}
      <div className="grid grid-cols-7 gap-2 mb-10">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasShift = mockShifts.some(s => s.date === dateStr);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const shift = mockShifts.find(s => s.date === dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'flex flex-col items-center py-3 rounded-2xl transition-all touch-active',
                isSelected 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : isTodayDate
                  ? 'bg-gray-50'
                  : 'hover:bg-gray-50'
              )}
            >
              <span className={cn(
                'text-[10px] font-medium mb-1',
                isSelected ? 'text-blue-100' : 'text-gray-400'
              )}>
                {format(day, 'E', { locale: ja })}
              </span>
              <span className={cn(
                'text-lg font-bold',
                isSelected ? 'text-white' : 'text-gray-800'
              )}>
                {format(day, 'd')}
              </span>
              {hasShift && (
                <div className={cn(
                  'text-[9px] font-medium mt-1 px-1.5 py-0.5 rounded-full',
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-50 text-blue-500'
                )}>
                  {shift?.start.slice(0, 2)}時〜
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {format(selectedDate, 'M月d日（E）', { locale: ja })}
        </h2>
        
        {todayShift ? (
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold">{todayShift.start}</span>
              <span className="text-xl text-blue-200 mx-2">→</span>
              <span className="text-4xl font-bold">{todayShift.end}</span>
            </div>
            <div className="flex items-center text-blue-100">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{todayShift.store}</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-10 text-center">
            <div className="text-5xl mb-4">🏖️</div>
            <p className="text-gray-400 font-medium">お休み</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-bold text-gray-800">4</div>
          <div className="text-xs text-gray-400 mt-1">今週のシフト</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-5 text-center">
          <div className="text-3xl font-bold text-gray-800">24h</div>
          <div className="text-xs text-gray-400 mt-1">勤務時間</div>
        </div>
      </div>
    </div>
  );
}
