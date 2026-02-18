'use client';

import { useMemo, useRef, useEffect } from 'react';
import { format, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useCalendarStore, Shift } from '@/lib/stores/calendar-store';
import { useSwipe } from '@/lib/hooks/use-swipe';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface DayViewProps {
  onTimeClick?: (date: Date, hour: number) => void;
  onShiftClick?: (shift: Shift) => void;
}

export function DayView({ onTimeClick, onShiftClick }: DayViewProps) {
  const { currentDate, selectedDate, shifts, goToPrevious, goToNext } = useCalendarStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const displayDate = selectedDate || currentDate;
  const isTodayDate = isToday(displayDate);

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  const dayShifts = useMemo(() => {
    const dateStr = format(displayDate, 'yyyy-MM-dd');
    return shifts.filter(s => s.date === dateStr);
  }, [displayDate, shifts]);

  // Scroll to current hour on mount
  useEffect(() => {
    if (scrollRef.current && isTodayDate) {
      const currentHour = new Date().getHours();
      const scrollTo = Math.max(0, (currentHour - 1) * 60);
      scrollRef.current.scrollTop = scrollTo;
    }
  }, [isTodayDate]);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  return (
    <div {...swipeHandlers} className="select-none h-full">
      {/* Date Header */}
      <div className={cn(
        'text-center py-4 mb-2 rounded-2xl',
        isTodayDate ? 'bg-blue-500 text-white' : 'bg-gray-100'
      )}>
        <div className={cn(
          'text-sm font-medium',
          isTodayDate ? 'text-blue-100' : 'text-gray-400'
        )}>
          {format(displayDate, 'yyyy年M月', { locale: ja })}
        </div>
        <div className={cn(
          'text-3xl font-bold',
          isTodayDate ? 'text-white' : 'text-gray-800'
        )}>
          {format(displayDate, 'd日（E）', { locale: ja })}
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={scrollRef}
        className="overflow-y-auto h-[calc(100vh-280px)] rounded-xl bg-white"
      >
        <div className="relative min-h-full">
          {/* Hour rows */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex h-[60px] border-b border-gray-50"
              onClick={() => onTimeClick?.(displayDate, hour)}
            >
              <div className="w-14 flex-shrink-0 text-right pr-3 pt-0 text-xs text-gray-400">
                {String(hour).padStart(2, '0')}:00
              </div>
              <div className="flex-1 relative hover:bg-gray-50 transition-colors cursor-pointer" />
            </div>
          ))}

          {/* Current time indicator */}
          {isTodayDate && (
            <div
              className="absolute left-12 right-0 flex items-center z-20 pointer-events-none"
              style={{ top: `${currentHour * 60 + currentMinute}px` }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>
          )}

          {/* Shifts */}
          <div className="absolute top-0 left-14 right-0">
            {dayShifts.map((shift, index) => {
              const startHour = parseInt(shift.startTime.split(':')[0]);
              const startMin = parseInt(shift.startTime.split(':')[1]);
              const endHour = parseInt(shift.endTime.split(':')[0]);
              const endMin = parseInt(shift.endTime.split(':')[1]);
              
              const top = startHour * 60 + startMin;
              const height = (endHour * 60 + endMin) - (startHour * 60 + startMin);

              // Calculate left offset for overlapping shifts
              const left = index * 5;

              return (
                <button
                  key={shift.id}
                  onClick={() => onShiftClick?.(shift)}
                  className="absolute rounded-xl px-3 py-2 text-left transition-all hover:shadow-lg active:scale-[0.99] shadow-sm"
                  style={{
                    top: `${top}px`,
                    height: `${Math.max(height, 40)}px`,
                    left: `${left}px`,
                    right: '4px',
                    backgroundColor: shift.color,
                    zIndex: 10 + index,
                  }}
                >
                  <div className="flex flex-col h-full text-white">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base">{shift.staffName}</span>
                      {shift.status === 'pending' && (
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                          未確定
                        </span>
                      )}
                    </div>
                    <span className="text-sm opacity-90 mt-0.5">
                      {shift.startTime} - {shift.endTime}
                    </span>
                    {shift.store && height > 60 && (
                      <span className="text-xs opacity-75 mt-auto">📍 {shift.store}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      {dayShifts.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-500">
            この日のシフト: <span className="font-bold text-gray-800">{dayShifts.length}件</span>
          </div>
        </div>
      )}
    </div>
  );
}
