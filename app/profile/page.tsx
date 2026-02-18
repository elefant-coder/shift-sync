'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  User,
  Settings,
  Clock,
  Calendar,
  DollarSign,
  ChevronRight,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  Building,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// サンプルユーザーデータ
const mockUser = {
  id: '1',
  name: '田中 花子',
  email: 'tanaka@example.com',
  avatarUrl: null,
  role: 'staff',
  employmentType: 'part_time',
  hourlyWage: 1200,
  stores: ['渋谷店', '新宿店'],
  joinedAt: '2025-04-01',
  skills: ['ホール', 'キッチン', 'レジ'],
};

// 今月の実績
const mockStats = {
  shifts: 16,
  hours: 72,
  earnings: 86400,
  rating: 4.8,
};

export default function ProfilePage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* プロフィールカード */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mockUser.avatarUrl || undefined} />
              <AvatarFallback className="text-xl bg-primary text-white">
                {mockUser.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-bold text-xl">{mockUser.name}</h2>
              <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {mockUser.employmentType === 'part_time' ? 'パート' : '正社員'}
                </Badge>
                <Badge variant="outline">¥{mockUser.hourlyWage}/時</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 今月の実績 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            今月の実績
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                {mockStats.shifts}
              </div>
              <div className="text-xs text-muted-foreground">シフト回数</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                {mockStats.hours}h
              </div>
              <div className="text-xs text-muted-foreground">勤務時間</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                ¥{mockStats.earnings.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">獲得給与</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                {mockStats.rating}
              </div>
              <div className="text-xs text-muted-foreground">評価</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 所属店舗 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building className="h-4 w-4" />
            所属店舗
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockUser.stores.map((store) => (
            <div
              key={store}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <span className="font-medium">{store}</span>
              <Badge variant="outline">メイン</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* スキル */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">保有スキル</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockUser.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 設定メニュー */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span>プッシュ通知</span>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <span>ダークモード</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span>アカウント設定</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span>ヘルプ・お問い合わせ</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ログアウト */}
      <Button variant="outline" className="w-full" size="lg">
        <LogOut className="mr-2 h-4 w-4" />
        ログアウト
      </Button>

      {/* バージョン情報 */}
      <p className="text-center text-xs text-muted-foreground">
        ShiftSync v1.0.0
        <br />
        入社日: {format(new Date(mockUser.joinedAt), 'yyyy年M月d日', { locale: ja })}
      </p>
    </div>
  );
}
