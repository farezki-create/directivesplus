
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUnifiedSharing } from "@/hooks/sharing/useUnifiedSharing";
import type { ShareableDocument } from "@/hooks/sharing/types";

export const useInstitutionCodeGeneration = () => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { generateInstitutionCode, isGenerating, error } = useUnifiedSharing();

  const handleGenerateInstitutionCode = async (userId: string) => {
    console.log("=== GÉNÉRATION CODE INSTITUTION (NOUVEAU SYSTÈME) ===");
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
      }
    } catch (error) {
      console.error("Erreur génération code institution:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de générer le code d'accès professionnel",
        variant: "destructive"
      });
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
    // Interface unifiée
    generateInstitutionCode,
    isSharing: isGenerating,
    shareError: error,
    
    // Interface UI
    institutionCode,
    isGenerating,
    copied,
    isDialogOpen,
    handleGenerateInstitutionCode,
    copyToClipboard,
    handleDialogClose
  };
};
