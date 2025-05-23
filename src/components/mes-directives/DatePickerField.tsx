
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendarState } from "@/hooks/useCalendarState";

interface DatePickerFieldProps {
  birthdate: Date | undefined;
  setBirthdate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const DatePickerField = ({ birthdate, setBirthdate, disabled = false }: DatePickerFieldProps) => {
  const {
    calendarDate,
    months,
    years,
    handleMonthChange,
    handleYearChange,
    decrementMonth,
    incrementMonth
  } = useCalendarState();

  return (
    <div className="space-y-1">
      <label htmlFor="birthdate" className="text-sm font-medium">
        Date de naissance
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !birthdate && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {birthdate ? (
              format(birthdate, "P", { locale: fr })
            ) : (
              <span>Sélectionnez une date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 flex items-center justify-between bg-muted/20">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={decrementMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Select
                value={calendarDate.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-7 w-[100px]">
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
                value={calendarDate.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-7 w-[100px]">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
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
              onClick={incrementMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={birthdate}
            onSelect={setBirthdate}
            disabled={(date) => date > new Date() || disabled}
            initialFocus
            month={calendarDate}
            onMonthChange={date => calendarDate.setMonth(date.getMonth())}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
