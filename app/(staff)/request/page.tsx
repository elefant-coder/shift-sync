'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, Sun, Moon, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'off';

const timeSlots: { id: TimeSlot; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'morning', label: '朝', icon: Sun, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { id: 'afternoon', label: '昼', icon: Coffee, color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { id: 'evening', label: '夜', icon: Moon, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { id: 'off', label: '×', icon: () => <span>×</span>, color: 'bg-gray-100 text-gray-400 border-gray-200' },
];

export default function RequestPage() {
  // Start from next week
  const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
  const [weekStart, setWeekStart] = useState(nextWeekStart);
  const [preferences, setPreferences] = useState<Record<string, TimeSlot>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));

  const toggleSlot = (dateStr: string, slot: TimeSlot) => {
    setPreferences(prev => ({
      ...prev,
      [dateStr]: prev[dateStr] === slot ? 'off' : slot
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    toast.success('希望を提出しました！', {
      description: '店長が確認後、シフトが確定します',
    });
  };

  if (isSubmitted) {
    return (
      <div className="px-6 pt-12 pb-8 min-h-screen flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">提出完了</h1>
        <p className="text-gray-400 text-center">
          {format(weekStart, 'M/d', { locale: ja })} 〜 {format(addDays(weekStart, 6), 'M/d', { locale: ja })} の希望
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setPreferences({});
            setWeekStart(addWeeks(weekStart, 1));
          }}
          className="mt-8 px-8 py-3 bg-gray-100 rounded-full text-gray-600 font-medium"
        >
          次の週を入力
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-12 pb-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">希望提出</h1>
        <p className="text-gray-400 mt-1">働きたい時間をタップ</p>
      </header>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-2xl p-4">
        <button 
          onClick={prevWeek}
          className="p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-400" />
        </button>
        
        <div className="text-center">
          <div className="text-sm font-bold text-gray-800">
            {format(weekStart, 'M月d日', { locale: ja })} 〜 {format(addDays(weekStart, 6), 'M月d日', { locale: ja })}
          </div>
        </div>
        
        <button 
          onClick={nextWeek}
          className="p-2 rounded-full hover:bg-white transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Day Cards */}
      <div className="space-y-4 mb-8">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const selected = preferences[dateStr];

          return (
            <div key={dateStr} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-gray-800">
                    {format(day, 'd')}
                  </span>
                  <span className="text-sm text-gray-400 ml-2">
                    {format(day, 'E', { locale: ja })}
                  </span>
                </div>
                {selected && selected !== 'off' && (
                  <span className="text-xs text-blue-500 font-medium">選択済み</span>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => toggleSlot(dateStr, id)}
                    className={cn(
                      'flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all touch-active',
                      selected === id
                        ? color
                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                    )}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-transform active:scale-[0.98]"
      >
        希望を提出
      </button>
    </div>
  );
}
