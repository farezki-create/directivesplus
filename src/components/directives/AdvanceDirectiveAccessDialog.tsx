
import { useState } from "react";
import { 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdvanceDirectiveAccessDialogProps {
  directive: {
    id: string;
    access_code?: string;
  };
}

export function AdvanceDirectiveAccessDialog({ directive }: AdvanceDirectiveAccessDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const handleCopyAccessCode = () => {
    if (!directive.access_code) return;
    
    navigator.clipboard.writeText(directive.access_code)
      .then(() => {
        setCopied(true);
        toast({
          title: "Code d'accès copié",
          description: "Le code d'accès a été copié dans le presse-papier"
        });
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast({
          title: "Erreur",
          description: "Impossible de copier le code d'accès",
          variant: "destructive"
        });
      });
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Accès aux directives anticipées</DialogTitle>
        <DialogDescription>
          Partagez ce code d'accès avec vos professionnels de santé pour qu'ils puissent consulter vos directives anticipées.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="access-code">Code d'accès</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="access-code" 
              value={directive.access_code || "Non disponible"} 
              readOnly
              className="font-mono text-center"
            />
            <Button 
              size="icon" 
              variant="outline" 
              onClick={handleCopyAccessCode}
              disabled={!directive.access_code}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Ce code est nécessaire, avec le nom et la date de naissance du patient, pour accéder aux directives.
          </p>
        </div>
        
        <div className="border rounded-md p-4 bg-muted/50">
          <h4 className="font-medium mb-2">Instructions pour les professionnels de santé</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Visitez le portail d'accès aux directives anticipées</li>
            <li>Entrez le code d'accès ci-dessus</li>
            <li>Confirmez l'identité du patient (nom, date de naissance)</li>
            <li>Accédez aux directives anticipées du patient</li>
          </ol>
        </div>
      </div>
      
      <DialogFooter className="sm:justify-start">
        <Button type="button" variant="secondary">
          Générer une nouvelle carte d'accès
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
