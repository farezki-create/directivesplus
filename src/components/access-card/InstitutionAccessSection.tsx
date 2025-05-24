
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Loader2, Copy, Check, Share2, Shield } from "lucide-react";
import { useUnifiedDocumentSharing } from "@/hooks/sharing/useUnifiedDocumentSharing";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ShareableDocument } from "@/hooks/sharing/types";

interface InstitutionAccessSectionProps {
  userId?: string;
}

const InstitutionAccessSection = ({ userId }: InstitutionAccessSectionProps) => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { generateInstitutionCode } = useUnifiedDocumentSharing();

  const handleGenerateInstitutionCode = async () => {
    console.log("=== GÉNÉRATION CODE INSTITUTION ===");
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

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hospital className="h-5 w-5 text-directiveplus-600" />
            Accès professionnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Générez un code temporaire sécurisé pour permettre à un professionnel de santé 
            ou une institution médicale d'accéder à vos directives anticipées.
          </p>
          
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Code sécurisé, valable 30 jours, révocable à tout moment
            </span>
          </div>
          
          <Button 
            onClick={handleGenerateInstitutionCode}
            disabled={isGenerating || !userId}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Share2 className="mr-2 h-4 w-4" />
            Générer un code d'accès professionnel
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hospital className="h-5 w-5" />
              Code d'accès professionnel généré
            </DialogTitle>
            <DialogDescription>
              Partagez ce code avec votre professionnel de santé ou institution médicale.
              Il sera valide pendant 30 jours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Code généré avec succès !</strong><br />
                Ce code permet l'accès sécurisé à vos directives avec vos informations d'identité.
              </AlertDescription>
            </Alert>
            
            {institutionCode && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-lg bg-green-50">
                  <span className="font-mono text-2xl tracking-[0.3em] font-bold text-green-800">
                    {institutionCode}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important :</strong> Ce code permet l'accès à vos directives anticipées. 
                    Ne le partagez qu'avec des professionnels de santé de confiance.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleDialogClose}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstitutionAccessSection;
