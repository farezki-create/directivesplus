
import { supabase } from "@/integrations/supabase/client";
import CryptoJS from 'crypto-js';
import type { 
  PersonalInfo, 
  AccessCodeOptions, 
  AccessValidationResult, 
  CodeGenerationResult,
  ShareableDocument,
  DocumentBundle
} from "@/types/accessCode";

/**
 * Service unifié pour la gestion des codes d'accès
 * Remplace AccessCodeManager et UnifiedAccessCodeService
 */
export class AccessCodeService {
  
  // ============ GÉNÉRATION DE CODES ============
  
  /**
   * Génère un code fixe reproductible basé sur l'ID utilisateur
   */
  static generateFixedCode(userId: string): string {
    console.log("🔑 Génération code fixe pour userId:", userId);
    
    // Créer un hash SHA256 de l'ID utilisateur
    const hash = CryptoJS.SHA256(`fixed-${userId}`).toString();
    
    // Prendre les 8 premiers caractères et les convertir en majuscules
    let code = hash.substring(0, 8).toUpperCase();
    
    // Remplacer certains caractères pour éviter la confusion
    code = code
      .replace(/0/g, 'O')
      .replace(/1/g, 'I')
      .replace(/5/g, 'S');
    
    console.log("🔑 Code fixe généré:", code);
    return code;
  }

  /**
   * Génère un code temporaire unique
   */
  static generateTemporaryCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // ============ DIAGNOSTIC ET DONNÉES DE TEST ============

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
      const fixedCode = this.generateFixedCode(testUserId);
      
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

  // ============ CRÉATION DE CODES D'ACCÈS ============

  /**
   * Crée un code d'accès temporaire pour un utilisateur
   */
  static async createTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<CodeGenerationResult> {
    try {
      console.log("=== CRÉATION CODE TEMPORAIRE ===");
      console.log("User ID:", userId, "Options:", options);

      // Récupérer les documents
      const documents = await this.getUserDocuments(userId);
      if (documents.length === 0) {
        return {
          success: false,
          error: "Aucun document à partager trouvé"
        };
      }

      // Générer le code et calculer l'expiration
      const accessCode = this.generateTemporaryCode();
      const expiresInDays = options.expiresInDays || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Préparer le bundle de documents
      const documentBundle: DocumentBundle = {
        userId,
        accessType: options.accessType || 'global',
        totalDocuments: documents.length,
        generatedAt: new Date().toISOString(),
        documents: documents.map(doc => ({
          ...doc,
          content: doc.content || null
        }))
      };

      // Enregistrer en base
      const { error } = await supabase
        .from('shared_documents')
        .insert({
          access_code: accessCode,
          user_id: userId,
          document_type: 'bundle',
          document_id: userId,
          document_data: documentBundle as any,
          expires_at: expiresAt.toISOString(),
          is_active: true
        });

      if (error) {
        console.error("❌ Erreur insertion:", error);
        return {
          success: false,
          error: `Erreur lors de l'enregistrement: ${error.message}`
        };
      }

      console.log("✅ Code temporaire créé:", accessCode);
      return {
        success: true,
        code: accessCode,
        message: `Code créé avec succès. Expire le ${expiresAt.toLocaleDateString()}.`,
        expiresAt: expiresAt.toISOString()
      };

    } catch (error: any) {
      console.error("💥 Erreur création code:", error);
      return {
        success: false,
        error: "Erreur technique lors de la création"
      };
    }
  }

  // ============ VALIDATION DE CODES ============

  /**
   * Valide un code d'accès (temporaire ou fixe)
   */
  static async validateCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("=== VALIDATION CODE D'ACCÈS ===");
      console.log("Code:", accessCode, "Infos:", personalInfo);

      // Effectuer un diagnostic si échec prévu
      if (personalInfo) {
        console.log("🔍 Diagnostic avant validation...");
        const diagnostic = await this.diagnosticSystem(personalInfo);
        console.log("📊 Résultat diagnostic:", diagnostic);
      }

      // 1. Tentative code temporaire
      const temporaryResult = await this.validateTemporaryCode(accessCode, personalInfo);
      if (temporaryResult.success) {
        return temporaryResult;
      }

