
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalendarHeaderProps {
  displayMonth: Date;
  months: { value: number; label: string }[];
  years: number[];
  onMonthChange: (monthIndex: string) => void;
  onYearChange: (year: string) => void;
  onMonthDecrement: () => void;
  onMonthIncrement: () => void;
  currentMonth: number;
  currentYear: number;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayMonth,
  months,
  years,
  onMonthChange,
  onYearChange,
  onMonthDecrement,
  onMonthIncrement,
  currentMonth,
  currentYear
}) => (
  <div className="flex justify-between items-center px-1 py-2">
    <Button
      variant="outline"
      size="icon"
      className="h-7 w-7"
      onClick={onMonthDecrement}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    
    <div className="flex space-x-1">
      <Select
        value={currentMonth.toString()}
        onValueChange={onMonthChange}
      >
        <SelectTrigger className="h-7 w-[110px]">
          <SelectValue placeholder="Mois" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value.toString()}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentYear.toString()}
        onValueChange={onYearChange}
      >
        <SelectTrigger className="h-7 w-[75px]">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent className="h-56 overflow-y-auto">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <Button
      variant="outline"
      size="icon"
      className="h-7 w-7"
      onClick={onMonthIncrement}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

export default CalendarHeader;
