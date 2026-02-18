'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MapPin, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClockPage() {
  const [status, setStatus] = useState<'idle' | 'working' | 'done'>('idle');
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  
  const now = new Date();

  const handleClockIn = () => {
    setClockInTime(format(now, 'HH:mm'));
    setStatus('working');
  };

  const handleClockOut = () => {
    setClockOutTime(format(now, 'HH:mm'));
    setStatus('done');
  };

  return (
    <div className="px-6 pt-12 pb-8 min-h-screen flex flex-col">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">打刻</h1>
        <p className="text-gray-400 mt-1">
          {format(now, 'M月d日（E）', { locale: ja })}
        </p>
      </header>

      {/* Current Time Display */}
      <div className="text-center mb-12">
        <div className="text-6xl font-bold text-gray-900 tracking-tight">
          {format(now, 'HH:mm')}
        </div>
        <div className="flex items-center justify-center text-gray-400 mt-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">渋谷店</span>
        </div>
      </div>

      {/* Clock Button Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {status === 'idle' && (
          <button
            onClick={handleClockIn}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-500/40 flex flex-col items-center justify-center transition-transform active:scale-95"
          >
            <span className="text-3xl font-bold">出勤</span>
            <span className="text-blue-100 text-sm mt-2">タップして打刻</span>
          </button>
        )}

        {status === 'working' && (
          <button
            onClick={handleClockOut}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-2xl shadow-orange-500/40 flex flex-col items-center justify-center transition-transform active:scale-95"
          >
            <span className="text-3xl font-bold">退勤</span>
            <span className="text-orange-100 text-sm mt-2">タップして打刻</span>
          </button>
        )}

        {status === 'done' && (
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-2xl shadow-green-500/40 flex flex-col items-center justify-center">
            <Check className="h-16 w-16 mb-2" />
            <span className="text-xl font-bold">完了</span>
          </div>
        )}
      </div>

      {/* Time Record */}
      <div className="mt-auto space-y-3">
        <div className={cn(
          'flex items-center justify-between p-4 rounded-2xl transition-colors',
          clockInTime ? 'bg-blue-50' : 'bg-gray-50'
        )}>
          <span className="text-gray-500 font-medium">出勤</span>
          <span className={cn(
            'text-xl font-bold',
            clockInTime ? 'text-blue-500' : 'text-gray-300'
          )}>
            {clockInTime || '--:--'}
          </span>
        </div>
        
        <div className={cn(
          'flex items-center justify-between p-4 rounded-2xl transition-colors',
          clockOutTime ? 'bg-orange-50' : 'bg-gray-50'
        )}>
          <span className="text-gray-500 font-medium">退勤</span>
          <span className={cn(
            'text-xl font-bold',
            clockOutTime ? 'text-orange-500' : 'text-gray-300'
          )}>
            {clockOutTime || '--:--'}
          </span>
        </div>
      </div>
    </div>
  );
}
