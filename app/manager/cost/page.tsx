'use client';

import { useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockData = {
  total: 458000,
  budget: 500000,
  lastMonth: 472000,
  breakdown: [
    { name: '田中 太郎', hours: 52, wage: 1200, total: 62400 },
    { name: '山田 花子', hours: 40, wage: 1100, total: 44000 },
    { name: '佐藤 次郎', hours: 36, wage: 1150, total: 41400 },
    { name: '鈴木 美咲', hours: 160, wage: 1500, total: 240000 },
    { name: '高橋 健太', hours: 24, wage: 1100, total: 26400 },
  ],
  daily: [
    { day: 1, amount: 18000 },
    { day: 5, amount: 22000 },
    { day: 10, amount: 15000 },
    { day: 15, amount: 28000 },
    { day: 20, amount: 24000 },
    { day: 25, amount: 21000 },
  ],
};

export default function CostPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const diff = mockData.total - mockData.lastMonth;
  const diffPercent = ((diff / mockData.lastMonth) * 100).toFixed(1);
  const budgetPercent = ((mockData.total / mockData.budget) * 100).toFixed(0);
  const remaining = mockData.budget - mockData.total;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">人件費</h2>
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
          <button onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-600 w-20 text-center">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </span>
          <button onClick={nextMonth}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Total Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 mb-6 text-white">
        <div className="text-sm text-gray-400 mb-1">今月の人件費</div>
        <div className="text-4xl font-bold mb-4">
          ¥{mockData.total.toLocaleString()}
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            'flex items-center gap-1 text-sm',
            diff < 0 ? 'text-green-400' : diff > 0 ? 'text-red-400' : 'text-gray-400'
          )}>
            {diff < 0 ? <TrendingDown className="h-4 w-4" /> : diff > 0 ? <TrendingUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            {diff < 0 ? '' : '+'}{diffPercent}%
          </div>
          <span className="text-sm text-gray-400">前月比</span>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">予算消化率</span>
          <span className="text-sm font-bold text-gray-800">{budgetPercent}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div 
            className={cn(
              'h-full rounded-full transition-all',
              Number(budgetPercent) > 90 ? 'bg-red-500' : Number(budgetPercent) > 75 ? 'bg-yellow-500' : 'bg-green-500'
            )}
            style={{ width: `${Math.min(Number(budgetPercent), 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>予算: ¥{mockData.budget.toLocaleString()}</span>
          <span className={remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
            残り: ¥{remaining.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Staff Breakdown */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">スタッフ別</h3>
        <div className="space-y-4">
          {mockData.breakdown.sort((a, b) => b.total - a.total).map((staff, index) => {
            const percent = (staff.total / mockData.total) * 100;
            return (
              <div key={staff.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-4">{index + 1}</span>
                    <span className="text-sm font-medium text-gray-700">{staff.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    ¥{staff.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {staff.hours}h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4">
          <div className="text-2xl font-bold text-gray-800">312h</div>
          <div className="text-xs text-gray-400">総勤務時間</div>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <div className="text-2xl font-bold text-gray-800">¥1,468</div>
          <div className="text-xs text-gray-400">平均時給</div>
        </div>
      </div>
    </div>
  );
}
