
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface FormValues {
  firstName: string;
  lastName: string;
  birthDate: Date;
  accessCode: string;
}

interface DatePickerFieldProps {
  control: Control<FormValues>;
  loading: boolean;
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  control, 
  loading, 
  calendarDate, 
  setCalendarDate 
}) => {
  // Générer la liste des années (de 1900 à année actuelle)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  // Liste des mois
  const months = [
    { value: 0, label: "Janvier" },
    { value: 1, label: "Février" },
    { value: 2, label: "Mars" },
    { value: 3, label: "Avril" },
    { value: 4, label: "Mai" },
    { value: 5, label: "Juin" },
    { value: 6, label: "Juillet" },
    { value: 7, label: "Août" },
    { value: 8, label: "Septembre" },
    { value: 9, label: "Octobre" },
    { value: 10, label: "Novembre" },
    { value: 11, label: "Décembre" }
  ];

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(Number(monthIndex));
    setCalendarDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(Number(year));
    setCalendarDate(newDate);
  };

  const decrementMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCalendarDate(newDate);
  };

  const incrementMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCalendarDate(newDate);
  };

  return (
    <FormField
      control={control}
      name="birthDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date de naissance</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  {field.value ? (
                    format(field.value, "P", { locale: fr })
                  ) : (
                    <span>Sélectionnez une date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex items-center justify-between px-2 py-2 bg-muted/20 border-b">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={decrementMonth}
                  disabled={loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Select
                    value={calendarDate.getMonth().toString()}
                    onValueChange={handleMonthChange}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-7 w-[110px]">
                      <SelectValue placeholder="Mois" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
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
                    disabled={loading}
                  >
                    <SelectTrigger className="h-7 w-[75px]">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent className="h-56 overflow-y-auto bg-white z-50">
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
                  disabled={loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || loading}
                initialFocus
                month={calendarDate}
                onMonthChange={setCalendarDate}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
