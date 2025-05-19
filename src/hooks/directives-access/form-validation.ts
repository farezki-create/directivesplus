
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { directivesFormSchema, DirectivesFormData } from "./types";

export const useDirectivesFormValidation = () => {
  // Initialisation de react-hook-form avec le resolver zod
  const form = useForm<DirectivesFormData>({
    resolver: zodResolver(directivesFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      accessCode: ""
    }
  });

  // Fonction de validation du formulaire
  const handleFormValidation = async () => {
    const isValid = await form.trigger();
    console.log("Validation du formulaire directives:", isValid);
    return isValid;
  };

  return {
    form,
    handleFormValidation
  };
};
