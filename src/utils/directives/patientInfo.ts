
import { PatientData } from "@/types/directivesTypes";
import { useDirectivesStore } from "@/store/directivesStore";

export const getPatientInfo = (): PatientData | null => {
  // For now, return mock data since we don't have patient info in the simple store
  return {
    first_name: "Patient",
    last_name: "Anonyme",
    birth_date: new Date().toISOString().split('T')[0]
  };
};

export const hasPatientInfo = (): boolean => {
  const patientInfo = getPatientInfo();
  return patientInfo !== null && patientInfo.first_name !== "Patient";
};

export const formatPatientName = (): string => {
  const patientInfo = getPatientInfo();
  if (!patientInfo) return "Patient Anonyme";
  return `${patientInfo.first_name} ${patientInfo.last_name}`;
};
