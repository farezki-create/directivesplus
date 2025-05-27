
import { useState, useEffect } from "react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";
import { validateProfessionalId } from "@/utils/professional-id-validation";

interface FormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
  professionalId: string;
}

export const useInstitutionAccessForm = () => {
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    birthDate: "",
    institutionCode: "",
    professionalId: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Utiliser le hook d'accès institution
  const institutionAccess = useInstitutionCodeAccess(
    submitted ? formData.institutionCode : null,
    submitted ? formData.lastName : null,
    submitted ? formData.firstName : null,
    submitted ? formData.birthDate : null,
    submitted ? formData.professionalId : null,
    Boolean(submitted && formData.lastName && formData.firstName && formData.birthDate && formData.institutionCode && formData.professionalId)
  );

  // Reset submitted state if there's an error
  useEffect(() => {
    if (institutionAccess.error && submitted) {
      console.log("Erreur détectée, reset du state submitted");
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [institutionAccess.error, submitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changement dans le champ ${name}:`, value);
    
    // Pour le champ professionalId, ne garder que les chiffres
    if (name === 'professionalId') {
      const numericValue = value.replace(/[^0-9]/g, '');
      console.log(`Valeur numérique filtrée pour ${name}:`, numericValue);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (institutionAccess.error && submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le numéro professionnel avant soumission
    const professionalIdValidation = validateProfessionalId(formData.professionalId);
    if (!professionalIdValidation.isValid) {
      console.error("Numéro professionnel invalide:", professionalIdValidation.error);
      return;
    }
    
    console.log("Soumission du formulaire avec les données:", {
      ...formData,
      professionalIdType: professionalIdValidation.type,
      professionalIdFormatted: professionalIdValidation.formattedNumber
    });
    
    setSubmitted(true);
  };

  // Corriger la validation du formulaire pour retourner un booléen
  const isFormValid = Boolean(
    formData.lastName.trim() && 
    formData.firstName.trim() && 
    formData.birthDate.trim() && 
    formData.institutionCode.trim() && 
    formData.professionalId.trim() &&
    validateProfessionalId(formData.professionalId).isValid
  );
  
  const isLoading = submitted && institutionAccess.loading;

  console.log("État du hook useInstitutionAccessForm:", {
    formData,
    isFormValid,
    isLoading,
    submitted,
    accessGranted: institutionAccess.accessGranted,
    error: institutionAccess.error
  });

  return {
    formData,
    submitted,
    institutionAccess,
    isFormValid,
    isLoading,
    handleChange,
    handleSubmit
  };
};
