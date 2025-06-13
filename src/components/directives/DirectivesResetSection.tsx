
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const DirectivesResetSection: React.FC = () => {
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour réinitialiser vos directives",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    
    try {
      // Supprimer les réponses aux questionnaires
      const { error: responsesError } = await supabase
        .from("questionnaire_responses")
        .delete()
        .eq("user_id", user.id);

      if (responsesError) {
        console.error("Erreur suppression réponses:", responsesError);
      }

      // Supprimer les phrases personnalisées
      const { error: phrasesError } = await supabase
        .from("custom_phrases")
        .delete()
        .eq("user_id", user.id);

      if (phrasesError) {
        console.error("Erreur suppression phrases:", phrasesError);
      }

      // Supprimer les personnes de confiance
      const { error: trustedError } = await supabase
        .from("trusted_persons")
        .delete()
        .eq("user_id", user.id);

      if (trustedError) {
        console.error("Erreur suppression personnes de confiance:", trustedError);
      }

      // Supprimer les documents de directives
      const { error: documentsError } = await supabase
        .from("user_documents")
        .delete()
        .eq("user_id", user.id)
        .eq("document_type", "directive");

      if (documentsError) {
        console.error("Erreur suppression documents:", documentsError);
      }

      toast({
        title: "Réinitialisation réussie",
        description: "Toutes vos directives anticipées ont été supprimées. Vous pouvez maintenant démarrer une nouvelle rédaction.",
      });

      setShowConfirm(false);
      
      // Optionnel : recharger la page pour refléter les changements
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la réinitialisation",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (!showConfirm) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <RotateCcw className="h-5 w-5" />
            Réinitialiser mes directives
          </CardTitle>
          <CardDescription className="text-orange-700">
            Supprimez toutes vos directives anticipées pour repartir de zéro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700 mb-4">
            Cette action supprimera définitivement tous vos questionnaires remplis, 
            phrases personnalisées, personnes de confiance et documents générés.
          </p>
          <Button 
            onClick={() => setShowConfirm(true)}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-100"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Réinitialiser mes directives
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          Confirmer la réinitialisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Attention !</strong> Cette action est irréversible. 
            Toutes vos directives anticipées seront définitivement supprimées.
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleReset}
            disabled={isResetting}
            variant="destructive"
            className="flex-1"
          >
            {isResetting ? "Suppression..." : "Oui, tout supprimer"}
          </Button>
          <Button 
            onClick={() => setShowConfirm(false)}
            variant="outline"
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
