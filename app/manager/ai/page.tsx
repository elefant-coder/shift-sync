'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Settings2, 
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AIPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const defaultPreferences: AIPreference[] = [
  {
    id: 'fairness',
    label: '公平なシフト配分',
    description: 'スタッフ間で勤務時間を均等に',
    enabled: true,
  },
  {
    id: 'consecutive',
    label: '連勤を避ける',
    description: '5日以上の連続勤務を回避',
    enabled: true,
  },
  {
    id: 'preferences',
    label: '希望を優先',
    description: 'スタッフの希望時間を最大限考慮',
    enabled: true,
  },
  {
    id: 'experience',
    label: '経験者を配置',
    description: 'ベテランと新人のバランスを確保',
    enabled: false,
  },
];

type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error';

export default function ManagerAIPage() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);

  const togglePreference = (id: string) => {
    setPreferences(prev =>
      prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    );
  };

  const generateShifts = async () => {
    setStatus('generating');
    setProgress(0);

    // Simulate AI generation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 300));
      setProgress(i);
    }

    setStatus('complete');
    toast.success('シフトを自動生成しました！');
  };

  const resetGeneration = () => {
    setStatus('idle');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-12 pb-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI自動作成</h1>
              <p className="text-sm text-gray-400">AIが最適なシフトを提案</p>
            </div>
          </div>
        </header>

        {/* Status Card */}
        <div className={cn(
          'rounded-2xl p-6 mb-6 transition-all',
          status === 'idle' && 'bg-white shadow-sm',
          status === 'generating' && 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
          status === 'complete' && 'bg-gradient-to-br from-green-500 to-emerald-500 text-white',
          status === 'error' && 'bg-red-500 text-white'
        )}>
          {status === 'idle' && (
            <div className="text-center py-4">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                AIシフト作成
              </h2>
              <p className="text-gray-400 text-sm">
                スタッフの希望と店舗の条件から<br />
                最適なシフトを自動で作成します
              </p>
            </div>
          )}

          {status === 'generating' && (
            <div className="text-center py-4">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-bold mb-2">
                シフトを生成中...
              </h2>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-white/80 text-sm">{progress}%</p>
            </div>
          )}

          {status === 'complete' && (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">
                生成完了！
              </h2>
              <p className="text-white/80 text-sm mb-4">
                来週のシフトが作成されました
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={resetGeneration}
                >
                  再生成
                </Button>
                <Button
                  className="flex-1 bg-white text-green-600 hover:bg-white/90"
                >
                  確認する
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* AI Stats Preview */}
        {status === 'complete' && (
          <div className="grid grid-cols-3 gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <Users className="h-5 w-5 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-800">5</div>
              <div className="text-[10px] text-gray-400">配置スタッフ</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <Clock className="h-5 w-5 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-800">98%</div>
              <div className="text-[10px] text-gray-400">希望一致率</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-800">100%</div>
              <div className="text-[10px] text-gray-400">人員充足率</div>
            </div>
          </div>
        )}

        {/* Preferences */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="h-5 w-5 text-gray-400" />
            <h2 className="font-bold text-gray-800">AI設定</h2>
          </div>

          <div className="space-y-4">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-700 text-sm">
                    {pref.label}
                  </div>
                  <div className="text-xs text-gray-400">
                    {pref.description}
                  </div>
                </div>
                <Switch
                  checked={pref.enabled}
                  onCheckedChange={() => togglePreference(pref.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-blue-700 text-sm mb-1">
                AIのヒント
              </div>
              <p className="text-xs text-blue-600">
                スタッフの希望が多いほど、AIの予測精度が上がります。
                まずはスタッフにシフト希望を入力してもらいましょう。
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {status === 'idle' && (
          <Button
            onClick={generateShifts}
            className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Play className="h-5 w-5 mr-2" />
            シフトを自動生成
          </Button>
        )}
      </div>
    </div>
  );
}
