'use client';

import { useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { useCalendarStore, Shift } from '@/lib/stores/calendar-store';
import { useSwipe } from '@/lib/hooks/use-swipe';
import { ShiftBlock } from './ShiftBlock';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

interface MonthViewProps {
  onDateClick?: (date: Date) => void;
  onShiftClick?: (shift: Shift) => void;
}

export function MonthView({ onDateClick, onShiftClick }: MonthViewProps) {
  const { currentDate, selectedDate, shifts, goToPrevious, goToNext, setSelectedDate, setView } = useCalendarStore();

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
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
    <div {...swipeHandlers} className="select-none">
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
      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
        {calendarDays.map((date) => {
          const dayShifts = getShiftsForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const dayOfWeek = date.getDay();

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              onDoubleClick={() => handleDateDoubleClick(date)}
              className={cn(
                'min-h-[80px] p-1 bg-white flex flex-col transition-colors',
                !isCurrentMonth && 'bg-gray-50',
                isSelected && 'bg-blue-50',
                'hover:bg-gray-50 active:bg-gray-100'
              )}
            >
              <span
                className={cn(
                  'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1',
                  !isCurrentMonth && 'text-gray-300',
                  isCurrentMonth && dayOfWeek === 0 && 'text-red-500',
                  isCurrentMonth && dayOfWeek === 6 && 'text-blue-500',
                  isCurrentMonth && dayOfWeek !== 0 && dayOfWeek !== 6 && 'text-gray-700',
                  isTodayDate && 'bg-blue-500 text-white',
                  isSelected && !isTodayDate && 'bg-blue-100 text-blue-600'
                )}
              >
                {format(date, 'd')}
              </span>

              {/* Shift indicators */}
              <div className="flex-1 space-y-0.5 overflow-hidden">
                {dayShifts.slice(0, 3).map((shift) => (
                  <ShiftBlock
                    key={shift.id}
                    shift={shift}
                    compact
                    onClick={() => onShiftClick?.(shift)}
                  />
                ))}
                {dayShifts.length > 3 && (
                  <span className="text-[10px] text-gray-400 px-1">
                    +{dayShifts.length - 3}件
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
