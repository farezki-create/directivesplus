
import { supabase } from "@/integrations/supabase/client";

export const verifyInstitutionCodeExists = async (institutionCode: string) => {
  const { data: existingCodes, error: codeCheckError } = await supabase
    .from('directives')
    .select('id, institution_code_expires_at')
    .eq('institution_code', institutionCode)
    .not('institution_code_expires_at', 'is', null);

  if (codeCheckError) {
    console.error("Error checking institution code:", codeCheckError);
    throw new Error("Erreur lors de la vérification du code institution.");
  }

  if (!existingCodes || existingCodes.length === 0) {
    console.log("No directives found with this institution code");
    throw new Error("Code d'accès institution invalide.");
  }

  const now = new Date();
  const validCodes = existingCodes.filter(code => 
    new Date(code.institution_code_expires_at) > now
  );

  if (validCodes.length === 0) {
    console.log("Institution code has expired");
    throw new Error("Le code d'accès institution a expiré.");
  }

  console.log("Valid institution codes found:", validCodes.length);
  return validCodes;
};
