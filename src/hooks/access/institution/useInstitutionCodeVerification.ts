
import { supabase } from "@/integrations/supabase/client";

export const verifyInstitutionCodeExists = async (institutionCode: string) => {
  console.log("Verifying institution code:", institutionCode);
  
  // D'abord, vérifions tous les codes d'institution qui existent
  const { data: allCodes, error: allCodesError } = await supabase
    .from('directives')
    .select('id, institution_code, institution_code_expires_at, user_id')
    .not('institution_code', 'is', null);
    
  console.log("All existing institution codes in database:", allCodes);
  
  const { data: existingCodes, error: codeCheckError } = await supabase
    .from('directives')
    .select('id, institution_code_expires_at, user_id')
    .eq('institution_code', institutionCode)
    .not('institution_code_expires_at', 'is', null);

  if (codeCheckError) {
    console.error("Error checking institution code:", codeCheckError);
    throw new Error("Erreur lors de la vérification du code institution.");
  }

  console.log("Found codes for specific institution code:", existingCodes);

  if (!existingCodes || existingCodes.length === 0) {
    console.log("No directives found with this institution code");
    console.log("Available institution codes:", allCodes?.map(c => c.institution_code).filter(Boolean));
    throw new Error("Code d'accès institution invalide. Vérifiez que le code est correct et qu'il a été généré pour ce patient.");
  }

  const now = new Date();
  const validCodes = existingCodes.filter(code => {
    const expiresAt = new Date(code.institution_code_expires_at);
    console.log("Checking expiry:", expiresAt, "vs now:", now);
    return expiresAt > now;
  });

  if (validCodes.length === 0) {
    console.log("Institution code has expired");
    console.log("Expiration dates:", existingCodes.map(c => c.institution_code_expires_at));
    throw new Error("Le code d'accès institution a expiré.");
  }

  console.log("Valid institution codes found:", validCodes.length);
  return validCodes;
};
