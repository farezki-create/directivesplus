
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hospital, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateInstitutionCode } from "@/utils/institutionCodeGenerator";
import { toast } from "@/components/ui/use-toast";

interface ShareInstitutionCodeButtonProps {
  directiveId: string;
}

export const ShareInstitutionCodeButton = ({ directiveId }: ShareInstitutionCodeButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [expirationDays, setExpirationDays] = useState(30);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const code = await generateInstitutionCode(directiveId, expirationDays);
      if (code) {
        setGeneratedCode(code);
        toast({
          title: "Code généré",
          description: "Le code d'accès institution a été créé avec succès"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papier"
      });
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 365) {
      setExpirationDays(value);
    }
  };

  const getExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + expirationDays);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1"
      >
        <Hospital className="h-4 w-4" />
        <span>Accès institution</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partager avec une institution médicale</DialogTitle>
            <DialogDescription>
              Générez un code d'accès temporaire pour permettre à un professionnel de santé ou une institution médicale de consulter cette directive.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expiration">Durée de validité (jours)</Label>
              <Input
                id="expiration"
                type="number"
                min={1}
                max={365}
                value={expirationDays}
                onChange={handleDaysChange}
              />
              <p className="text-xs text-muted-foreground">
                Le code expirera le {getExpirationDate()}
              </p>
            </div>

            {generatedCode && (
              <div className="space-y-2 border p-4 rounded-md bg-muted/50">
                <Label>Code d'accès institution</Label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedCode} 
                    readOnly 
                    className="font-mono text-center bg-white"
                  />
                  <Button onClick={handleCopyCode} size="sm">Copier</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Transmettez ce code à l'institution médicale ou au professionnel de santé concerné.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : generatedCode ? 'Régénérer' : 'Générer un code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
