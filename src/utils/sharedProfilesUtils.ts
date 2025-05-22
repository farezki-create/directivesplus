
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a shared profile for public access to directives
 * @param userId The ID of the user sharing their profile
 * @param profileData User profile data (first_name, last_name, birth_date)
 * @param medicalProfileId Optional ID of the medical profile to link
 * @param expiresInDays Number of days until the shared access expires (optional)
 * @returns The generated access code or null on failure
 */
export const createSharedProfile = async (
  userId: string,
  profileData: {
    first_name: string;
    last_name: string;
    birth_date: string;
  },
  medicalProfileId?: string,
  expiresInDays?: number
): Promise<string | null> => {
  try {
    // Generate a 6-digit access code
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresInDays) {
      const date = new Date();
      date.setDate(date.getDate() + expiresInDays);
      expiresAt = date.toISOString();
    }
    
    // Convert birthdate string to proper format for PostgreSQL
    const birthdate = new Date(profileData.birth_date).toISOString().split('T')[0];
    
    // Insert the shared profile
    const { error } = await supabase.from('shared_profiles').insert({
      user_id: userId,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      birthdate: birthdate,
      access_code: accessCode,
      expires_at: expiresAt,
      medical_profile_id: medicalProfileId
    });
    
    if (error) {
      console.error("Error creating shared profile:", error);
      return null;
    }
    
    return accessCode;
  } catch (error) {
    console.error("Error in createSharedProfile:", error);
    return null;
  }
};

/**
 * Revokes a shared profile by deleting it from the database
 * @param userId The ID of the user who created the shared profile
 * @param accessCode The access code to revoke
 * @returns True if successful, false otherwise
 */
export const revokeSharedProfile = async (
  userId: string,
  accessCode: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shared_profiles')
      .delete()
      .eq('user_id', userId)
      .eq('access_code', accessCode);
    
    if (error) {
      console.error("Error revoking shared profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in revokeSharedProfile:", error);
    return false;
  }
};
