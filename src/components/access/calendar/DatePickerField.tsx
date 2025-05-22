
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCalendarState } from "@/hooks/useCalendarState";
import { formatDateForDisplay, parseManualDate } from "@/utils/dateFormatters";
import CalendarHeader from "./CalendarHeader";

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  // État pour basculer entre le mode calendrier et la saisie manuelle
  const [manualInput, setManualInput] = useState(false);
  
  const {
    calendarDate,
    setCalendarDate,
    months,
    years,
    handleMonthChange,
    handleYearChange,
    decrementMonth,
    incrementMonth
  } = useCalendarState();

  return (
    <FormItem className="space-y-2">
      <FormLabel>Date de naissance</FormLabel>
      
      <div className="flex items-center mb-1">
        <button 
          type="button" 
          onClick={() => setManualInput(!manualInput)}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          {manualInput ? "Utiliser le calendrier" : "Saisie manuelle"}
        </button>
      </div>
      
      {manualInput ? (
        <FormControl>
          <Input
            placeholder="JJ/MM/AAAA"
            value={formatDateForDisplay(value)}
            onChange={(e) => {
              const formattedDate = parseManualDate(e.target.value);
              onChange(formattedDate);
            }}
            disabled={disabled}
            className="focus:ring-2 focus:ring-directiveplus-500"
          />
        </FormControl>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full flex justify-between text-left font-normal",
                  !value && "text-muted-foreground",
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                )}
                disabled={disabled}
              >
                {value ? (
                  format(new Date(value), "dd MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
                <CalendarIcon className="h-4 w-4 opacity-50 ml-2" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-white" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
              disabled={(date) => 
                date > new Date() || 
                date < new Date("1900-01-01")
              }
              month={calendarDate}
              onMonthChange={setCalendarDate}
              initialFocus
              locale={fr}
              className={cn("p-3 pointer-events-auto")}
              components={{
                Caption: ({ displayMonth }) => (
                  <CalendarHeader 
                    displayMonth={displayMonth}
                    months={months}
                    years={years}
                    onMonthChange={handleMonthChange}
                    onYearChange={handleYearChange}
                    onMonthDecrement={decrementMonth}
                    onMonthIncrement={incrementMonth}
                    currentMonth={calendarDate.getMonth()}
                    currentYear={calendarDate.getFullYear()}
                  />
                )
              }}
            />
          </PopoverContent>
        </Popover>
      )}
      
      <FormMessage />
    </FormItem>
  );
};

export default DatePickerField;
