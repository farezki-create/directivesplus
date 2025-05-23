
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { generateInstitutionCode } from "@/utils/institutionCodeGenerator";
import { toast } from "@/components/ui/use-toast";

interface InstitutionCodeSectionProps {
  userId?: string;
}

const InstitutionCodeSection = ({ userId }: InstitutionCodeSectionProps) => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

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
      // For testing, we'll use a dummy directive ID
      // In production, this should be the actual directive ID
      const dummyDirectiveId = userId; // Using user ID as placeholder
      
      const code = await generateInstitutionCode(dummyDirectiveId);
      if (code) {
        setInstitutionCode(code);
        toast({
          title: "Code d'institution généré",
          description: `Code: ${code} (valide 30 jours)`,
        });
      }
    } catch (error) {
      console.error("Error generating institution code:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'institution",
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
        description: "Le code d'institution a été copié dans le presse-papier."
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const openInstitutionAccess = () => {
    window.open('/acces-institution', '_blank');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hospital className="h-5 w-5 text-directiveplus-600" />
          Code d'accès institution (Test)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Générez un code temporaire pour permettre à un professionnel de santé 
          d'accéder à vos directives.
        </p>
        
        {!institutionCode ? (
          <Button 
            onClick={handleGenerateInstitutionCode}
            disabled={isGenerating || !userId}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Générer un code d'institution
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md bg-green-50">
              <span className="font-mono text-lg tracking-widest font-bold">
                {institutionCode}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="text-green-600 hover:text-green-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={openInstitutionAccess}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Tester l'accès
              </Button>
              <Button
                variant="outline"
                onClick={() => setInstitutionCode(null)}
                className="flex-1"
              >
                Nouveau code
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              <strong>Pour tester :</strong><br />
              1. Cliquez sur "Tester l'accès"<br />
              2. Entrez : AREZKI, FARID, 1963-08-13<br />
              3. Utilisez le code ci-dessus<br />
              4. Vérifiez la console pour les logs de débogage
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstitutionCodeSection;
