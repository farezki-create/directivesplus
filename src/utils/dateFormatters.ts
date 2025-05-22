
import { format } from "date-fns";

// Fonction pour formater la date au format JJ/MM/AAAA pour l'affichage
export const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    return dateString;
  }
};

// Fonction pour transformer une date au format JJ/MM/AAAA en AAAA-MM-JJ pour le stockage
export const parseManualDate = (input: string) => {
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
