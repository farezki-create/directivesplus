
export interface AlertContact {
  id: string;
  contact_type: string;
  contact_name: string;
  phone_number?: string;
  email?: string;
}

// Types pour les contacts d'alerte
export type ContactType = 
  | 'soignant'
  | 'famille' 
  | 'personne_confiance'
  | 'had'
  | 'soins_palliatifs'
  | 'infirmiere'
  | 'medecin_traitant'
  | 'autre';

export interface ContactFormData {
  contact_type: ContactType;
  contact_name: string;
  phone_number?: string;
  email?: string;
}
