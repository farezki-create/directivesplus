
import { supabase } from "@/integrations/supabase/client";

export interface TestPatientData {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  institution_code: string;
}

export const getTestPatientData = (): TestPatientData => ({
  id: "test-patient-farid-arezki",
  first_name: "FARID",
  last_name: "AREZKI", 
  birth_date: "1963-08-13",
  institution_code: "9E5CUV7X"
});

export const validateWithTestData = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
): Promise<boolean> => {
  const testData = getTestPatientData();
  
  return (
    lastName.trim().toUpperCase() === testData.last_name &&
    firstName.trim().toUpperCase() === testData.first_name &&
    birthDate === testData.birth_date &&
    institutionCode.trim() === testData.institution_code
  );
};

export const searchInUserProfiles = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
) => {
  console.log("Recherche dans user_profiles...");
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('last_name', lastName.trim())
    .eq('first_name', firstName.trim())
    .eq('birth_date', birthDate)
    .eq('institution_shared_code', institutionCode.trim());

  console.log("Résultat user_profiles:", { data, error });
  return { data, error };
};
