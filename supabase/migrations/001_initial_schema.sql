-- ShiftSync Database Schema
-- ジョブズレベルのシンプルさを実現するためのデータベース設計

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STORES (店舗)
-- ============================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  business_hours JSONB DEFAULT '{}',
  -- 各時間帯の必要人数
  staff_requirements JSONB DEFAULT '{"morning": 2, "afternoon": 2, "evening": 3, "night": 1}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. USERS (ユーザー)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  line_user_id TEXT UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  employment_type TEXT DEFAULT 'part_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract')),
  hourly_wage INTEGER DEFAULT 1000,
  skills TEXT[] DEFAULT '{}',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. USER_STORES (ユーザーと店舗の関連)
-- ============================================
CREATE TABLE user_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);

-- ============================================
-- 4. SHIFTS (確定シフト)
-- ============================================
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_minutes INTEGER DEFAULT 0,
  position TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX idx_shifts_date ON shifts(date);
CREATE INDEX idx_shifts_user ON shifts(user_id);
CREATE INDEX idx_shifts_store ON shifts(store_id);
CREATE INDEX idx_shifts_store_date ON shifts(store_id, date);

-- ============================================
-- 5. SHIFT_REQUESTS (シフト希望)
-- ============================================
CREATE TABLE shift_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  -- 各日の希望: { "2024-01-15": { "available": true, "preferred_time": "morning", "note": "" } }
  preferences JSONB NOT NULL DEFAULT '{}',
  desired_hours INTEGER DEFAULT 20,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, store_id, week_start)
);

CREATE INDEX idx_shift_requests_week ON shift_requests(week_start);

-- ============================================
-- 6. ATTENDANCES (勤怠)
-- ============================================
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  actual_break_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'clocked_in', 'clocked_out', 'approved')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attendances_date ON attendances(date);
CREATE INDEX idx_attendances_user ON attendances(user_id);

-- ============================================
-- 7. SHIFT_SWAPS (シフト交代リクエスト)
-- ============================================
CREATE TABLE shift_swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT DEFAULT 'swap' CHECK (type IN ('swap', 'drop', 'pickup')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- ============================================
-- 8. NOTIFICATIONS (通知)
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can view shifts for their stores
CREATE POLICY "Users can view shifts in their stores" ON shifts
  FOR SELECT USING (
    store_id IN (SELECT store_id FROM user_stores WHERE user_id = auth.uid())
  );

-- Users can view their own shift requests
CREATE POLICY "Users can view own requests" ON shift_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own requests" ON shift_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Managers can manage shifts
CREATE POLICY "Managers can manage shifts" ON shifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- ============================================
-- Functions
-- ============================================

-- 勤務時間計算
CREATE OR REPLACE FUNCTION calculate_work_hours(shift_row shifts)
RETURNS NUMERIC AS $$
BEGIN
  RETURN EXTRACT(EPOCH FROM (shift_row.end_time - shift_row.start_time)) / 3600 
         - (shift_row.break_minutes::NUMERIC / 60);
END;
$$ LANGUAGE plpgsql;

-- 週間勤務時間合計
CREATE OR REPLACE FUNCTION get_weekly_hours(p_user_id UUID, p_week_start DATE)
RETURNS NUMERIC AS $$
DECLARE
  total_hours NUMERIC;
BEGIN
  SELECT COALESCE(SUM(
    EXTRACT(EPOCH FROM (end_time - start_time)) / 3600 - (break_minutes::NUMERIC / 60)
  ), 0)
  INTO total_hours
  FROM shifts
  WHERE user_id = p_user_id
    AND date >= p_week_start
    AND date < p_week_start + INTERVAL '7 days'
    AND status != 'cancelled';
  
  RETURN total_hours;
END;
$$ LANGUAGE plpgsql;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_attendances_updated_at
  BEFORE UPDATE ON attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
