
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, Heart, Shield, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePalliativeCareAccess } from "@/hooks/usePalliativeCareAccess";

interface PalliativeCareAccessCardProps {
  patientId?: string;
  patientName?: string;
}

export const PalliativeCareAccessCard = ({ 
  patientId, 
  patientName 
}: PalliativeCareAccessCardProps) => {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { generateAccessCode, loading } = usePalliativeCareAccess();

  const handleGenerateCode = async () => {
    if (!patientId) {
      toast({
        title: "Erreur",
        description: "ID du patient requis pour générer un code d'accès",
        variant: "destructive"
      });
      return;
    }

    const code = await generateAccessCode(patientId);
    if (code) {
      setGeneratedCode(code);
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papier"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-800">
          <Heart className="h-6 w-6" />
          Carte d'Accès Suivi Palliatif
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert className="border-pink-200 bg-pink-50">
          <Shield className="h-4 w-4 text-pink-600" />
          <AlertDescription className="text-pink-800">
            <strong>Accès sécurisé au suivi des symptômes</strong><br />
            Cette carte permet aux professionnels de santé d'accéder au suivi 
            des symptômes du patient via l'accès institution sécurisé.
          </AlertDescription>
        </Alert>

        {patientName && (
          <div className="p-3 bg-white rounded-lg border">
            <label className="text-sm font-medium text-gray-600">Patient</label>
            <p className="font-semibold text-gray-900">{patientName}</p>
          </div>
        )}

        {!generatedCode ? (
          <Button 
            onClick={handleGenerateCode}
            disabled={loading || !patientId}
            className="w-full bg-pink-600 hover:bg-pink-700"
          >
            {loading ? "Génération..." : "Générer le code d'accès suivi"}
          </Button>
        ) : (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Code d'accès généré avec succès (valide 30 jours)
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Code d'accès palliatif</label>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <span className="font-mono text-lg font-bold text-pink-600">
                    {generatedCode}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCode}
                    className="ml-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Instructions pour le professionnel</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Rendez-vous sur la page "Accès Institution"</li>
                    <li>• Saisissez les informations du patient (nom, prénom, date de naissance)</li>
                    <li>• Utilisez ce code comme "Code d'accès partagé"</li>
                    <li>• Saisissez votre numéro d'identification professionnel</li>
                    <li>• Code valide pendant 30 jours</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => window.open('/acces-institution', '_blank')}
                className="w-full"
              >
                Accéder à la page Institution
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
