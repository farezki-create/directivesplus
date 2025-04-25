
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Le nom est requis"),
      dosage: z.string().optional(),
      frequency: z.string().optional()
    })
  ).default([]),
  otherInfo: z.string().optional()
});

export type FormData = z.infer<typeof formSchema>;

export function useMedicalForm(onDataSaved?: () => void) {
  const { user } = useAuth();
  const { saveMedicalData } = useMedicalData(user?.id || "");
  const { toast } = useToast();
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodType: "",
      allergies: [],
      conditions: [],
      medications: [{ name: "", dosage: "", frequency: "" }],
      otherInfo: ""
    }
  });

  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
    control: form.control,
    name: "medications"
  });

  const addAllergy = () => {
    if (newAllergy.trim() !== "") {
      form.setValue("allergies", [...form.getValues().allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const currentAllergies = form.getValues().allergies;
    currentAllergies.splice(index, 1);
    form.setValue("allergies", [...currentAllergies]);
  };

  const addCondition = () => {
    if (newCondition.trim() !== "") {
      form.setValue("conditions", [...form.getValues().conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    const currentConditions = form.getValues().conditions;
    currentConditions.splice(index, 1);
    form.setValue("conditions", [...currentConditions]);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder vos données médicales",
        variant: "destructive"
      });
      return;
    }

    try {
      const accessCode = await saveMedicalData(data);
      
      if (accessCode) {
        toast({
          title: "Données enregistrées",
          description: `Vos données médicales ont été sauvegardées avec le code d'accès: ${accessCode}`,
        });
        
        form.reset();
        
        if (onDataSaved) {
          onDataSaved();
        }
      }
    } catch (error) {
      console.error("Error saving medical data:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde des données",
        variant: "destructive"
      });
    }
  };

  return {
    form,
    medicationFields,
    appendMedication,
    removeMedication,
    newAllergy,
    setNewAllergy,
    addAllergy,
    removeAllergy,
    newCondition,
    setNewCondition,
    addCondition,
    removeCondition,
    onSubmit
  };
}
