'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid, List } from 'lucide-react';
import { useCalendarStore, CalendarView } from '@/lib/stores/calendar-store';
import { cn } from '@/lib/utils';

interface ViewButton {
  view: CalendarView;
  icon: React.ReactNode;
  label: string;
}

const viewButtons: ViewButton[] = [
  { view: 'month', icon: <LayoutGrid className="h-4 w-4" />, label: '月' },
  { view: 'week', icon: <Calendar className="h-4 w-4" />, label: '週' },
  { view: 'day', icon: <List className="h-4 w-4" />, label: '日' },
];

export function CalendarHeader() {
  const { currentDate, view, setView, goToPrevious, goToNext, goToToday } = useCalendarStore();

  const getTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'yyyy年M月', { locale: ja });
      case 'week':
        return format(currentDate, 'yyyy年M月', { locale: ja });
      case 'day':
        return format(currentDate, 'M月d日（E）', { locale: ja });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Title and Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            今日
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevious}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* View Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        {viewButtons.map(({ view: v, icon, label }) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all',
              view === v
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
