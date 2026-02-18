import { create } from 'zustand';
import { startOfMonth, startOfWeek, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from 'date-fns';

export type CalendarView = 'month' | 'week' | 'day';

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string;
  store?: string;
  status?: 'confirmed' | 'pending' | 'requested';
}

export interface ShiftRequest {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  recurring?: {
    type: 'weekly' | 'biweekly';
    days: number[]; // 0-6 (Sunday-Saturday)
    until?: string;
  };
}

interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  selectedDates: Date[]; // for multi-select
  view: CalendarView;
  shifts: Shift[];
  shiftRequests: ShiftRequest[];
  
  // Actions
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  toggleDateSelection: (date: Date) => void;
  clearSelectedDates: () => void;
  setView: (view: CalendarView) => void;
  
  // Navigation
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  
  // Shifts
  setShifts: (shifts: Shift[]) => void;
  addShift: (shift: Shift) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  removeShift: (id: string) => void;
  
  // Requests
  addShiftRequest: (request: ShiftRequest) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: new Date(),
  selectedDate: null,
  selectedDates: [],
  view: 'month',
  shifts: [],
  shiftRequests: [],
  
  setCurrentDate: (date) => set({ currentDate: date }),
  setSelectedDate: (date) => set({ selectedDate: date, selectedDates: date ? [date] : [] }),
  
  toggleDateSelection: (date) => set((state) => {
    const dateStr = date.toISOString().split('T')[0];
    const exists = state.selectedDates.some(d => d.toISOString().split('T')[0] === dateStr);
    
    if (exists) {
      return { selectedDates: state.selectedDates.filter(d => d.toISOString().split('T')[0] !== dateStr) };
    }
    return { selectedDates: [...state.selectedDates, date] };
  }),
  
  clearSelectedDates: () => set({ selectedDates: [], selectedDate: null }),
  
  setView: (view) => set({ view }),
  
  goToToday: () => set({ currentDate: new Date(), selectedDate: new Date() }),
  
  goToPrevious: () => set((state) => {
    switch (state.view) {
      case 'month': return { currentDate: subMonths(state.currentDate, 1) };
      case 'week': return { currentDate: subWeeks(state.currentDate, 1) };
      case 'day': return { currentDate: subDays(state.currentDate, 1), selectedDate: subDays(state.currentDate, 1) };
    }
  }),
  
  goToNext: () => set((state) => {
    switch (state.view) {
      case 'month': return { currentDate: addMonths(state.currentDate, 1) };
      case 'week': return { currentDate: addWeeks(state.currentDate, 1) };
      case 'day': return { currentDate: addDays(state.currentDate, 1), selectedDate: addDays(state.currentDate, 1) };
    }
  }),
  
  setShifts: (shifts) => set({ shifts }),
  addShift: (shift) => set((state) => ({ shifts: [...state.shifts, shift] })),
  updateShift: (id, update) => set((state) => ({
    shifts: state.shifts.map(s => s.id === id ? { ...s, ...update } : s)
  })),
  removeShift: (id) => set((state) => ({
    shifts: state.shifts.filter(s => s.id !== id)
  })),
  
  addShiftRequest: (request) => set((state) => ({
    shiftRequests: [...state.shiftRequests, request]
  })),
}));

// Preset colors for shifts
export const SHIFT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];
