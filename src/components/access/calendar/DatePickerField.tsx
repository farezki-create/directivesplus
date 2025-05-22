
import React, { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

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
  // État local pour gérer la valeur d'affichage
  const [displayValue, setDisplayValue] = useState(() => {
    // Convertir le format ISO en format JJ/MM/AAAA pour l'affichage
    if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return format(date, "dd/MM/yyyy");
      }
    }
    return value ? formatDateForDisplay(value) : "";
  });

  // Fonction pour formater la date au format JJ/MM/AAAA pour l'affichage
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      // Si la date est déjà au format JJ/MM/AAAA, la retourner telle quelle
      if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        return dateString;
      }
      
      // Sinon, essayer de la convertir à partir du format ISO
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, "dd/MM/yyyy");
      }
      return dateString;
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
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

  // Gestion du changement de valeur
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Formater pour le stockage uniquement si la valeur correspond à un format de date valide
    const formattedDate = parseManualDate(inputValue);
    onChange(formattedDate);
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel>Date de naissance</FormLabel>
      
      <FormControl>
        <Input
          placeholder="JJ/MM/AAAA"
          value={displayValue}
          onChange={handleInputChange}
          disabled={disabled}
          className="focus:ring-2 focus:ring-directiveplus-500"
        />
      </FormControl>
      
      <FormMessage />
    </FormItem>
  );
};

export default DatePickerField;
