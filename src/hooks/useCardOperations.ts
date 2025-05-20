
import { useRef } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export const useCardOperations = (
  user: User | null,
  firstName: string,
  lastName: string,
  includeDirective: boolean,
  includeMedical: boolean,
  directiveCode: string | null,
  medicalCode: string | null
) => {
  // Garder seulement la référence au card
  const cardRef = useRef<HTMLDivElement>(null);

  return {
    cardRef
  };
};
