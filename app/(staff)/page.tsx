'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/calendar';
import { ShiftInputDrawer, ShiftInputData } from '@/components/shift/ShiftInputDrawer';
import { ShiftDetailSheet } from '@/components/shift/ShiftDetailSheet';
import { useCalendarStore, Shift, SHIFT_COLORS } from '@/lib/stores/calendar-store';
import { toast } from 'sonner';

// Demo shifts
const demoShifts: Shift[] = [
  {
    id: '1',
    staffId: 'me',
    staffName: '私',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '14:00',
    color: SHIFT_COLORS[0],
    store: '渋谷店',
    status: 'confirmed',
  },
  {
    id: '2',
    staffId: 'me',
    staffName: '私',
    date: format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    startTime: '18:00',
    endTime: '23:00',
    color: SHIFT_COLORS[0],
    store: '渋谷店',
    status: 'confirmed',
  },
  {
    id: '3',
    staffId: 'me',
    staffName: '私',
    date: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '18:00',
    color: SHIFT_COLORS[0],
    store: '渋谷店',
    status: 'pending',
  },
  {
    id: '4',
    staffId: 'me',
    staffName: '私',
    date: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '18:00',
    color: SHIFT_COLORS[0],
    store: '新宿店',
    status: 'confirmed',
  },
];

export default function StaffHomePage() {
  const { selectedDate, selectedDates, setShifts, addShift, clearSelectedDates } = useCalendarStore();
  const [showInput, setShowInput] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Load demo shifts
  useEffect(() => {
    setShifts(demoShifts);
  }, [setShifts]);

  const handleDateClick = (date: Date) => {
    // Open input drawer for new shift request
    setShowInput(true);
  };

  const handleTimeClick = (date: Date, hour: number) => {
    setShowInput(true);
  };

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setShowDetail(true);
  };

  const handleShiftSubmit = (data: ShiftInputData) => {
    // Add new shift request
    const newShift: Shift = {
      id: `new-${Date.now()}`,
      staffId: 'me',
      staffName: '私',
      date: format(data.dates[0], 'yyyy-MM-dd'),
      startTime: data.startTime,
      endTime: data.endTime,
      color: SHIFT_COLORS[0],
      status: 'requested',
    };

    addShift(newShift);
    clearSelectedDates();
    toast.success('シフト希望を送信しました');
  };

  // Calculate stats
  const shifts = useCalendarStore(state => state.shifts);
  const thisWeekShifts = shifts.filter(s => {
    const shiftDate = new Date(s.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return shiftDate >= weekStart && shiftDate < weekEnd;
  });

  const totalHours = thisWeekShifts.reduce((acc, s) => {
    const start = parseInt(s.startTime.split(':')[0]);
    const end = parseInt(s.endTime.split(':')[0]);
    return acc + (end - start);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-24">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">マイシフト</h1>
          <p className="text-gray-400 mt-1">タップして希望を入力</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-500">{thisWeekShifts.length}</div>
            <div className="text-xs text-gray-400">今週のシフト</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-500">{totalHours}h</div>
            <div className="text-xs text-gray-400">勤務時間</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Calendar
            onDateClick={handleDateClick}
            onTimeClick={handleTimeClick}
            onShiftClick={handleShiftClick}
          />
        </div>
      </div>

      {/* Shift Input Drawer */}
      <ShiftInputDrawer
        open={showInput}
        onOpenChange={setShowInput}
        selectedDates={selectedDates.length > 0 ? selectedDates : selectedDate ? [selectedDate] : [new Date()]}
        onSubmit={handleShiftSubmit}
      />

      {/* Shift Detail Sheet */}
      <ShiftDetailSheet
        open={showDetail}
        onOpenChange={setShowDetail}
        shift={selectedShift}
      />
    </div>
  );
}
