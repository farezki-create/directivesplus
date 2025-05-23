
import { useState } from "react";
import { generateInstitutionCode } from "@/utils/institutionCodeGenerator";
import { Button } from "@/components/ui/button";
import { Hospital, Loader2, Copy, Check, InfoIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShareInstitutionCodeButtonProps {
  directiveId: string;
}

const ShareInstitutionCodeButton = ({ directiveId }: ShareInstitutionCodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedCode = await generateInstitutionCode(directiveId);
      if (generatedCode) {
        setCode(generatedCode);
        toast({
          title: "Code généré avec succès",
          description: "Le code d'accès a été généré et est valable pendant 30 jours."
        });
      } else {
        setError("Une erreur est survenue lors de la génération du code");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la génération du code");
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'accès",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
          Accès institution
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Code d'accès institution</DialogTitle>
          <DialogDescription>
            Générez un code temporaire pour permettre à un professionnel de santé ou une institution médicale
            d'accéder à vos directives.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!code && !error && (
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
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
                  Code généré avec succès! Partagez ce code avec votre institution médicale.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted">
                <span className="font-mono text-xl tracking-widest">{code}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-center gap-2">
          {!code ? (
            <Button 
              type="button" 
              onClick={handleGenerateCode}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Générer un code
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareInstitutionCodeButton;
