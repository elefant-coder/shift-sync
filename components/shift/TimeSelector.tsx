'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TimeSelectorProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
  label?: string;
  minTime?: string;
  maxTime?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export function TimeSelector({ value, onChange, label, minTime, maxTime }: TimeSelectorProps) {
  const [hour, minute] = value.split(':');
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const scrollToSelected = (ref: HTMLDivElement | null, index: number) => {
    if (ref) {
      const itemHeight = 44;
      ref.scrollTop = index * itemHeight - ref.clientHeight / 2 + itemHeight / 2;
    }
  };

  useEffect(() => {
    const hourIndex = HOURS.indexOf(hour);
    const minuteIndex = MINUTES.indexOf(minute) >= 0 ? MINUTES.indexOf(minute) : 0;
    scrollToSelected(hourRef.current, hourIndex);
    scrollToSelected(minuteRef.current, minuteIndex);
  }, []);

  const handleHourChange = (h: string) => {
    const newMinute = MINUTES.includes(minute) ? minute : '00';
    onChange(`${h}:${newMinute}`);
  };

  const handleMinuteChange = (m: string) => {
    onChange(`${hour}:${m}`);
  };

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className="text-sm font-medium text-gray-500 mb-2">{label}</span>
      )}
      <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2">
        {/* Hour selector */}
        <div
          ref={hourRef}
          className="h-[132px] w-16 overflow-y-auto scrollbar-hide snap-y snap-mandatory"
        >
          <div className="py-11">
            {HOURS.map((h) => (
              <button
                key={h}
                onClick={() => handleHourChange(h)}
                className={cn(
                  'w-full h-11 flex items-center justify-center text-xl font-bold snap-center transition-all',
                  hour === h ? 'text-blue-500 scale-110' : 'text-gray-300'
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <span className="text-2xl font-bold text-gray-400">:</span>

        {/* Minute selector */}
        <div
          ref={minuteRef}
          className="h-[132px] w-16 overflow-y-auto scrollbar-hide snap-y snap-mandatory"
        >
          <div className="py-11">
            {MINUTES.map((m) => (
              <button
                key={m}
                onClick={() => handleMinuteChange(m)}
                className={cn(
                  'w-full h-11 flex items-center justify-center text-xl font-bold snap-center transition-all',
                  minute === m ? 'text-blue-500 scale-110' : 'text-gray-300'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick time presets
interface QuickTimePresetsProps {
  onSelect: (start: string, end: string) => void;
}

export function QuickTimePresets({ onSelect }: QuickTimePresetsProps) {
  const presets = [
    { label: '朝', start: '09:00', end: '13:00', emoji: '🌅' },
    { label: '昼', start: '12:00', end: '17:00', emoji: '☀️' },
    { label: '夜', start: '17:00', end: '22:00', emoji: '🌙' },
    { label: '終日', start: '09:00', end: '18:00', emoji: '📅' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {presets.map(({ label, start, end, emoji }) => (
        <button
          key={label}
          onClick={() => onSelect(start, end)}
          className="flex flex-col items-center py-3 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
        >
          <span className="text-xl mb-1">{emoji}</span>
          <span className="text-xs font-medium text-gray-700">{label}</span>
          <span className="text-[10px] text-gray-400">{start}-{end}</span>
        </button>
      ))}
    </div>
  );
}
