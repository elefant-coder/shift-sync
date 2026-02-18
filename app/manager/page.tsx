'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo data
const mockStaff = [
  { id: '1', name: '田中', emoji: '🙂' },
  { id: '2', name: '山田', emoji: '😊' },
  { id: '3', name: '佐藤', emoji: '😄' },
  { id: '4', name: '鈴木', emoji: '🤗' },
  { id: '5', name: '高橋', emoji: '😎' },
];

const mockShifts: Record<string, Record<string, { start: string; end: string }>> = {
  '2025-02-18': { '1': { start: '09:00', end: '14:00' }, '2': { start: '14:00', end: '22:00' } },
  '2025-02-19': { '3': { start: '09:00', end: '17:00' }, '4': { start: '17:00', end: '22:00' } },
  '2025-02-20': { '1': { start: '18:00', end: '22:00' }, '5': { start: '09:00', end: '14:00' } },
  '2025-02-21': { '2': { start: '09:00', end: '14:00' }, '3': { start: '14:00', end: '22:00' } },
  '2025-02-22': { '1': { start: '09:00', end: '18:00' }, '4': { start: '18:00', end: '23:00' } },
};

const requiredStaff: Record<string, number> = {
  '2025-02-18': 2,
  '2025-02-19': 3,
  '2025-02-20': 3,
  '2025-02-21': 2,
  '2025-02-22': 3,
};

export default function ManagerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayShifts = mockShifts[selectedDateStr] || {};
  const assignedCount = Object.keys(dayShifts).length;
  const required = requiredStaff[selectedDateStr] || 2;
  const isShortage = assignedCount < required;

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">シフト管理</h2>
          <p className="text-gray-400 text-sm">{format(currentDate, 'yyyy年M月', { locale: ja })}</p>
        </div>
        <button className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/30">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3">
        <button onClick={prevWeek} className="p-2">
          <ChevronLeft className="h-5 w-5 text-gray-400" />
        </button>
        <span className="text-sm font-medium text-gray-600">
          {format(weekStart, 'M/d', { locale: ja })} - {format(addDays(weekStart, 6), 'M/d', { locale: ja })}
        </span>
        <button onClick={nextWeek} className="p-2">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Week View */}
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const shifts = mockShifts[dateStr] || {};
            const count = Object.keys(shifts).length;
            const req = requiredStaff[dateStr] || 2;
            const shortage = count < req;
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'flex flex-col items-center py-2 rounded-xl transition-all',
                  isSelected 
                    ? 'bg-blue-500 text-white' 
                    : shortage 
                    ? 'bg-red-50' 
                    : 'bg-gray-50'
                )}
              >
                <span className={cn(
                  'text-[10px] font-medium',
                  isSelected ? 'text-blue-100' : 'text-gray-400'
                )}>
                  {format(day, 'E', { locale: ja })}
                </span>
                <span className={cn(
                  'text-lg font-bold',
                  isSelected ? 'text-white' : 'text-gray-800'
                )}>
                  {format(day, 'd')}
                </span>
                <div className={cn(
                  'text-[10px] font-medium mt-1',
                  isSelected 
                    ? 'text-blue-100' 
                    : shortage 
                    ? 'text-red-500' 
                    : 'text-green-500'
                )}>
                  {count}/{req}人
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {format(selectedDate, 'M/d（E）', { locale: ja })}
          </h3>
          {isShortage ? (
            <span className="flex items-center text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {required - assignedCount}名不足
            </span>
          ) : (
            <span className="flex items-center text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
              <Check className="h-3 w-3 mr-1" />
              OK
            </span>
          )}
        </div>

        {/* Staff List */}
        <div className="space-y-3">
          {mockStaff.filter(s => dayShifts[s.id]).map((staff) => (
            <div 
              key={staff.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{staff.emoji}</span>
                <span className="font-medium text-gray-700">{staff.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {dayShifts[staff.id]?.start} - {dayShifts[staff.id]?.end}
              </span>
            </div>
          ))}
          
          {assignedCount === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>まだシフトがありません</p>
            </div>
          )}
        </div>

        {/* Add Staff Button */}
        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium flex items-center justify-center gap-2 hover:border-blue-300 hover:text-blue-500 transition-colors">
          <Plus className="h-4 w-4" />
          スタッフを追加
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">12</div>
          <div className="text-[10px] text-gray-400">今週のシフト</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-500">2</div>
          <div className="text-[10px] text-gray-400">人員不足の日</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">5</div>
          <div className="text-[10px] text-gray-400">希望未確認</div>
        </div>
      </div>
    </div>
  );
}
