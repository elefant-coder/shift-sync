'use client';

import { Shift } from '@/lib/stores/calendar-store';
import { cn } from '@/lib/utils';

interface ShiftBlockProps {
  shift: Shift;
  compact?: boolean;
  onClick?: () => void;
}

export function ShiftBlock({ shift, compact = false, onClick }: ShiftBlockProps) {
  const startHour = parseInt(shift.startTime.split(':')[0]);
  const endHour = parseInt(shift.endTime.split(':')[0]);
  const duration = endHour - startHour;

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-transform active:scale-95"
        style={{ 
          backgroundColor: `${shift.color}15`,
          color: shift.color,
          borderLeft: `2px solid ${shift.color}`,
        }}
      >
        {shift.startTime.slice(0, 5)}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-2 py-1.5 rounded-lg transition-all",
        "hover:shadow-md active:scale-[0.98]",
      )}
      style={{ 
        backgroundColor: `${shift.color}20`,
        borderLeft: `3px solid ${shift.color}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm" style={{ color: shift.color }}>
          {shift.staffName}
        </span>
        {shift.status === 'pending' && (
          <span className="text-[10px] bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full">
            未確定
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">
        {shift.startTime} - {shift.endTime}
      </div>
    </button>
  );
}

// For day view timeline
interface TimelineShiftBlockProps {
  shift: Shift;
  onClick?: () => void;
}

export function TimelineShiftBlock({ shift, onClick }: TimelineShiftBlockProps) {
  const startHour = parseInt(shift.startTime.split(':')[0]);
  const startMin = parseInt(shift.startTime.split(':')[1]);
  const endHour = parseInt(shift.endTime.split(':')[0]);
  const endMin = parseInt(shift.endTime.split(':')[1]);
  
  const top = (startHour * 60 + startMin) * (60 / 60); // 60px per hour
  const height = ((endHour * 60 + endMin) - (startHour * 60 + startMin)) * (60 / 60);

  return (
    <button
      onClick={onClick}
      className="absolute left-16 right-2 rounded-lg px-3 py-2 transition-all hover:shadow-lg active:scale-[0.99]"
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 30)}px`,
        backgroundColor: shift.color,
      }}
    >
      <div className="flex flex-col h-full text-white">
        <span className="font-semibold text-sm truncate">{shift.staffName}</span>
        <span className="text-xs opacity-90">
          {shift.startTime} - {shift.endTime}
        </span>
        {shift.store && (
          <span className="text-xs opacity-75 mt-auto truncate">{shift.store}</span>
        )}
      </div>
    </button>
  );
}
