
import { useState } from "react";
import { useSharedCodeGeneration } from "@/hooks/useSharedCodeGeneration";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Share, Copy, Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ShareCodeButtonProps {
  documentId: string;
  onCodeGenerated?: (code: string) => void;
}

export const ShareCodeButton = ({ documentId, onCodeGenerated }: ShareCodeButtonProps) => {
  const [open, setOpen] = useState(false);
  const [expiryDays, setExpiryDays] = useState<string>("7");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { generateSharedCode, loading } = useSharedCodeGeneration();
  
  const handleGenerateCode = async () => {
    const days = parseInt(expiryDays);
    const { success, sharedCode } = await generateSharedCode(documentId, days);
    
    if (success && sharedCode) {
      setGeneratedCode(sharedCode);
      if (onCodeGenerated) {
        onCodeGenerated(sharedCode);
      }
    }
  };
  
  const copyToClipboard = async () => {
    if (!generatedCode) return;
    
    const shareUrl = `${window.location.origin}/consultation/${generatedCode}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copié",
        description: "Lien de partage copié dans le presse-papier",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien"
      });
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          <span>Partager</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="font-medium text-sm">Partager ce document médical</div>
          
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
                {loading ? "Génération..." : "Générer un code de partage"}
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Utilisez ce lien pour partager votre dossier médical:
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-md flex-grow text-center font-mono">
                  {generatedCode}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                {expiryDays === "0" 
                  ? "Ce code reste valide jusqu'à sa révocation."
                  : `Ce code expire dans ${expiryDays} jour${parseInt(expiryDays) > 1 ? 's' : ''}.`
                }
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setGeneratedCode(null)}
              >
                Régénérer un code
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
