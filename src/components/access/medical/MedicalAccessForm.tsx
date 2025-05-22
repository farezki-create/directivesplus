
import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MedicalFormFields from "./MedicalFormFields";

// Define a form schema
const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

// Define type for form data
type FormData = z.infer<typeof formSchema>;

interface MedicalAccessFormProps {
  onSubmit: (accessCode: string, formData: any) => Promise<void>;
}

const MedicalAccessForm: React.FC<MedicalAccessFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = React.useState<number | null>(null);
  const [blockedAccess, setBlockedAccess] = React.useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  const handleSubmit = async (formData: FormData) => {
    setErrorMessage(null);
    setLoading(true);
    
    try {
      await onSubmit(formData.accessCode, formData);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <MedicalFormFields
        form={form}
        loading={loading}
        blockedAccess={blockedAccess}
        errorMessage={errorMessage}
        remainingAttempts={remainingAttempts}
      />
      
      <div className="mt-6">
        <Button
          type="submit"
          className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full"></span>
              Vérification...
            </span>
          ) : (
            "Accéder aux données médicales"
          )}
        </Button>
      </div>
    </form>
  );
};

export default MedicalAccessForm;