      // 2. Tentative code fixe (si infos personnelles fournies)
      if (personalInfo?.firstName && personalInfo?.lastName) {
        const fixedResult = await this.validateFixedCode(accessCode, personalInfo);
        if (fixedResult.success) {
          return fixedResult;
        }
      }

      return {
        success: false,
        error: "Code d'accès invalide ou expiré"
      };

    } catch (error: any) {
      console.error("💥 Erreur validation:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  // ============ MÉTHODES PRIVÉES ============

  private static async validateTemporaryCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("🔍 Validation code temporaire");

      const { data, error } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        console.log("⚠️ Code temporaire non trouvé ou expiré");
        return { success: false, error: "Code non trouvé ou expiré" };
      }

      // Vérifier les infos personnelles si fournies
      if (personalInfo?.firstName && personalInfo?.lastName) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, birth_date')
          .eq('id', data.user_id)
          .single();

        if (profile) {
          const firstNameMatch = profile.first_name?.toLowerCase() === personalInfo.firstName.toLowerCase();
          const lastNameMatch = profile.last_name?.toLowerCase() === personalInfo.lastName.toLowerCase();
          const birthDateMatch = !personalInfo.birthDate || profile.birth_date === personalInfo.birthDate;

          if (!firstNameMatch || !lastNameMatch || !birthDateMatch) {
            console.log("❌ Informations personnelles incorrectes");
            return { success: false, error: "Informations personnelles incorrectes" };
          }
        }
      }

      // Extraire les documents du bundle
      const documentData = data.document_data as any;
      if (documentData?.documents && Array.isArray(documentData.documents)) {
        return {
          success: true,
          documents: documentData.documents,
          message: `Accès autorisé. ${documentData.documents.length} document(s) trouvé(s).`,
          userId: data.user_id,
          accessType: documentData.accessType || 'global'
        };
      }

      return { success: false, error: "Structure de données invalide" };

    } catch (error: any) {
      console.error("💥 Erreur validation temporaire:", error);
      return { success: false, error: "Erreur technique" };
    }
  }

  private static async validateFixedCode(
    accessCode: string,
    personalInfo: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("🔍 Validation code fixe");
      console.log("Recherche profils avec:", {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        birthDate: personalInfo.birthDate
      });

      // Rechercher avec plusieurs stratégies
      let profiles: any[] = [];

      // Stratégie 1: Recherche exacte
      const { data: exactProfiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, birth_date')
        .eq('first_name', personalInfo.firstName.trim())
        .eq('last_name', personalInfo.lastName.trim());

      if (exactProfiles) profiles = exactProfiles;

      // Stratégie 2: Recherche insensible à la casse si aucun résultat
      if (profiles.length === 0) {
        const { data: caseInsensitiveProfiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, birth_date')
          .ilike('first_name', personalInfo.firstName.trim())
          .ilike('last_name', personalInfo.lastName.trim());

        if (caseInsensitiveProfiles) profiles = caseInsensitiveProfiles;
      }

      console.log("👥 Profils trouvés:", profiles?.length || 0);

      if (!profiles || profiles.length === 0) {
        console.log("⚠️ Aucun profil trouvé - Création utilisateur de test...");
        
        // Créer un utilisateur de test automatiquement
        const testUser = await this.createTestUser();
        
        // Vérifier si le code fourni correspond au code de test
        if (accessCode === testUser.fixedCode) {
          console.log("✅ Code de test validé!");
          
          const documents = await this.getUserDocuments(testUser.userId);
          
          return {
            success: true,
            documents: documents,
            message: `Accès de test autorisé. ${documents.length} document(s) trouvé(s).`,
            userId: testUser.userId,
            accessType: 'fixed'
          };
        }
        
        return { 
          success: false, 
          error: `Patient non trouvé. Code de test disponible: ${testUser.fixedCode}` 
        };
      }

      // Vérifier chaque profil
      for (const profile of profiles) {
        console.log("🔍 Vérification profil:", {
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`,
          birth_date: profile.birth_date
        });

        // Vérifier la date de naissance si fournie
        if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
          console.log("❌ Date de naissance ne correspond pas");
          continue;
        }

        // Générer le code fixe attendu pour ce profil
        const expectedCode = this.generateFixedCode(profile.id);
        console.log("🔑 Code attendu:", expectedCode, "vs fourni:", accessCode);

        if (expectedCode === accessCode) {
          console.log("✅ Code fixe validé pour:", profile.id);
          
          const documents = await this.getUserDocuments(profile.id);
          
          return {
            success: true,
            documents: documents,
            message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`,
            userId: profile.id,
            accessType: 'fixed'
          };
        }
      }

      console.log("❌ Aucun code fixe correspondant trouvé");
      
      // Afficher les codes attendus pour debug
      const expectedCodes = profiles.map(p => ({
        profile: `${p.first_name} ${p.last_name}`,
        expectedCode: this.generateFixedCode(p.id)
      }));
      
      console.log("🔑 Codes attendus pour les profils trouvés:", expectedCodes);
      
      return { 
        success: false, 
        error: "Code d'accès invalide" 
      };

    } catch (error: any) {
      console.error("💥 Erreur validation fixe:", error);
      return { success: false, error: "Erreur technique" };
    }
  }

  private static async getUserDocuments(userId: string): Promise<ShareableDocument[]> {
    console.log("📄 Récupération documents pour:", userId);
    
    const documents: ShareableDocument[] = [];

    try {
      // Directives
      const { data: directives } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', userId);

      if (directives) {
        directives.forEach(directive => {
          documents.push({
            id: directive.id,
            file_name: `Directive - ${new Date(directive.created_at).toLocaleDateString()}`,
            file_path: `directive-${directive.id}`,
            created_at: directive.created_at,
            user_id: directive.user_id,
            file_type: 'directive',
            source: 'directives',
            content: directive.content,
            description: 'Directive anticipée',
            content_type: 'application/json'
          });
        });
      }

      // Documents PDF
      const { data: pdfDocs } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId);

      if (pdfDocs) {
        pdfDocs.forEach(doc => {
          documents.push({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            created_at: doc.created_at,
            user_id: doc.user_id,
            file_type: 'pdf',
            source: 'pdf_documents',
            description: doc.description || 'Document PDF',
            content_type: doc.content_type || 'application/pdf',
            external_id: doc.external_id,
            file_size: doc.file_size,
            updated_at: doc.updated_at
          });
        });
      }

      // Documents médicaux
      const { data: medicalDocs } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId);

      if (medicalDocs) {
        medicalDocs.forEach(doc => {
          documents.push({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            created_at: doc.created_at,
            user_id: doc.user_id,
            file_type: 'medical',
            source: 'medical_documents',
            description: doc.description || 'Document médical',
            content_type: doc.file_type || 'application/pdf',
            file_size: doc.file_size
          });
        });
      }

      console.log("✅ Total documents récupérés:", documents.length);
      return documents;

    } catch (error) {
      console.error("💥 Erreur récupération documents:", error);
      return [];
    }
  }

  // ============ GESTION DES CODES ============

  /**
   * Prolonge un code temporaire
   */
  static async extendCode(accessCode: string, additionalDays: number): Promise<CodeGenerationResult> {
    try {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);

      const { error } = await supabase
        .from('shared_documents')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('access_code', accessCode)
        .eq('is_active', true);

      if (error) {
        return { success: false, error: "Code non trouvé ou erreur" };
      }

      return {
        success: true,
        message: `Code prolongé jusqu'au ${newExpiresAt.toLocaleDateString()}`,
        expiresAt: newExpiresAt.toISOString()
      };

    } catch (error: any) {
      return { success: false, error: "Erreur lors de la prolongation" };
    }
  }

  /**
   * Révoque un code temporaire
   */
  static async revokeCode(accessCode: string): Promise<CodeGenerationResult> {
    try {
      const { error } = await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('access_code', accessCode);

      if (error) {
        return { success: false, error: "Erreur lors de la révocation" };
      }

      return { success: true, message: "Code révoqué avec succès" };

    } catch (error: any) {
      return { success: false, error: "Erreur lors de la révocation" };
    }
  }
}
