
import React from "react";
import { SecurityAlert } from "./SecurityAlert";
import { SuccessView } from "./SuccessView";
import { InstitutionForm } from "./InstitutionForm";
import { SecurityInfo } from "./SecurityInfo";
import { useInstitutionAccessForm } from "./useInstitutionAccessForm";

export const InstitutionAccessFormComplete: React.FC = () => {
  const {
    formData,
    submitted,
    institutionAccess,
    isFormValid,
    isLoading,
    handleChange,
    handleSubmit
  } = useInstitutionAccessForm();

  console.log("État du formulaire:", { 
    submitted, 
    loading: institutionAccess.loading, 
    error: institutionAccess.error,
    accessGranted: institutionAccess.accessGranted,
    isFormValid
  });

  // Si l'accès est accordé, afficher le message de succès avec redirection automatique
  if (institutionAccess.accessGranted) {
    return <SuccessView patientData={institutionAccess.patientData} />;
  }

  return (
    <div className="space-y-6">
      <SecurityAlert />
      
      <InstitutionForm
        formData={formData}
        isFormValid={isFormValid}
        isLoading={isLoading}
        error={institutionAccess.error}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />

      <SecurityInfo />
    </div>
  );
};
