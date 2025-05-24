
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "@/hooks/sharing/types";

export const useInstitutionCodeGeneration = () => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const generateInstitutionCode = async (
    document: ShareableDocument, 
    expiresInDays: number = 30
  ): Promise<string | null> => {
    console.log("=== GÉNÉRATION CODE INSTITUTION (UNIFIED) ===");
    console.log("Document:", document, "Expires in days:", expiresInDays);

    setIsGenerating(true);
    setShareError(null);

    try {
      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Update the directive with institution code
      const institutionCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { error: updateError } = await supabase
        .from('directives')
        .update({
          institution_code: institutionCode,
          institution_code_expires_at: expiresAt.toISOString()
        })
        .eq('id', document.id)
        .eq('user_id', document.user_id);

      if (updateError) {
        console.error("Erreur mise à jour directive:", updateError);
        throw new Error("Impossible de générer le code d'accès");
      }

      console.log("Code d'accès institution généré:", institutionCode);
      return institutionCode;
    } catch (error) {
      console.error("Erreur génération code institution:", error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de générer le code d'accès professionnel";
      setShareError(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInstitutionCode = async (userId: string) => {
    console.log("=== GÉNÉRATION CODE INSTITUTION (UI) ===");
    console.log("User ID:", userId);

    if (!userId) {
      console.error("No user ID provided");
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Vérifier d'abord s'il existe des directives pour cet utilisateur
      console.log("Vérification des directives existantes...");
      const { data: existingDirectives, error: checkError } = await supabase
        .from('directives')
        .select('id, content')
        .eq('user_id', userId)
        .limit(1);
      
      console.log("Résultat vérification directives:", { existingDirectives, checkError });
      
      if (checkError) {
        console.error("Erreur vérification directives:", checkError);
        throw new Error("Erreur lors de la vérification des directives");
      }
      
      let document: ShareableDocument;
      
      if (!existingDirectives || existingDirectives.length === 0) {
        console.log("Aucune directive trouvée, création d'une nouvelle...");
        // Créer une nouvelle directive minimale
        const { data: newDirective, error: createError } = await supabase
          .from('directives')
          .insert({
            user_id: userId,
            content: { 
              title: "Directives anticipées",
              created_at: new Date().toISOString(),
              created_for_institution_access: true
            }
          })
          .select('id, content')
          .single();
          
        console.log("Résultat création directive:", { newDirective, createError });
          
        if (createError || !newDirective) {
          console.error("Échec création directive:", createError);
          throw new Error("Impossible de créer une directive");
        }
        
        document = {
          id: newDirective.id,
          file_name: "Directives anticipées",
          file_path: "",
          created_at: new Date().toISOString(),
          user_id: userId,
          file_type: "directive",
          source: "directives",
          content: newDirective.content
        };
        
        console.log("Nouvelle directive créée:", document);
      } else {
        document = {
          id: existingDirectives[0].id,
          file_name: "Directives anticipées",
          file_path: "",
          created_at: new Date().toISOString(),
          user_id: userId,
          file_type: "directive",
          source: "directives",
          content: existingDirectives[0].content
        };
        
        console.log("Directive existante utilisée:", document);
      }
      
      console.log("Génération du code d'accès institution...");
      const code = await generateInstitutionCode(document, 30); // 30 jours par défaut
      
      if (code) {
        console.log("Code d'accès institution généré:", code);
        setInstitutionCode(code);
        setIsDialogOpen(true);
        toast({
          title: "Code d'accès professionnel généré",
          description: "Code généré avec succès (valide 30 jours)",
        });
      } else {
        console.error("Échec génération code institution");
        throw new Error("Impossible de générer le code");
      }
    } catch (error) {
      console.error("Erreur génération code institution:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de générer le code d'accès professionnel",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (institutionCode) {
      navigator.clipboard.writeText(institutionCode);
      setCopied(true);
      toast({
        title: "Code copié",
        description: "Le code d'accès professionnel a été copié dans le presse-papier."
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setInstitutionCode(null);
    setCopied(false);
  };

  return {
    // Original unified interface
    generateInstitutionCode,
    isSharing: isGenerating,
    shareError,
    
    // UI-specific interface
    institutionCode,
    isGenerating,
    copied,
    isDialogOpen,
    handleGenerateInstitutionCode,
    copyToClipboard,
    handleDialogClose
  };
};
