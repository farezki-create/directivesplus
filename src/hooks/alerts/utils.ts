
// Mapping des types de contact français vers les types de base de données
export const CONTACT_TYPE_MAPPING: Record<string, string> = {
  'soignant': 'doctor',
  'famille': 'family',
  'personne_confiance': 'family',
  'had': 'doctor',
  'soins_palliatifs': 'doctor',
  'infirmiere': 'doctor',
  'medecin_traitant': 'doctor',
  'autre': 'friend'
};

export const mapContactType = (contactType: string): string => {
  return CONTACT_TYPE_MAPPING[contactType] || contactType;
};
