// Supabase Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          business_hours: Json;
          staff_requirements: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          business_hours?: Json;
          staff_requirements?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          business_hours?: Json;
          staff_requirements?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string | null;
          line_user_id: string | null;
          name: string;
          avatar_url: string | null;
          role: 'admin' | 'manager' | 'staff';
          employment_type: 'full_time' | 'part_time' | 'contract';
          hourly_wage: number;
          skills: string[];
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          line_user_id?: string | null;
          name: string;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'staff';
          employment_type?: 'full_time' | 'part_time' | 'contract';
          hourly_wage?: number;
          skills?: string[];
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          line_user_id?: string | null;
          name?: string;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'staff';
          employment_type?: 'full_time' | 'part_time' | 'contract';
          hourly_wage?: number;
          skills?: string[];
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_stores: {
        Row: {
          id: string;
          user_id: string;
          store_id: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_id: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_id?: string;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      shifts: {
        Row: {
          id: string;
          store_id: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time: string;
          break_minutes: number;
          position: string | null;
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time: string;
          break_minutes?: number;
          position?: string | null;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          user_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          break_minutes?: number;
          position?: string | null;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shift_requests: {
        Row: {
          id: string;
          user_id: string;
          store_id: string;
          week_start: string;
          preferences: Json;
          desired_hours: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_id: string;
          week_start: string;
          preferences?: Json;
          desired_hours?: number;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_id?: string;
          week_start?: string;
          preferences?: Json;
          desired_hours?: number;
          submitted_at?: string;
        };
      };
      attendances: {
        Row: {
          id: string;
          shift_id: string | null;
          user_id: string;
          store_id: string;
          date: string;
          clock_in: string | null;
          clock_out: string | null;
          actual_break_minutes: number;
          status: 'pending' | 'clocked_in' | 'clocked_out' | 'approved';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shift_id?: string | null;
          user_id: string;
          store_id: string;
          date: string;
          clock_in?: string | null;
          clock_out?: string | null;
          actual_break_minutes?: number;
          status?: 'pending' | 'clocked_in' | 'clocked_out' | 'approved';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shift_id?: string | null;
          user_id?: string;
          store_id?: string;
          date?: string;
          clock_in?: string | null;
          clock_out?: string | null;
          actual_break_minutes?: number;
          status?: 'pending' | 'clocked_in' | 'clocked_out' | 'approved';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shift_swaps: {
        Row: {
          id: string;
          shift_id: string;
          requester_id: string;
          accepter_id: string | null;
          type: 'swap' | 'drop' | 'pickup';
          status: 'pending' | 'approved' | 'rejected' | 'cancelled';
          message: string | null;
          created_at: string;
          responded_at: string | null;
        };
        Insert: {
          id?: string;
          shift_id: string;
          requester_id: string;
          accepter_id?: string | null;
          type?: 'swap' | 'drop' | 'pickup';
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          message?: string | null;
          created_at?: string;
          responded_at?: string | null;
        };
        Update: {
          id?: string;
          shift_id?: string;
          requester_id?: string;
          accepter_id?: string | null;
          type?: 'swap' | 'drop' | 'pickup';
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          message?: string | null;
          created_at?: string;
          responded_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string | null;
          data: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message?: string | null;
          data?: Json;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string | null;
          data?: Json;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      get_weekly_hours: {
        Args: { p_user_id: string; p_week_start: string };
        Returns: number;
      };
    };
    Enums: {};
  };
}

// Utility types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
