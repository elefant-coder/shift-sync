'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo: just redirect
    setTimeout(() => {
      toast.success('ログインしました');
      router.push('/');
    }, 1000);
  };

  const handleLineLogin = () => {
    setIsLoading(true);
    // In production, this would use LIFF
    toast.info('LINE認証を開始します...');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12 flex flex-col">
      {/* Logo & Title */}
      <div className="text-center mb-12 mt-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-blue-500/30">
          <span className="text-4xl">📅</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">ShiftSync</h1>
        <p className="text-gray-400 mt-2">シフト管理をシンプルに</p>
      </div>

      {/* LINE Login Button */}
      <button
        onClick={handleLineLogin}
        disabled={isLoading}
        className="w-full py-4 bg-[#06C755] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-500/30 mb-6 disabled:opacity-50"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 5.82 2 10.5c0 3.47 2.61 6.42 6.29 7.59-.07.52-.45 1.9-.51 2.2-.09.38.14.37.3.27.12-.08 1.89-1.28 2.65-1.8.41.05.83.08 1.27.08 5.52 0 10-3.82 10-8.5S17.52 2 12 2z"/>
        </svg>
        LINEでログイン
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-sm text-gray-300">または</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder:text-gray-300"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder:text-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ログイン
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      {/* Links */}
      <div className="text-center space-y-3">
        <button className="text-blue-500 text-sm font-medium">
          パスワードを忘れた場合
        </button>
        <div className="text-gray-400 text-sm">
          アカウントをお持ちでない方は
          <button className="text-blue-500 font-medium ml-1">
            新規登録
          </button>
        </div>
      </div>

      {/* Demo Mode */}
      <div className="mt-auto pt-8">
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 text-gray-400 text-sm font-medium"
        >
          デモモードで試す →
        </button>
      </div>
    </div>
  );
}
