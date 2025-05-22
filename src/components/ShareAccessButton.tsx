
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { createSharedProfile } from "@/utils/sharedProfilesUtils";
import { toast } from "@/hooks/use-toast";
import { Share, Copy, Check, RefreshCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ShareAccessButtonProps {
  userId: string;
  profileData: {
    first_name: string;
    last_name: string;
    birth_date: string;
  };
  medicalProfileId?: string;
}

export const ShareAccessButton = ({ userId, profileData, medicalProfileId }: ShareAccessButtonProps) => {
  const [open, setOpen] = useState(false);
  const [expiryDays, setExpiryDays] = useState<string>("7");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const days = parseInt(expiryDays);
      const code = await createSharedProfile(
        userId,
        profileData,
        medicalProfileId,
        days > 0 ? days : undefined
      );
      
      if (code) {
        setGeneratedCode(code);
        toast({
          title: "Code généré",
          description: "Le code d'accès a été généré avec succès"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de générer un code d'accès"
        });
      }
    } catch (err) {
      console.error("Error generating access code:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du code d'accès"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = async () => {
    if (!generatedCode) return;
    
    try {
      const shareUrl = `${window.location.origin}/mes-directives`;
      
      await navigator.clipboard.writeText(`Code d'accès à vos directives: ${generatedCode}
Accédez à vos directives à cette adresse: ${shareUrl}`);
      
      setCopied(true);
      toast({
        title: "Copié",
        description: "Les informations d'accès ont été copiées dans le presse-papier",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier les informations"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          <span>Partager l'accès</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager l'accès à vos directives</DialogTitle>
          <DialogDescription>
            Créez un code d'accès pour permettre à quelqu'un d'accéder à vos directives sans compte.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!generatedCode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="expiry">Durée de validité</Label>
                <Select value={expiryDays} onValueChange={setExpiryDays}>
                  <SelectTrigger id="expiry">
                    <SelectValue placeholder="Sélectionner une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 jour</SelectItem>
                    <SelectItem value="3">3 jours</SelectItem>
                    <SelectItem value="7">1 semaine</SelectItem>
                    <SelectItem value="30">1 mois</SelectItem>
                    <SelectItem value="0">Sans limite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleGenerateCode} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Génération..." : "Générer un code d'accès"}
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Utilisez ce code pour partager l'accès à vos directives:
              </p>
              <div className="flex items-center gap-2">
                <Input 
                  value={generatedCode} 
                  readOnly 
                  className="font-mono text-center"
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-xs text-gray-500">
                <strong>Lien d'accès:</strong> {window.location.origin}/mes-directives
              </p>
              
              <div className="text-xs text-gray-500 mt-2">
                {expiryDays === "0" 
                  ? "Ce code reste valide jusqu'à sa révocation."
                  : `Ce code expire dans ${expiryDays} jour${parseInt(expiryDays) > 1 ? 's' : ''}.`
                }
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          {generatedCode && (
            <Button 
              variant="secondary"
              onClick={() => setGeneratedCode(null)}
              size="sm"
              className="gap-1"
            >
              <RefreshCcw className="h-3 w-3" />
              Nouveau code
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
