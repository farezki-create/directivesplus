
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hospital, Loader2, Copy, Check, Shield, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUnifiedSharing, type ShareableDocument } from "@/hooks/sharing/useUnifiedSharing";
import { supabase } from "@/integrations/supabase/client";

interface ShareInstitutionCodeButtonProps {
  directiveId: string;
}

const ShareInstitutionCodeButton = ({ directiveId }: ShareInstitutionCodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { generateInstitutionCode, isGenerating } = useUnifiedSharing();

  const handleGenerateCode = async () => {
    setError(null);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get the directive to create a shareable document
      const { data: directive, error: directiveError } = await supabase
        .from('directives')
        .select('id, content, created_at')
        .eq('id', directiveId)
        .eq('user_id', user.id)
        .single();

      if (directiveError || !directive) {
        throw new Error("Directive not found");
      }

      // Create a shareable document object
      const shareableDocument: ShareableDocument = {
        id: directive.id,
        file_name: "Directives anticipées",
        file_path: "",
        created_at: directive.created_at,
        user_id: user.id,
        file_type: "directive",
        source: "directives",
        content: directive.content
      };

      // Generate the institution access code using the unified service
      const generatedCode = await generateInstitutionCode(shareableDocument, 30);
      
      if (generatedCode) {
        setCode(generatedCode);
        toast({
          title: "Code généré avec succès",
          description: "Le code d'accès professionnel a été généré et est valable pendant 30 jours."
        });
      } else {
        setError("Une erreur est survenue lors de la génération du code");
      }
    } catch (err: any) {
      console.error("Erreur génération code:", err);
      setError(err.message || "Une erreur est survenue lors de la génération du code");
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'accès",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papier."
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setCode(null);
      setError(null);
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Hospital className="h-4 w-4" />
          Accès professionnel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hospital className="h-5 w-5" />
            Code d'accès professionnel
          </DialogTitle>
          <DialogDescription>
            Générez un code temporaire sécurisé pour permettre à un professionnel de santé 
            ou une institution médicale d'accéder à cette directive.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {!code && !error && (
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Ce code permettra à un professionnel de santé d'accéder à vos directives avec vos informations
                personnelles (nom, prénom, date de naissance). Le code sera valide pendant 30 jours.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {code && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Code généré avec succès !</strong><br />
                  Partagez ce code avec votre professionnel de santé ou institution médicale.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <span className="font-mono text-xl tracking-[0.2em] font-bold text-green-800">
                  {code}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
        
        <div className="flex justify-end gap-2">
          {!code ? (
            <Button 
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Share2 className="h-4 w-4" />
              Générer un code
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Fermer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareInstitutionCodeButton;
