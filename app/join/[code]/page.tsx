'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, User, ArrowRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type JoinStep = 'welcome' | 'name' | 'complete';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const [step, setStep] = useState<JoinStep>('welcome');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock store data (would come from API in real app)
  const storeData = {
    name: '渋谷カフェ店',
    managerName: '鈴木さん',
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      toast.error('名前を入力してください');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    
    setIsLoading(false);
    setStep('complete');
  };

  const handleComplete = () => {
    toast.success('登録が完了しました！');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Welcome Step */}
      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Store className="h-10 w-10 text-blue-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {storeData.name}
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {storeData.managerName}からの招待です
          </p>

          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-sm mb-8">
            <h2 className="font-bold text-gray-800 mb-4">ShiftSyncでできること</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-blue-500" />
                </div>
                シフト希望をスマホから入力
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-blue-500" />
                </div>
                確定シフトをすぐに確認
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-blue-500" />
                </div>
                シフト変更の通知を受け取る
              </li>
            </ul>
          </div>

          <Button
            onClick={() => setStep('name')}
            className="w-full max-w-sm h-14 text-lg font-bold rounded-2xl bg-blue-500 hover:bg-blue-600"
          >
            参加する
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>

          <p className="text-xs text-gray-400 text-center mt-4">
            招待コード: {code}
          </p>
        </div>
      )}

      {/* Name Step */}
      {step === 'name' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            あなたの名前
          </h1>
          <p className="text-gray-400 text-center mb-8">
            シフト表に表示される名前を入力してください
          </p>

          <div className="w-full max-w-sm mb-8">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：山田太郎"
              className="h-14 text-lg text-center rounded-xl border-gray-200"
              autoFocus
            />
          </div>

          <Button
            onClick={handleJoin}
            disabled={!name.trim() || isLoading}
            className="w-full max-w-sm h-14 text-lg font-bold rounded-2xl bg-green-500 hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                登録中...
              </div>
            ) : (
              <>
                登録する
                <Check className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          <button
            onClick={() => setStep('welcome')}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600"
          >
            戻る
          </button>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-500 to-emerald-500 text-white animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Check className="h-12 w-12 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2">
            登録完了！
          </h1>
          <p className="text-green-100 text-center mb-8">
            {name}さん、ようこそ！<br />
            {storeData.name}に参加しました
          </p>

          <Button
            onClick={handleComplete}
            className="w-full max-w-sm h-14 text-lg font-bold rounded-2xl bg-white text-green-600 hover:bg-green-50"
          >
            シフトを見る
          </Button>
        </div>
      )}
    </div>
  );
}
