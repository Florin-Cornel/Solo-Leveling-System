import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { formatDate } from '../utils/dateUtils';

const DateNavigator = ({ currentDate, onPrevDay, onNextDay }) => {
  return (
    <div className="flex items-center justify-center gap-4" data-testid="date-navigator">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevDay}
        className="h-11 w-11 rounded-full hover:bg-white/10 transition-colors"
        data-testid="prev-day-btn"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-6 h-6 text-zinc-400" />
      </Button>
      
      <h1 
        className="font-heading text-2xl md:text-3xl font-bold text-white tracking-wide min-w-[280px] text-center"
        data-testid="current-date"
      >
        {formatDate(currentDate)}
      </h1>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextDay}
        className="h-11 w-11 rounded-full hover:bg-white/10 transition-colors"
        data-testid="next-day-btn"
        aria-label="Next day"
      >
        <ChevronRight className="w-6 h-6 text-zinc-400" />
      </Button>
    </div>
  );
};

export default DateNavigator;
