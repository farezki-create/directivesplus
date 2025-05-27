
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { saveDirectivesWithDualStorage } from "@/utils/directives/directivesStorage";
import { useNavigate } from "react-router-dom";

/**
 * Hook pour gérer les actions de synthèse des directives
 */
export const useSynthesisActions = (userId?: string) => {
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Fonction pour sauvegarder et générer le PDF des directives
   */
  const handleSaveAndGeneratePDF = async (freeText: string, data: any) => {
    if (!user && !userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos directives",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    try {
      setSaving(true);

      console.log("=== DÉBUT SAUVEGARDE ET GÉNÉRATION PDF ===");
      console.log("UserId utilisé:", userId || user?.id);
      console.log("Données reçues dans handleSaveAndGeneratePDF:", {
        freeText,
        dataKeys: Object.keys(data || {}),
        data: data,
        hasProfileData: !!data?.profileData,
        hasResponses: !!data?.responses,
        hasExamplePhrases: !!data?.examplePhrases,
        hasCustomPhrases: !!data?.customPhrases,
        hasTrustedPersons: !!data?.trustedPersons,
        signatureFromHook: signature
      });

      // Log détaillé des réponses aux questionnaires
      if (data?.responses) {
        console.log("=== ANALYSE DÉTAILLÉE DES RÉPONSES ===");
        console.log("Type des réponses:", typeof data.responses);
        console.log("Réponses complètes:", JSON.stringify(data.responses, null, 2));
        Object.entries(data.responses).forEach(([type, questions]) => {
          console.log(`Questionnaire ${type}:`, questions);
          if (typeof questions === 'object' && questions !== null) {
            console.log(`  - Nombre de questions: ${Object.keys(questions).length}`);
            Object.entries(questions).forEach(([qId, qData]) => {
              console.log(`  - Question ${qId}:`, qData);
            });
          }
        });
      }

      // Vérifier si les données sont valides
      if (!data) {
        throw new Error("Données de directives manquantes");
      }

      // Préparer les données pour le PDF avec validation
      const pdfData = {
        profileData: data.profileData,
        responses: data.responses || {}, // S'assurer qu'on a au moins un objet vide
        examplePhrases: data.examplePhrases || [],
        customPhrases: data.customPhrases || [],
        trustedPersons: data.trustedPersons || [],
        freeText: freeText || "",
        signature,
        userId: userId || user?.id,
      };

      console.log("=== DONNÉES PRÉPARÉES POUR LE PDF ===");
      console.log("Profile data:", pdfData.profileData);
      console.log("Responses data:", pdfData.responses);
      console.log("Example phrases:", pdfData.examplePhrases);
      console.log("Custom phrases:", pdfData.customPhrases);
      console.log("Trusted persons:", pdfData.trustedPersons);
      console.log("Free text length:", pdfData.freeText?.length || 0);
      console.log("Has signature:", !!pdfData.signature);

      // Générer le PDF avec les données
      let pdfOutput;
      try {
        pdfOutput = await generatePDF(pdfData);
        console.log("PDF généré avec succès, taille:", pdfOutput.length);
      } catch (pdfError: any) {
        console.error("Erreur lors de la génération du PDF:", pdfError);
        throw new Error("Impossible de générer le PDF: " + (pdfError.message || "Erreur inconnue"));
      }

      // Vérifier si le PDF a été généré correctement
      if (!pdfOutput) {
        throw new Error("Le PDF n'a pas pu être généré correctement");
      }

      // Utiliser notre fonction pour enregistrer uniquement dans le dossier accessible
      const result = await saveDirectivesWithDualStorage({
        userId: userId || user?.id || "",
        pdfOutput,
        description: "Directives anticipées générées le " + new Date().toLocaleDateString('fr-FR'),
        profileData: profile || data.profileData,
        redirectToViewer: true
      });

      if (result.success) {
        toast({
          title: "Directives enregistrées",
          description: "Vos directives anticipées ont été sauvegardées avec succès",
          duration: 2000
        });
        
        // Attendre un peu pour s'assurer que tout est bien sauvegardé
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Rediriger vers la page des directives
        if (result.accessCode) {
          console.log("Redirection vers mes-directives avec le code d'accès:", result.accessCode);
          
          // Stocker temporairement le code d'accès dans le sessionStorage
          sessionStorage.setItem('directAccessCode', result.accessCode);
          
          // Rediriger vers la page des directives existante
          navigate('/mes-directives', { replace: true });
          
          // Arrêtons l'exécution ici pour éviter toute redirection supplémentaire
          return result.documentId; 
        } else {
          // Si pas de code d'accès, rediriger vers le dashboard
          navigate('/dashboard', { replace: true });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des directives:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'enregistrement",
        variant: "destructive",
        duration: 2000
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    signature,
    setSignature,
    handleSaveAndGeneratePDF,
  };
};
