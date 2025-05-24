
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Share2, Copy, Check, Calendar, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { AccessCard } from "@/components/documents/sharing/AccessCard";

interface AccessCodeGeneratorProps {
  onCodeGenerated?: (code: string) => void;
}

export const AccessCodeGenerator = ({ onCodeGenerated }: AccessCodeGeneratorProps) => {
  const { user, profile } = useAuth();
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Générer un code fixe basé sur l'ID utilisateur
  const generateFixedCode = (userId: string): string => {
    // Utiliser les 8 premiers caractères de l'ID utilisateur en majuscules
    // et remplacer les caractères non alphanumériques par des chiffres
    const baseCode = userId.replace(/-/g, '').substring(0, 8).toUpperCase();
    
    // S'assurer que le code fait exactement 8 caractères
    const paddedCode = baseCode.padEnd(8, '0');
    
    // Remplacer certains caractères pour éviter la confusion (0 -> O, 1 -> I, etc.)
    return paddedCode
      .replace(/0/g, 'O')
      .replace(/1/g, 'I')
      .replace(/5/g, 'S')
      .substring(0, 8);
  };

  // Charger le code fixe au montage du composant
  useEffect(() => {
    if (user?.id) {
      const fixedCode = generateFixedCode(user.id);
      setAccessCode(fixedCode);
      onCodeGenerated?.(fixedCode);
    }
  }, [user?.id, onCodeGenerated]);

  const handleGenerateCode = async () => {
    if (!user?.id || !profile) {
      toast({
        title: "Erreur",
        description: "Profil utilisateur requis",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simuler un petit délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fixedCode = generateFixedCode(user.id);
      setAccessCode(fixedCode);
      onCodeGenerated?.(fixedCode);
      
      toast({
        title: "Code d'accès permanent",
        description: "Votre code d'accès personnel est maintenant disponible"
      });
    } catch (error: any) {
      console.error("Erreur affichage code:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le code d'accès",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      setCopied(true);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papier"
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Utilisateur';

  if (showCard && accessCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Carte d'accès personnelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AccessCard
            name={userName}
            birthDate={profile?.birth_date}
            directivesCode={accessCode}
          />
          
          <div className="mt-6 flex gap-2">
            <Button 
              onClick={() => setShowCard(false)}
              variant="outline"
              className="flex-1"
            >
              Retour
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-directiveplus-600" />
          Code d'accès personnel permanent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!accessCode ? (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <Calendar className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Votre code d'accès personnel permanent vous permet d'accéder 
                à vos directives anticipées à tout moment.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleGenerateCode}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Share2 className="mr-2 h-4 w-4" />
              Afficher mon code d'accès
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Code d'accès permanent !</strong><br />
                Ce code vous est personnel et ne change jamais. Partagez-le avec vos professionnels de santé.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <span className="font-mono text-2xl tracking-[0.3em] font-bold text-green-800">
                {accessCode}
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

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copier
              </Button>

              <Button 
                onClick={() => setShowCard(true)}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Voir la carte
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Code permanent :</strong> Ce code ne change jamais et vous est 
                personnel. Vous pouvez le partager en toute sécurité avec vos professionnels de santé.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
