'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, UserPlus } from 'lucide-react';
import { Calendar } from '@/components/calendar';
import { ShiftDetailSheet } from '@/components/shift/ShiftDetailSheet';
import { useCalendarStore, Shift, SHIFT_COLORS } from '@/lib/stores/calendar-store';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { toast } from 'sonner';

// Demo staff
const mockStaff = [
  { id: '1', name: '田中太郎', emoji: '🙂', color: SHIFT_COLORS[0] },
  { id: '2', name: '山田花子', emoji: '😊', color: SHIFT_COLORS[1] },
  { id: '3', name: '佐藤一郎', emoji: '😄', color: SHIFT_COLORS[2] },
  { id: '4', name: '鈴木美咲', emoji: '🤗', color: SHIFT_COLORS[3] },
  { id: '5', name: '高橋健二', emoji: '😎', color: SHIFT_COLORS[4] },
];

// Demo shifts
const createDemoShifts = (): Shift[] => {
  const today = new Date();
  const shifts: Shift[] = [];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Random assignments
    const staffCount = Math.floor(Math.random() * 3) + 1;
    const selectedStaff = [...mockStaff].sort(() => Math.random() - 0.5).slice(0, staffCount);
    
    selectedStaff.forEach((staff, idx) => {
      const startTimes = ['09:00', '12:00', '14:00', '17:00'];
      const endTimes = ['14:00', '17:00', '18:00', '22:00'];
      
      shifts.push({
        id: `${dateStr}-${staff.id}`,
        staffId: staff.id,
        staffName: staff.name,
        date: dateStr,
        startTime: startTimes[idx % startTimes.length],
        endTime: endTimes[idx % endTimes.length],
        color: staff.color,
        status: Math.random() > 0.7 ? 'pending' : 'confirmed',
      });
    });
  }
  
  return shifts;
};

export default function ManagerSchedulePage() {
  const { selectedDate, setShifts, addShift } = useCalendarStore();
  const [showDetail, setShowDetail] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [assignTime, setAssignTime] = useState({ start: '09:00', end: '17:00' });

  // Load demo shifts
  useEffect(() => {
    setShifts(createDemoShifts());
  }, [setShifts]);

  const handleDateClick = (date: Date) => {
    setShowAssign(true);
  };

  const handleTimeClick = (date: Date, hour: number) => {
    setAssignTime({
      start: `${String(hour).padStart(2, '0')}:00`,
      end: `${String(Math.min(hour + 4, 23)).padStart(2, '0')}:00`,
    });
    setShowAssign(true);
  };

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setShowDetail(true);
  };

  const handleAssignShift = () => {
    if (!selectedStaff || !selectedDate) return;
    
    const staff = mockStaff.find(s => s.id === selectedStaff);
    if (!staff) return;

    const newShift: Shift = {
      id: `new-${Date.now()}`,
      staffId: staff.id,
      staffName: staff.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: assignTime.start,
      endTime: assignTime.end,
      color: staff.color,
      status: 'confirmed',
    };

    addShift(newShift);
    setShowAssign(false);
    setSelectedStaff(null);
    toast.success(`${staff.name}さんをシフトに追加しました`);
  };

  const handleDeleteShift = (shift: Shift) => {
    // In real app, this would delete from database
    toast.success('シフトを削除しました');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">シフト作成</h1>
            <p className="text-sm text-gray-400">日付をタップしてスタッフを配置</p>
          </div>
          <Button
            onClick={() => setShowAssign(true)}
            className="rounded-xl bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            追加
          </Button>
        </header>

        {/* Calendar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <Calendar
            onDateClick={handleDateClick}
            onTimeClick={handleTimeClick}
            onShiftClick={handleShiftClick}
          />
        </div>
      </div>

      {/* Shift Detail Sheet */}
      <ShiftDetailSheet
        open={showDetail}
        onOpenChange={setShowDetail}
        shift={selectedShift}
        canEdit={true}
        onDelete={handleDeleteShift}
      />

      {/* Assign Staff Drawer */}
      <Drawer open={showAssign} onOpenChange={setShowAssign}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="border-b border-gray-100">
            <DrawerTitle className="text-xl font-bold">
              スタッフを配置
            </DrawerTitle>
            {selectedDate && (
              <p className="text-sm text-gray-400 mt-1">
                {format(selectedDate, 'M月d日')}のシフト
              </p>
            )}
          </DrawerHeader>

          <div className="p-4">
            {/* Time selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                勤務時間
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={assignTime.start}
                  onChange={(e) => setAssignTime(prev => ({ ...prev, start: e.target.value }))}
                  className="flex-1 p-3 bg-gray-100 rounded-xl text-gray-700"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                      {String(i).padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
                <span className="text-gray-400">→</span>
                <select
                  value={assignTime.end}
                  onChange={(e) => setAssignTime(prev => ({ ...prev, end: e.target.value }))}
                  className="flex-1 p-3 bg-gray-100 rounded-xl text-gray-700"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                      {String(i).padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff selection */}
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              スタッフを選択
            </label>
            <div className="space-y-2">
              {mockStaff.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedStaff === staff.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-2xl">{staff.emoji}</span>
                  <span className="font-medium text-gray-700">{staff.name}</span>
                  <div
                    className="ml-auto w-4 h-4 rounded-full"
                    style={{ backgroundColor: staff.color }}
                  />
                </button>
              ))}
            </div>
          </div>

          <DrawerFooter className="border-t border-gray-100">
            <Button
              onClick={handleAssignShift}
              disabled={!selectedStaff}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              シフトに追加
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
