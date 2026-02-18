// ユーザーの役職
export type UserRole = 'admin' | 'manager' | 'staff';

// 雇用形態
export type EmploymentType = 'full_time' | 'part_time' | 'contract';

// シフトステータス
export type ShiftStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

// 時間帯プリセット
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night' | 'full';

// シフト変更リクエストタイプ
export type ChangeRequestType = 'swap' | 'drop' | 'pickup';

// シフト変更リクエストステータス
export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected';

// ユーザー
export interface User {
  id: string;
  email?: string;
  lineUserId?: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  employmentType: EmploymentType;
  hourlyWage?: number;
  skills: string[];
  storeIds: string[];
  createdAt: string;
}

// 店舗
export interface Store {
  id: string;
  companyId: string;
  name: string;
  address?: string;
  businessHours: {
    [day: string]: { open: string; close: string };
  };
  staffRequirements: {
    [timeSlot: string]: number;
  };
}

// シフト
export interface Shift {
  id: string;
  storeId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakMinutes: number;
  position?: string;
  status: ShiftStatus;
  user?: User;
}

// シフト希望
export interface ShiftRequest {
  id: string;
  userId: string;
  storeId: string;
  weekStart: string; // YYYY-MM-DD
  preferences: {
    [date: string]: {
      available: boolean;
      preferredTime?: TimeSlot;
      note?: string;
    };
  };
  desiredHours: number;
  submittedAt: string;
}

// シフト変更リクエスト
export interface ShiftChangeRequest {
  id: string;
  shiftId: string;
  requesterId: string;
  replacementId?: string;
  type: ChangeRequestType;
  status: ChangeRequestStatus;
  message?: string;
  createdAt: string;
}

// 日別シフトサマリー
export interface DailyShiftSummary {
  date: string;
  shifts: Shift[];
  requiredStaff: number;
  actualStaff: number;
  isSufficient: boolean;
}

// 週間シフト
export interface WeeklySchedule {
  weekStart: string;
  weekEnd: string;
  days: DailyShiftSummary[];
  totalHours: number;
  totalCost: number;
}

// 時間帯の表示名
export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '朝（9:00-14:00）',
  afternoon: '昼（14:00-18:00）',
  evening: '夜（18:00-23:00）',
  night: '深夜（23:00-）',
  full: '終日OK'
};

// 曜日
export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 曜日（英語）
export const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
