
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Non renseignée";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch (e) {
    return "Non renseignée";
  }
};
