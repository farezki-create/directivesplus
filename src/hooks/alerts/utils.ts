
/**
 * Utilitaires pour la gestion des contacts d'alerte
 */

/**
 * Mappe les types de contact pour la base de données
 */
export const mapContactType = (contactType: string): string => {
  const typeMapping: Record<string, string> = {
    'soignant': 'soignant',
    'famille': 'famille',
    'personne_confiance': 'personne_confiance',
    'had': 'had',
    'soins_palliatifs': 'soins_palliatifs',
    'infirmiere': 'infirmiere',
    'medecin_traitant': 'medecin_traitant',
    'autre': 'autre'
  };

  return typeMapping[contactType] || contactType;
};

/**
 * Obtient le libellé d'affichage pour un type de contact
 */
export const getContactTypeLabel = (contactType: string): string => {
  const labelMapping: Record<string, string> = {
    'soignant': 'Soignant',
    'famille': 'Membre de la famille',
    'personne_confiance': 'Personne de confiance',
    'had': 'HAD (Hospitalisation à domicile)',
    'soins_palliatifs': 'Unité mobile de soins palliatifs',
    'infirmiere': 'Infirmière',
    'medecin_traitant': 'Médecin traitant',
    'autre': 'Autre'
  };

  return labelMapping[contactType] || contactType;
};
