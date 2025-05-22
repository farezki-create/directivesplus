
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FormField from "./FormField";
import SecurityAlerts from "./SecurityAlerts";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField as HookFormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DirectivesFormFieldsProps {
  form: UseFormReturn<any>;
  loading: boolean;
  blockedAccess: boolean;
  errorMessage: string | null;
  remainingAttempts: number | null;
}

const DirectivesFormFields: React.FC<DirectivesFormFieldsProps> = ({
  form,
  loading,
  blockedAccess,
  errorMessage,
  remainingAttempts,
}) => {
  // État pour basculer entre le mode calendrier et la saisie manuelle
  const [manualInput, setManualInput] = useState(false);
  
  // État pour le mois et l'année sélectionnés dans le calendrier
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // Liste des années pour le sélecteur (de 1900 à l'année actuelle)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  // Liste des mois pour le sélecteur
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

  // Fonction pour mettre à jour le mois dans le calendrier
  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(Number(monthIndex));
    setCalendarDate(newDate);
  };

  // Fonction pour mettre à jour l'année dans le calendrier
  const handleYearChange = (year: string) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(Number(year));
    setCalendarDate(newDate);
  };

  // Fonction pour formater la date au format JJ/MM/AAAA pour l'affichage
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Fonction pour transformer une date au format JJ/MM/AAAA en AAAA-MM-JJ pour le stockage
  const parseManualDate = (input: string) => {
    if (!input) return "";
    
    // Gestion des formats JJ/MM/AAAA ou JJ-MM-AAAA
    const dateRegex = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/;
    const match = input.match(dateRegex);
    
    if (match) {
      const day = match[1].padStart(2, '0');
      const month = match[2].padStart(2, '0');
      const year = match[3];
      return `${year}-${month}-${day}`;
    }
    
    return input;
  };

  // Composant personnalisé pour l'en-tête du calendrier
  const CalendarHeader = ({ 
    onPreviousMonth, 
    onNextMonth
  }: { 
    onPreviousMonth: () => void;
    onNextMonth: () => void;
  }) => (
    <div className="flex justify-between items-center px-1 py-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={onPreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex space-x-1">
        <Select
          value={calendarDate.getMonth().toString()}
          onValueChange={handleMonthChange}
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
          value={calendarDate.getFullYear().toString()}
          onValueChange={handleYearChange}
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
        onClick={onNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <FormField 
        id="lastName"
        label="Nom"
        placeholder="Nom de famille"
        control={form.control}
        disabled={loading || blockedAccess}
      />
      
      <FormField 
        id="firstName"
        label="Prénom"
        placeholder="Prénom"
        control={form.control}
        disabled={loading || blockedAccess}
      />
      
      <HookFormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
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
                  value={formatDateForDisplay(field.value)}
                  onChange={(e) => {
                    const formattedDate = parseManualDate(e.target.value);
                    field.onChange(formattedDate);
                  }}
                  disabled={loading || blockedAccess}
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
                        !field.value && "text-muted-foreground",
                        loading || blockedAccess ? "opacity-50 cursor-not-allowed" : ""
                      )}
                      disabled={loading || blockedAccess}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd MMMM yyyy", { locale: fr })
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
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
                      Header: ({ onPreviousClick, onNextClick }) => (
                        <CalendarHeader 
                          onPreviousMonth={onPreviousClick} 
                          onNextMonth={onNextClick}
                        />
                      )
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
            
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField 
        id="accessCode"
        label="Code d'accès aux directives anticipées"
        placeholder="Code d'accès unique aux directives"
        control={form.control}
        disabled={loading || blockedAccess}
      />

      <SecurityAlerts 
        errorMessage={errorMessage}
        remainingAttempts={remainingAttempts}
        blockedAccess={blockedAccess}
      />
    </div>
  );
};

export default DirectivesFormFields;
