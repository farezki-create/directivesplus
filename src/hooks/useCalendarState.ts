
import { useState } from "react";

export function useCalendarState() {
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

  // Fonction pour décrémenter le mois
  const decrementMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCalendarDate(newDate);
  };

  // Fonction pour incrémenter le mois
  const incrementMonth = () => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCalendarDate(newDate);
  };

  return {
    calendarDate,
    setCalendarDate,
    months,
    years,
    handleMonthChange,
    handleYearChange,
    decrementMonth,
    incrementMonth
  };
}
