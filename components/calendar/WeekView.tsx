'use client';

import { useMemo } from 'react';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { useCalendarStore, Shift } from '@/lib/stores/calendar-store';
import { useSwipe } from '@/lib/hooks/use-swipe';
import { ShiftBlock } from './ShiftBlock';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6:00 - 21:00

interface WeekViewProps {
  onDateClick?: (date: Date) => void;
  onShiftClick?: (shift: Shift) => void;
}

export function WeekView({ onDateClick, onShiftClick }: WeekViewProps) {
  const { currentDate, selectedDate, shifts, goToPrevious, goToNext, setSelectedDate, setView } = useCalendarStore();

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  const getShiftsForDate = (date: Date): Shift[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.filter(s => s.date === dateStr);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const handleDateDoubleClick = (date: Date) => {
    setSelectedDate(date);
    setView('day');
  };

  return (
    <div {...swipeHandlers} className="select-none overflow-x-auto">
      {/* Day Headers */}
      <div className="grid grid-cols-[48px_repeat(7,1fr)] sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="h-14" /> {/* Empty corner */}
        {weekDays.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const dayOfWeek = date.getDay();

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              onDoubleClick={() => handleDateDoubleClick(date)}
              className={cn(
                'flex flex-col items-center justify-center py-2 transition-colors',
                'hover:bg-gray-50 active:bg-gray-100'
              )}
            >
              <span
                className={cn(
                  'text-xs font-medium',
                  dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : 'text-gray-400'
                )}
              >
                {format(date, 'E', { locale: ja })}
              </span>
              <span
                className={cn(
                  'text-lg font-bold w-9 h-9 flex items-center justify-center rounded-full mt-1',
                  dayOfWeek === 0 && 'text-red-500',
                  dayOfWeek === 6 && 'text-blue-500',
                  dayOfWeek !== 0 && dayOfWeek !== 6 && 'text-gray-700',
                  isTodayDate && 'bg-blue-500 text-white',
                  isSelected && !isTodayDate && 'bg-blue-100 text-blue-600'
                )}
              >
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-[48px_repeat(7,1fr)] relative min-h-[600px]">
        {/* Time labels */}
        <div className="flex flex-col">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-[60px] flex items-start justify-end pr-2 -mt-2 text-[10px] text-gray-400"
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((date) => {
          const dayShifts = getShiftsForDate(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'relative border-l border-gray-100',
                isTodayDate && 'bg-blue-50/30'
              )}
              onClick={() => handleDateClick(date)}
            >
              {/* Hour grid lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-[60px] border-b border-gray-50"
                />
              ))}

              {/* Shifts */}
              {dayShifts.map((shift) => {
                const startHour = parseInt(shift.startTime.split(':')[0]);
                const startMin = parseInt(shift.startTime.split(':')[1]);
                const endHour = parseInt(shift.endTime.split(':')[0]);
                const endMin = parseInt(shift.endTime.split(':')[1]);
                
                const top = ((startHour - 6) * 60 + startMin);
                const height = ((endHour - startHour) * 60 + (endMin - startMin));

                return (
                  <button
                    key={shift.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onShiftClick?.(shift);
                    }}
                    className="absolute left-0.5 right-0.5 rounded-md px-1 py-0.5 text-left transition-all hover:shadow-md active:scale-[0.98] overflow-hidden"
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(height, 24)}px`,
                      backgroundColor: shift.color,
                    }}
                  >
                    <div className="text-[10px] text-white font-medium truncate">
                      {shift.staffName}
                    </div>
                    {height > 30 && (
                      <div className="text-[9px] text-white/80 truncate">
                        {shift.startTime}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
