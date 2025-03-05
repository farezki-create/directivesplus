
import { Translation } from './types';

export const fr_profile: Translation = {
  "profile": "Profil",
  "profileDesc": "Informations personnelles",
  "profileSettings": "Paramètres du profil",
  "editProfile": "Modifier le profil",
  "saveProfile": "Enregistrer le profil",
  "cancelEdit": "Annuler les modifications",
  "firstName": "Prénom",
  "lastName": "Nom",
  "dateOfBirth": "Date de naissance",
  "gender": "Genre",
  "male": "Homme",
  "female": "Femme",
  "other": "Autre",
  "preferNotToSay": "Préfère ne pas dire",
  "email": "Email",
  "phone": "Téléphone",
  "address": "Adresse",
  "city": "Ville",
  "postalCode": "Code postal",
  "country": "Pays",
  "updateSuccessful": "Profil mis à jour avec succès",
  "updateFailed": "Échec de la mise à jour du profil",
};

export const en_profile: Translation = {
  "profile": "Profile",
  "profileDesc": "Personal information",
  "profileSettings": "Profile settings",
  "editProfile": "Edit profile",
  "saveProfile": "Save profile",
  "cancelEdit": "Cancel changes",
  "firstName": "First name",
  "lastName": "Last name",
  "dateOfBirth": "Date of birth",
  "gender": "Gender",
  "male": "Male",
  "female": "Female",
  "other": "Other",
  "preferNotToSay": "Prefer not to say",
  "email": "Email",
  "phone": "Phone",
  "address": "Address",
  "city": "City",
  "postalCode": "Postal code",
  "country": "Country",
  "updateSuccessful": "Profile updated successfully",
  "updateFailed": "Profile update failed",
};

// Create an object that contains all translations
export const profileTranslations = {
  fr: fr_profile,
  en: en_profile
};
