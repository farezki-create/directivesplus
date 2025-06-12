
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { formatDateForDisplay, parseManualDate } from "@/utils/dateFormatters";
import { useState } from "react";

export default function PersonalInformationFields() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations personnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Votre prénom" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Votre nom" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de naissance</FormLabel>
            <FormControl>
              <ManualDateInput
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro de téléphone</FormLabel>
            <FormControl>
              <Input {...field} placeholder="+33 6 12 34 56 78" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

interface ManualDateInputProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

function ManualDateInput({ value, onChange }: ManualDateInputProps) {
  // État local pour la valeur d'affichage
  const [displayValue, setDisplayValue] = useState(() => {
    if (value) {
      return formatDateForDisplay(value.toISOString().split('T')[0]);
    }
    return "";
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Essayer de parser la date
    if (inputValue) {
      const formattedDate = parseManualDate(inputValue);
      if (formattedDate && formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(formattedDate);
        if (!isNaN(date.getTime())) {
          onChange(date);
          return;
        }
      }
    }
    onChange(undefined);
  };

  return (
    <Input
      type="text"
      placeholder="JJ/MM/AAAA"
      value={displayValue}
      onChange={handleInputChange}
      className="w-full"
    />
  );
}
