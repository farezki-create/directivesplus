
import { supabase } from "@/integrations/supabase/client";
import { logAccessEvent } from "@/utils/accessLoggingUtils";

interface InstitutionAccessFormValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const logInstitutionAccess = async (
  directiveIds: string[], 
  values: InstitutionAccessFormValues
) => {
  try {
    for (const directiveId of directiveIds) {
      // Log access in the access_logs table
      await supabase.from("access_logs").insert({
        directive_id: directiveId,
        access_type: "institution",
        access_by: `Institution médicale (${values.firstName} ${values.lastName})`,
        ip_address: "client_side",
        user_agent: navigator.userAgent
      });
      
      // Use the existing logging utility for consistency
      await logAccessEvent({
        userId: "00000000-0000-0000-0000-000000000000",
        accessCodeId: "00000000-0000-0000-0000-000000000000",
        consultantName: values.lastName,
        consultantFirstName: values.firstName,
        resourceType: "directive",
        resourceId: directiveId,
        action: "institution_access",
        success: true,
        details: `Institution access using code: ${values.institutionCode}`
      });
    }
  } catch (err) {
    console.error("Failed to log institution access:", err);
  }
};
