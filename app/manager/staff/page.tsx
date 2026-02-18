'use client';

import { useState } from 'react';
import { Search, Plus, ChevronRight, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockStaff = [
  { id: '1', name: '田中 太郎', emoji: '🙂', role: 'アルバイト', hours: 52, wage: 1200, status: 'active' },
  { id: '2', name: '山田 花子', emoji: '😊', role: 'アルバイト', hours: 40, wage: 1100, status: 'active' },
  { id: '3', name: '佐藤 次郎', emoji: '😄', role: 'アルバイト', hours: 36, wage: 1150, status: 'active' },
  { id: '4', name: '鈴木 美咲', emoji: '🤗', role: '社員', hours: 160, wage: 1500, status: 'active' },
  { id: '5', name: '高橋 健太', emoji: '😎', role: 'アルバイト', hours: 24, wage: 1100, status: 'inactive' },
];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  
  const filteredStaff = mockStaff.filter(s => 
    s.name.includes(searchQuery) || s.role.includes(searchQuery)
  );

  const staff = selectedStaff ? mockStaff.find(s => s.id === selectedStaff) : null;

  if (staff) {
    return (
      <div className="p-6">
        {/* Back Button */}
        <button 
          onClick={() => setSelectedStaff(null)}
          className="text-blue-500 font-medium mb-6"
        >
          ← 戻る
        </button>

        {/* Staff Detail */}
        <div className="bg-white rounded-3xl p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl mx-auto mb-4">
            {staff.emoji}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{staff.name}</h2>
          <p className="text-gray-400 text-sm">{staff.role}</p>
          
          <div className="flex gap-3 mt-6">
            <button className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              メール
            </button>
            <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              電話
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4">
            <div className="text-2xl font-bold text-gray-800">{staff.hours}h</div>
            <div className="text-xs text-gray-400">今月の勤務</div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <div className="text-2xl font-bold text-gray-800">¥{staff.wage.toLocaleString()}</div>
            <div className="text-xs text-gray-400">時給</div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <div className="text-2xl font-bold text-blue-500">12</div>
            <div className="text-xs text-gray-400">今月シフト数</div>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <div className="text-2xl font-bold text-green-500">98%</div>
            <div className="text-xs text-gray-400">出勤率</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full p-4 bg-white rounded-2xl text-left flex items-center justify-between">
            <span className="font-medium text-gray-700">シフト履歴</span>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
          <button className="w-full p-4 bg-white rounded-2xl text-left flex items-center justify-between">
            <span className="font-medium text-gray-700">スキル編集</span>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
          <button className="w-full p-4 bg-white rounded-2xl text-left flex items-center justify-between">
            <span className="font-medium text-gray-700">時給変更</span>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">スタッフ</h2>
        <button className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/30">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
        <input
          type="text"
          placeholder="名前で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Staff Count */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-400">{filteredStaff.length}名のスタッフ</span>
      </div>

      {/* Staff List */}
      <div className="space-y-3">
        {filteredStaff.map((staff) => (
          <button
            key={staff.id}
            onClick={() => setSelectedStaff(staff.id)}
            className={cn(
              'w-full flex items-center justify-between p-4 bg-white rounded-2xl transition-all touch-active',
              staff.status === 'inactive' && 'opacity-50'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{staff.emoji}</span>
              <div className="text-left">
                <div className="font-medium text-gray-800">{staff.name}</div>
                <div className="text-xs text-gray-400">{staff.role} • {staff.hours}h/月</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
