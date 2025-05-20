import { useRef } from "react";
import { User } from "@supabase/supabase-js";

export const useCardOperations = (
  user: User | null,
  firstName: string,
  lastName: string,
  includeDirective: boolean,
  includeMedical: boolean,
  directiveCode: string | null,
  medicalCode: string | null
) => {
  // Keep only the reference to the card
  const cardRef = useRef<HTMLDivElement>(null);

  return {
    cardRef
  };
};
