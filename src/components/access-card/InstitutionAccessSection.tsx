
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Loader2, Copy, Check, Share2, Shield, AlertTriangle } from "lucide-react";
import { generateInstitutionCode } from "@/utils/institutionCodeGenerator";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InstitutionAccessSectionProps {
  userId?: string;
}

const InstitutionAccessSection = ({ userId }: InstitutionAccessSectionProps) => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerateInstitutionCode = async () => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Check for real directives first (not test directives)
      const { data: realDirectives, error: directivesError } = await supabase
        .from('directives')
        .select('id, content')
        .eq('user_id', userId)
        .or('content->created_for_institution_access.is.null,content->created_for_institution_access.neq.true')
        .limit(1);
      
      if (directivesError) {
        throw new Error("Erreur lors de la vérification des directives");
      }
      
      let directiveId: string;
      
      if (!realDirectives || realDirectives.length === 0) {
        // Check if user only has test directives
        const { data: testDirectives } = await supabase
          .from('directives')
          .select('id')
          .eq('user_id', userId)
          .eq('content->created_for_institution_access', 'true');
          
        if (testDirectives && testDirectives.length > 0) {
          toast({
            title: "Directives manquantes",
            description: "Vous devez d'abord créer vos directives anticipées pour générer un code d'accès professionnel.",
            variant: "destructive"
          });
          return;
        }
        
        // Create a minimal directive for this user
        const { data: newDirective, error: createError } = await supabase
          .from('directives')
          .insert({
            user_id: userId,
            content: { 
              title: "Directives anticipées",
              created_at: new Date().toISOString()
            }
          })
          .select('id')
          .single();
          
        if (createError || !newDirective) {
          throw new Error("Impossible de créer une directive");
        }
        
        directiveId = newDirective.id;
      } else {
        directiveId = realDirectives[0].id;
      }
      
      const code = await generateInstitutionCode(directiveId);
      
      if (code) {
        setInstitutionCode(code);
        setIsDialogOpen(true);
        toast({
          title: "Code d'accès professionnel généré",
          description: "Code généré avec succès (valide 30 jours)",
        });
      } else {
        throw new Error("Impossible de générer le code");
      }
    } catch (error) {
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
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important :</strong> Assurez-vous d'avoir rédigé vos directives anticipées 
              avant de générer un code d'accès professionnel.
            </AlertDescription>
          </Alert>
          
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
