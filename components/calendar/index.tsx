'use client';

import { useCalendarStore, Shift } from '@/lib/stores/calendar-store';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';

interface CalendarProps {
  onDateClick?: (date: Date) => void;
  onTimeClick?: (date: Date, hour: number) => void;
  onShiftClick?: (shift: Shift) => void;
}

export function Calendar({ onDateClick, onTimeClick, onShiftClick }: CalendarProps) {
  const { view } = useCalendarStore();

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      
      <div className="flex-1 overflow-hidden">
        {view === 'month' && (
          <MonthView onDateClick={onDateClick} onShiftClick={onShiftClick} />
        )}
        {view === 'week' && (
          <WeekView onDateClick={onDateClick} onShiftClick={onShiftClick} />
        )}
        {view === 'day' && (
          <DayView onTimeClick={onTimeClick} onShiftClick={onShiftClick} />
        )}
      </div>
    </div>
  );
}

export { CalendarHeader } from './CalendarHeader';
export { MonthView } from './MonthView';
export { WeekView } from './WeekView';
export { DayView } from './DayView';
export { ShiftBlock, TimelineShiftBlock } from './ShiftBlock';
