
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formSchema } from "@/utils/access-document/validationSchema";

export type FormData = z.infer<typeof formSchema>;

export const useAccessDocumentForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", birthDate: "", accessCode: "" }
  });

  const handleFormValidation = async () => {
    return await form.trigger();
  };

  const accessDirectives = async () => {
    if (!await handleFormValidation()) return { success: false, error: "Invalid form" };
    setLoading(true);
    try {
      toast({ title: "Connexion requise", description: "Vous devez vous connecter pour accéder à cette fonctionnalité", variant: "destructive" });
      navigate("/auth");
      return { success: false, error: "Login required" };
    } finally { setLoading(false); }
  };

  const accessMedicalData = async () => {
    if (!await handleFormValidation()) return { success: false, error: "Invalid form" };
    setLoading(true);
    try {
      toast({ title: "Connexion requise", description: "Vous devez vous connecter pour accéder à cette fonctionnalité", variant: "destructive" });
      navigate("/auth");
      return { success: false, error: "Login required" };
    } finally { setLoading(false); }
  };

  return { form, loading, accessDirectives, accessMedicalData };
};
