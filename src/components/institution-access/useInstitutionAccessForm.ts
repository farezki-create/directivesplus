
import { useState, useEffect } from "react";
import { useInstitutionCodeAccess } from "@/hooks/useInstitutionCodeAccess";

interface FormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const useInstitutionAccessForm = () => {
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    birthDate: "",
    institutionCode: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Utiliser le hook d'accès institution
  const institutionAccess = useInstitutionCodeAccess(
    submitted ? formData.institutionCode : null,
    submitted ? formData.lastName : null,
    submitted ? formData.firstName : null,
    submitted ? formData.birthDate : null,
    Boolean(submitted && formData.lastName && formData.firstName && formData.birthDate && formData.institutionCode)
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

  // Redirection automatique après succès
  useEffect(() => {
    if (institutionAccess.accessGranted) {
      console.log("Accès accordé, redirection vers /directives-acces");
      setTimeout(() => {
        window.location.href = "/directives-acces";
      }, 2000);
    }
  }, [institutionAccess.accessGranted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (institutionAccess.error && submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission du formulaire avec les données:", formData);
    setSubmitted(true);
  };

  const isFormValid = formData.lastName && formData.firstName && formData.birthDate && formData.institutionCode;
  const isLoading = submitted && institutionAccess.loading;

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
