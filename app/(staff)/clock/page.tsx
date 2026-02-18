'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Clock, MapPin, CheckCircle2, LogIn, LogOut, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ClockRecord {
  id: string;
  type: 'in' | 'out';
  time: Date;
  location?: string;
}

export default function ClockPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [records, setRecords] = useState<ClockRecord[]>([]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    setIsClockedIn(true);
    setClockInTime(now);
    setRecords(prev => [{
      id: `in-${Date.now()}`,
      type: 'in',
      time: now,
      location: '渋谷店',
    }, ...prev]);
    toast.success('出勤しました！');
  };

  const handleClockOut = () => {
    const now = new Date();
    setIsClockedIn(false);
    setRecords(prev => [{
      id: `out-${Date.now()}`,
      type: 'out',
      time: now,
      location: '渋谷店',
    }, ...prev]);
    setClockInTime(null);
    toast.success('退勤しました！お疲れ様でした');
  };

  const getWorkingDuration = () => {
    if (!clockInTime) return '0:00:00';
    const diff = currentTime.getTime() - clockInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-24">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-gray-400 text-sm">
            {format(currentTime, 'yyyy年M月d日（E）', { locale: ja })}
          </p>
          <h1 className="text-5xl font-bold text-gray-900 mt-2 font-mono">
            {format(currentTime, 'HH:mm:ss')}
          </h1>
        </header>

        {/* Status Card */}
        <div className={cn(
          'rounded-3xl p-6 mb-6 transition-all duration-500',
          isClockedIn
            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
            : 'bg-white shadow-sm'
        )}>
          <div className="flex items-center justify-center gap-3 mb-4">
            {isClockedIn ? (
              <>
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-bold text-lg">勤務中</span>
              </>
            ) : (
              <>
                <Clock className="h-6 w-6 text-gray-400" />
                <span className="font-bold text-lg text-gray-800">出勤前</span>
              </>
            )}
          </div>

          {isClockedIn && (
            <div className="text-center">
              <div className="text-sm text-green-100 mb-1">勤務時間</div>
              <div className="text-4xl font-bold font-mono">
                {getWorkingDuration()}
              </div>
              <div className="flex items-center justify-center gap-1 mt-3 text-green-100 text-sm">
                <MapPin className="h-4 w-4" />
                <span>渋谷店</span>
              </div>
            </div>
          )}
        </div>

        {/* Clock Button */}
        <div className="flex justify-center mb-8">
          {isClockedIn ? (
            <button
              onClick={handleClockOut}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white flex flex-col items-center justify-center shadow-xl shadow-red-500/30 active:scale-95 transition-transform"
            >
              <LogOut className="h-10 w-10 mb-2" />
              <span className="text-xl font-bold">退勤</span>
            </button>
          ) : (
            <button
              onClick={handleClockIn}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col items-center justify-center shadow-xl shadow-blue-500/30 active:scale-95 transition-transform"
            >
              <LogIn className="h-10 w-10 mb-2" />
              <span className="text-xl font-bold">出勤</span>
            </button>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            今日の予定シフト
          </h2>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <div>
              <div className="font-bold text-blue-600">09:00 - 17:00</div>
              <div className="text-xs text-blue-400">8時間勤務</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-500">
              <MapPin className="h-3 w-3" />
              <span>渋谷店</span>
            </div>
          </div>
        </div>

        {/* Recent Records */}
        {records.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <History className="h-4 w-4 text-gray-400" />
              打刻履歴
            </h2>
            <div className="space-y-2">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      record.type === 'in' ? 'bg-blue-100' : 'bg-red-100'
                    )}>
                      {record.type === 'in' ? (
                        <LogIn className="h-4 w-4 text-blue-500" />
                      ) : (
                        <LogOut className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">
                        {record.type === 'in' ? '出勤' : '退勤'}
                      </div>
                      {record.location && (
                        <div className="text-xs text-gray-400">{record.location}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {format(record.time, 'HH:mm:ss')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
