
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    disabled={(date) => 
                      date > new Date() || 
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={fr}
                    className="p-3 pointer-events-auto"
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
