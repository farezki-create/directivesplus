
import { Translation } from './types';

export const fr_trustedPersons: Translation = {
  "trustedPerson": "Personnes de confiance",
  "trustedPersons": "Personnes de confiance",
  "trustedPersonsDesc": "Personnes à contacter",
  "trustedPersonDesignation": "Désignation de la personne de confiance",
  "addTrustedPerson": "Ajouter une personne de confiance",
  "editTrustedPerson": "Modifier la personne de confiance",
  "deleteTrustedPerson": "Supprimer la personne de confiance",
  "trustPersonName": "Nom",
  "trustPersonRelationship": "Lien",
  "trustPersonPhone": "Téléphone",
  "trustPersonEmail": "Email",
  "trustPersonAddress": "Adresse",
  "confirmDeleteTrustedPerson": "Êtes-vous sûr de vouloir supprimer cette personne de confiance ?",
};

export const en_trustedPersons: Translation = {
  "trustedPerson": "Trusted persons",
  "trustedPersons": "Trusted Persons",
  "trustedPersonsDesc": "People to contact",
  "trustedPersonDesignation": "Designation of Trusted Person",
  "addTrustedPerson": "Add trusted person",
  "editTrustedPerson": "Edit trusted person",
  "deleteTrustedPerson": "Delete trusted person",
  "trustPersonName": "Name",
  "trustPersonRelationship": "Relationship",
  "trustPersonPhone": "Phone",
  "trustPersonEmail": "Email",
  "trustPersonAddress": "Address",
  "confirmDeleteTrustedPerson": "Are you sure you want to delete this trusted person?",
};

// Create an object that contains all translations
export const trustedPersonsTranslations = {
  fr: fr_trustedPersons,
  en: en_trustedPersons
};
