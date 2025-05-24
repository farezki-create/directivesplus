
export interface PatientInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export const extractPatientInfo = (dossierActif: any): PatientInfo => {
  const profileData = dossierActif?.profileData;
  const patientData = dossierActif?.contenu?.patient;
  
  // Fonction helper pour extraire en toute sécurité les valeurs string
  const getStringValue = (value: any): string => {
    return typeof value === 'string' ? value : '';
  };
  
  // Priorité aux données du profil, puis aux données du contenu
  let firstName = '';
  let lastName = '';
  let birthDate = '';
  
  if (profileData?.first_name) {
    firstName = getStringValue(profileData.first_name);
  } else if (patientData && 'prenom' in patientData) {
    firstName = getStringValue(patientData.prenom);
  } else if (patientData && 'first_name' in patientData) {
    firstName = getStringValue(patientData.first_name);
  }
  
  if (profileData?.last_name) {
    lastName = getStringValue(profileData.last_name);
  } else if (patientData && 'nom' in patientData) {
    lastName = getStringValue(patientData.nom);
  } else if (patientData && 'last_name' in patientData) {
    lastName = getStringValue(patientData.last_name);
  }
  
  if (profileData?.birth_date) {
    birthDate = getStringValue(profileData.birth_date);
  } else if (patientData && 'date_naissance' in patientData) {
    birthDate = getStringValue(patientData.date_naissance);
  } else if (patientData && 'birth_date' in patientData) {
    birthDate = getStringValue(patientData.birth_date);
  }
  
  return { firstName, lastName, birthDate };
};
