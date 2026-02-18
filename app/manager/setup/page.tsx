'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  Clock, 
  Users, 
  QrCode, 
  Link as LinkIcon,
  ChevronRight,
  Check,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SetupStep = 'store' | 'hours' | 'staff' | 'invite' | 'complete';

const steps: { id: SetupStep; title: string; icon: React.ReactNode }[] = [
  { id: 'store', title: '店舗情報', icon: <Store className="h-5 w-5" /> },
  { id: 'hours', title: '営業時間', icon: <Clock className="h-5 w-5" /> },
  { id: 'staff', title: '必要人員', icon: <Users className="h-5 w-5" /> },
  { id: 'invite', title: 'スタッフ招待', icon: <QrCode className="h-5 w-5" /> },
];

export default function ManagerSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SetupStep>('store');
  const [storeData, setStoreData] = useState({
    name: '',
    openTime: '09:00',
    closeTime: '22:00',
    minStaff: 2,
    maxStaff: 5,
  });
  const [inviteCode] = useState('ABC123');
  const inviteUrl = `https://shift-sync.vercel.app/join/${inviteCode}`;

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const goToNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
      setCurrentStep('complete');
    }
  };

  const goToPrev = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('招待リンクをコピーしました');
  };

  const handleComplete = () => {
    toast.success('セットアップが完了しました！');
    router.push('/manager');
  };

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Check className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">セットアップ完了！</h1>
        <p className="text-blue-100 text-center mb-8">
          {storeData.name}の準備ができました<br />
          スタッフが参加したらシフト作成を始めましょう
        </p>
        <Button
          onClick={handleComplete}
          className="w-full max-w-sm h-14 bg-white text-blue-500 hover:bg-blue-50 font-bold text-lg rounded-2xl"
        >
          ダッシュボードへ
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  getCurrentStepIndex() >= index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                )}
              >
                {getCurrentStepIndex() > index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-0.5 mx-1',
                    getCurrentStepIndex() > index ? 'bg-blue-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[400px]">
          {/* Store Name Step */}
          {currentStep === 'store' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Store className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                店舗名を入力
              </h2>
              <p className="text-gray-400 mb-6">
                シフト管理する店舗・事業所の名前を入力してください
              </p>
              <Input
                value={storeData.name}
                onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="例：渋谷カフェ店"
                className="h-14 text-lg rounded-xl border-gray-200"
              />
            </div>
          )}

          {/* Hours Step */}
          {currentStep === 'hours' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                営業時間を設定
              </h2>
              <p className="text-gray-400 mb-6">
                シフトを組む時間帯を設定してください
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    開店時間
                  </label>
                  <select
                    value={storeData.openTime}
                    onChange={(e) => setStoreData(prev => ({ ...prev, openTime: e.target.value }))}
                    className="w-full h-14 px-4 bg-gray-50 rounded-xl text-lg"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                        {String(i).padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    閉店時間
                  </label>
                  <select
                    value={storeData.closeTime}
                    onChange={(e) => setStoreData(prev => ({ ...prev, closeTime: e.target.value }))}
                    className="w-full h-14 px-4 bg-gray-50 rounded-xl text-lg"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                        {String(i).padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Staff Step */}
          {currentStep === 'staff' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                必要人員を設定
              </h2>
              <p className="text-gray-400 mb-6">
                1日あたりの最小・最大人数を設定してください
              </p>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    最小人数: <span className="text-blue-500 font-bold">{storeData.minStaff}人</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={storeData.minStaff}
                    onChange={(e) => setStoreData(prev => ({ ...prev, minStaff: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    最大人数: <span className="text-blue-500 font-bold">{storeData.maxStaff}人</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={storeData.maxStaff}
                    onChange={(e) => setStoreData(prev => ({ ...prev, maxStaff: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invite Step */}
          {currentStep === 'invite' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                <QrCode className="h-8 w-8 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                スタッフを招待
              </h2>
              <p className="text-gray-400 mb-6">
                以下のリンクやQRコードでスタッフを招待できます
              </p>
              
              {/* Invite Code */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="text-xs text-gray-400 mb-2">招待コード</div>
                <div className="text-3xl font-bold text-gray-800 tracking-widest text-center">
                  {inviteCode}
                </div>
              </div>

              {/* Invite URL */}
              <button
                onClick={copyInviteUrl}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-700">招待リンク</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{inviteUrl}</div>
                  </div>
                </div>
                <Copy className="h-5 w-5 text-gray-400" />
              </button>

              {/* QR Code placeholder */}
              <div className="mt-4 p-8 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-20 w-20 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">QRコード</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {getCurrentStepIndex() > 0 && (
            <Button
              onClick={goToPrev}
              variant="outline"
              className="flex-1 h-14 rounded-2xl"
            >
              戻る
            </Button>
          )}
          <Button
            onClick={goToNext}
            disabled={currentStep === 'store' && !storeData.name}
            className="flex-1 h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            {getCurrentStepIndex() === steps.length - 1 ? '完了' : '次へ'}
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
