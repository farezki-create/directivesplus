
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Non spécifié";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return "Format de date invalide";
  }
};
