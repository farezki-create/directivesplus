
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AccessCodeGeneratorProps {
  onCodeGenerated?: (code: string) => void;
}

export const AccessCodeGenerator: React.FC<AccessCodeGeneratorProps> = ({
  onCodeGenerated
}) => {
  const [code, setCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCode = async () => {
    setIsGenerating(true);
    try {
      // Générer un code simple pour l'instant
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCode(generatedCode);
      
      if (onCodeGenerated) {
        onCodeGenerated(generatedCode);
      }
      
      toast({
        title: "Code généré",
        description: "Votre code d'accès personnel a été généré"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'accès",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code copié",
        description: "Le code a été copié dans le presse-papier"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Génération de code d'accès</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!code ? (
          <Button 
            onClick={generateCode}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Générer un code d'accès
          </Button>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Votre code d'accès personnel a été généré avec succès
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <span className="font-mono text-xl font-bold">{code}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
