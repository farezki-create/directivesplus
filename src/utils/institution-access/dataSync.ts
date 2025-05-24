
import { supabase } from "@/integrations/supabase/client";

export const syncProfileToUserProfiles = async (userId: string) => {
  console.log("=== SYNCHRONISATION PROFIL VERS USER_PROFILES ===");
  
  try {
    // Récupérer le profil depuis la table profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error("Profil non trouvé:", profileError);
      return false;
    }

    // Récupérer le code institution depuis directives
    const { data: directive, error: directiveError } = await supabase
      .from('directives')
      .select('institution_code')
      .eq('user_id', userId)
      .not('institution_code', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const institutionCode = directive?.institution_code || null;

    // Insérer ou mettre à jour dans user_profiles
    const { error: upsertError } = await supabase
      .from('user_profiles')
      .upsert({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        birth_date: profile.birth_date,
        institution_shared_code: institutionCode
      });

    if (upsertError) {
      console.error("Erreur synchronisation:", upsertError);
      return false;
    }

    console.log("Synchronisation réussie pour:", profile.first_name, profile.last_name);
    return true;

  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
    return false;
  }
};

export const syncCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return await syncProfileToUserProfiles(user.id);
  }
  return false;
};
