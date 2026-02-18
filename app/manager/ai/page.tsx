'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Sparkles, ChevronRight, Check, AlertTriangle, Users, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'select' | 'generating' | 'preview' | 'done';

const mockGenerated = [
  { date: '2025-02-24', staff: ['田中', '山田'], morning: true, evening: false },
  { date: '2025-02-25', staff: ['佐藤', '鈴木'], morning: true, evening: true },
  { date: '2025-02-26', staff: ['高橋', '田中'], morning: false, evening: true },
  { date: '2025-02-27', staff: ['山田', '佐藤', '鈴木'], morning: true, evening: true },
  { date: '2025-02-28', staff: ['田中', '高橋'], morning: true, evening: false },
];

export default function AIPage() {
  const [step, setStep] = useState<Step>('select');
  const [progress, setProgress] = useState(0);
  
  const nextWeek = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });

  const handleGenerate = () => {
    setStep('generating');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('preview');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleConfirm = () => {
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">シフト確定！</h2>
        <p className="text-gray-400 text-center mb-8">
          スタッフに通知が送信されました
        </p>
        <button
          onClick={() => setStep('select')}
          className="px-8 py-3 bg-gray-100 rounded-full text-gray-600 font-medium"
        >
          戻る
        </button>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 animate-pulse">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">AI生成中...</h2>
        <p className="text-gray-400 text-center mb-8">
          最適なシフトを計算しています
        </p>
        
        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-gray-100 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-400">{progress}%</span>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI生成結果</h2>
            <p className="text-xs text-gray-400">確認して確定してください</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-500">100%</div>
            <div className="text-[10px] text-gray-400">必要人員充足</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">均等</div>
            <div className="text-[10px] text-gray-400">シフト配分</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">92%</div>
            <div className="text-[10px] text-gray-400">希望反映率</div>
          </div>
        </div>

        {/* Generated Shifts */}
        <div className="space-y-3 mb-8">
          {mockGenerated.map((day) => (
            <div key={day.date} className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">
                  {format(new Date(day.date), 'M/d（E）', { locale: ja })}
                </span>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                  {day.staff.length}名
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {day.staff.map((name) => (
                  <span key={name} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg"
          >
            このシフトで確定
          </button>
          <button
            onClick={() => setStep('select')}
            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-medium"
          >
            やり直す
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">AI自動作成</h2>
        <p className="text-gray-400 text-sm mt-1">希望を元に最適なシフトを生成</p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4 mb-8">
        <div className="bg-white rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">希望を最大限反映</h3>
            <p className="text-sm text-gray-400">スタッフの希望を優先しながらシフトを作成</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">必要人員を確保</h3>
            <p className="text-sm text-gray-400">時間帯ごとの必要人数を必ず満たす</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">公平な配分</h3>
            <p className="text-sm text-gray-400">勤務時間が偏らないよう自動調整</p>
          </div>
        </div>
      </div>

      {/* Week Selection */}
      <div className="bg-white rounded-2xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">対象期間</div>
            <div className="font-bold text-gray-800">
              {format(nextWeek, 'M/d', { locale: ja })} - {format(addDays(nextWeek, 6), 'M/d', { locale: ja })}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </div>
      </div>

      {/* Status */}
      <div className="bg-yellow-50 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-yellow-800 text-sm">3名が未提出</div>
          <div className="text-xs text-yellow-600 mt-0.5">高橋、佐藤、鈴木さんの希望がまだです</div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
      >
        <Sparkles className="h-5 w-5" />
        AIでシフトを生成
      </button>
    </div>
  );
}
