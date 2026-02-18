'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  Clock,
  Trash2,
  Edit2,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SHIFT_COLORS } from '@/lib/stores/calendar-store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  emoji: string;
  color: string;
  role: 'staff' | 'manager';
  weeklyHours: number;
  joinedAt: string;
}

const mockStaff: Staff[] = [
  { id: '1', name: '田中太郎', email: 'tanaka@example.com', phone: '090-1234-5678', emoji: '🙂', color: SHIFT_COLORS[0], role: 'staff', weeklyHours: 24, joinedAt: '2024-01-15' },
  { id: '2', name: '山田花子', email: 'yamada@example.com', emoji: '😊', color: SHIFT_COLORS[1], role: 'staff', weeklyHours: 32, joinedAt: '2024-02-01' },
  { id: '3', name: '佐藤一郎', phone: '080-8765-4321', emoji: '😄', color: SHIFT_COLORS[2], role: 'staff', weeklyHours: 20, joinedAt: '2024-01-20' },
  { id: '4', name: '鈴木美咲', email: 'suzuki@example.com', emoji: '🤗', color: SHIFT_COLORS[3], role: 'manager', weeklyHours: 40, joinedAt: '2023-12-01' },
  { id: '5', name: '高橋健二', emoji: '😎', color: SHIFT_COLORS[4], role: 'staff', weeklyHours: 16, joinedAt: '2024-02-10' },
];

export default function ManagerStaffPage() {
  const [staff] = useState<Staff[]>(mockStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (staffMember: Staff) => {
    toast.success(`${staffMember.name}さんを削除しました`);
    setShowDetail(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">スタッフ管理</h1>
            <p className="text-sm text-gray-400">{staff.length}名のスタッフ</p>
          </div>
          <Button
            onClick={() => setShowInvite(true)}
            className="rounded-xl bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            招待
          </Button>
        </header>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="スタッフを検索..."
            className="h-12 pl-12 rounded-xl border-gray-200"
          />
        </div>

        {/* Staff List */}
        <div className="space-y-3">
          {filteredStaff.map((staffMember) => (
            <button
              key={staffMember.id}
              onClick={() => {
                setSelectedStaff(staffMember);
                setShowDetail(true);
              }}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${staffMember.color}20` }}
                >
                  {staffMember.emoji}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{staffMember.name}</span>
                    {staffMember.role === 'manager' && (
                      <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                        管理者
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>週{staffMember.weeklyHours}時間</span>
                  </div>
                </div>
              </div>
              <MoreVertical className="h-5 w-5 text-gray-300" />
            </button>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>スタッフが見つかりません</p>
          </div>
        )}
      </div>

      {/* Staff Detail Sheet */}
      <Sheet open={showDetail} onOpenChange={setShowDetail}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          {selectedStaff && (
            <>
              <SheetHeader className="text-center pb-4">
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-3"
                  style={{ backgroundColor: `${selectedStaff.color}20` }}
                >
                  {selectedStaff.emoji}
                </div>
                <SheetTitle className="text-2xl font-bold">
                  {selectedStaff.name}
                </SheetTitle>
                {selectedStaff.role === 'manager' && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    管理者
                  </span>
                )}
              </SheetHeader>

              <div className="space-y-3 py-4">
                {selectedStaff.email && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedStaff.email}</span>
                  </div>
                )}
                {selectedStaff.phone && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{selectedStaff.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">週{selectedStaff.weeklyHours}時間勤務</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  編集
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => handleDelete(selectedStaff)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Invite Drawer */}
      <Drawer open={showInvite} onOpenChange={setShowInvite}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">
              スタッフを招待
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4">
            {/* QR Code */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 mb-4 flex flex-col items-center">
              <QrCode className="h-32 w-32 text-gray-300 mb-4" />
              <p className="text-sm text-gray-400">このQRコードをスキャン</p>
            </div>

            {/* Invite Code */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="text-xs text-gray-400 mb-2">招待コード</div>
              <div className="text-3xl font-bold text-gray-800 tracking-widest text-center">
                ABC123
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl"
              onClick={() => {
                navigator.clipboard.writeText('https://shift-sync.vercel.app/join/ABC123');
                toast.success('リンクをコピーしました');
              }}
            >
              招待リンクをコピー
            </Button>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full h-12">
                閉じる
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
