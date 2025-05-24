
import { supabase } from "@/integrations/supabase/client";
import { CodeGenerationService } from "./codeGeneration";
import type { PersonalInfo } from "@/types/accessCode";

/**
 * Service for system diagnostics and test user creation
 */
export class DiagnosticService {
  /**
   * Crée un utilisateur de test pour valider le système
   */
  static async createTestUser(): Promise<{ userId: string; fixedCode: string }> {
    try {
      // ID utilisateur factice pour test
      const testUserId = "5a476fae-7295-435a-80e2-25532e9dda8a";
      
      // Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUserId)
        .single();

      if (!existingProfile) {
        console.log("📝 Création du profil de test...");
        
        // Créer le profil de test
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: testUserId,
            first_name: "FARID",
            last_name: "AREZKI",
            birth_date: "1963-08-13"
          });

        if (profileError) {
          console.error("❌ Erreur création profil:", profileError);
          throw profileError;
        }
        
        console.log("✅ Profil de test créé");
      } else {
        console.log("📋 Profil de test existe déjà");
      }

      // Générer le code fixe
      const fixedCode = CodeGenerationService.generateFixedCode(testUserId);
      
      console.log("🧪 Données de test:", {
        userId: testUserId,
        fixedCode: fixedCode,
        expectedData: {
          firstName: "FARID",
          lastName: "AREZKI",
          birthDate: "1963-08-13"
        }
      });

      return { userId: testUserId, fixedCode };
      
    } catch (error) {
      console.error("💥 Erreur création utilisateur test:", error);
      throw error;
    }
  }

  /**
   * Effectue un diagnostic complet du système
   */
  static async diagnosticSystem(personalInfo: PersonalInfo): Promise<any> {
    try {
      console.log("🔍 === DIAGNOSTIC SYSTÈME COMPLET ===");
      
      // 1. Vérifier la connexion Supabase
      const { data: testConnection } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      console.log("📡 Connexion Supabase:", testConnection ? "OK" : "ERREUR");

      // 2. Rechercher tous les profils similaires
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10);
      
      console.log("👥 Tous les profils (10 premiers):", allProfiles?.length || 0);
      if (allProfiles) {
        allProfiles.forEach(profile => {
          console.log("  - Profil:", {
            id: profile.id,
            name: `${profile.first_name} ${profile.last_name}`,
            birth_date: profile.birth_date
          });
        });
      }

      // 3. Recherche par nom exact
      const { data: exactMatch, error: exactError } = await supabase
        .from('profiles')
        .select('*')
        .eq('first_name', personalInfo.firstName)
        .eq('last_name', personalInfo.lastName);
      
      console.log("🎯 Correspondance exacte:", exactMatch?.length || 0);

      // 4. Recherche insensible à la casse
      const { data: caseInsensitive, error: caseError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('first_name', personalInfo.firstName)
        .ilike('last_name', personalInfo.lastName);
      
      console.log("🔤 Correspondance insensible casse:", caseInsensitive?.length || 0);

      // 5. Créer utilisateur de test si aucun trouvé
      if (!caseInsensitive || caseInsensitive.length === 0) {
        console.log("🧪 Aucun profil trouvé - Création utilisateur de test...");
        const testUser = await this.createTestUser();
        return { 
          diagnostic: "Aucun profil existant trouvé",
          testUserCreated: testUser,
          recommendation: "Utilisez les données de test créées"
        };
      }

      return {
        diagnostic: "Profils trouvés dans la base",
        profiles: caseInsensitive,
        recommendation: "Vérifiez les codes générés pour ces profils"
      };

    } catch (error) {
      console.error("💥 Erreur diagnostic:", error);
      return {
        diagnostic: "Erreur lors du diagnostic",
        error: error
      };
    }
  }
}
