'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { X, Clock, MapPin, User, Edit2, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Shift } from '@/lib/stores/calendar-store';

interface ShiftDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  onEdit?: (shift: Shift) => void;
  onDelete?: (shift: Shift) => void;
  canEdit?: boolean;
}

export function ShiftDetailSheet({
  open,
  onOpenChange,
  shift,
  onEdit,
  onDelete,
  canEdit = false,
}: ShiftDetailSheetProps) {
  if (!shift) return null;

  const date = new Date(shift.date);
  const startHour = parseInt(shift.startTime.split(':')[0]);
  const endHour = parseInt(shift.endTime.split(':')[0]);
  const duration = endHour - startHour;

  const statusLabel = {
    confirmed: { text: '確定', color: 'bg-green-100 text-green-600' },
    pending: { text: '未確定', color: 'bg-yellow-100 text-yellow-600' },
    requested: { text: '希望', color: 'bg-blue-100 text-blue-600' },
  };

  const status = shift.status ? statusLabel[shift.status] : statusLabel.confirmed;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh]">
        <SheetHeader className="text-left">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl font-bold text-gray-900">
                {shift.staffName}
              </SheetTitle>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${status.color}`}>
                {status.text}
              </span>
            </div>
            <SheetClose asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Date */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg"
              style={{ backgroundColor: shift.color }}
            >
              {format(date, 'd')}
            </div>
            <div>
              <div className="font-bold text-gray-800">
                {format(date, 'M月d日（E）', { locale: ja })}
              </div>
              <div className="text-sm text-gray-400">
                {format(date, 'yyyy年', { locale: ja })}
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <div className="font-bold text-gray-800">
                {shift.startTime} - {shift.endTime}
              </div>
              <div className="text-sm text-gray-400">
                {duration}時間勤務
              </div>
            </div>
          </div>

          {/* Store */}
          {shift.store && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="font-bold text-gray-800">{shift.store}</div>
                <div className="text-sm text-gray-400">勤務場所</div>
              </div>
            </div>
          )}

          {/* Staff ID (for managers) */}
          {canEdit && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="font-bold text-gray-800">スタッフID</div>
                <div className="text-sm text-gray-400">{shift.staffId}</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => {
                onEdit?.(shift);
                onOpenChange(false);
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              編集
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => {
                onDelete?.(shift);
                onOpenChange(false);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
