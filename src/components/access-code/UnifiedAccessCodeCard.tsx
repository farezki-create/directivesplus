
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Share2, Clock, Shield, CreditCard, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessCode } from "@/hooks/useAccessCode";
import { AccessCard } from "@/components/documents/sharing/AccessCard";

/**
 * Composant unifié pour la gestion des codes d'accès
 */
export const UnifiedAccessCodeCard = () => {
  const { user, profile } = useAuth();
  const { 
    isGenerating, 
    currentCode, 
    getFixedCode, 
    generateTemporaryCode, 
    copyCode 
  } = useAccessCode();
  
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Charger le code fixe au montage
  useEffect(() => {
    if (user?.id) {
      const code = getFixedCode(user.id);
      setFixedCode(code);
    }
  }, [user?.id, getFixedCode]);

  // Afficher la confirmation et masquer après 3 secondes
  useEffect(() => {
    if (currentCode && !isGenerating) {
      setShowConfirmation(true);
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentCode, isGenerating]);

  const handleCopyCode = (code: string) => {
    copyCode(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateTemporaryCode = async () => {
    if (!user?.id) return;
    
    console.log("🎬 Composant: Début génération code temporaire");
    await generateTemporaryCode(user.id, {
      expiresInDays: 30,
      requirePersonalInfo: true
    });
    console.log("🏁 Composant: Fin génération code temporaire");
  };

  const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Utilisateur';

  // Affichage de la confirmation d'enregistrement
  if (showConfirmation && currentCode) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Code temporaire enregistré avec succès !
              </h3>
              <p className="text-green-700 mb-4">
                Votre code d'accès temporaire a été généré et enregistré en base de données.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
                <span className="font-mono text-xl tracking-[0.2em] font-bold text-green-800">
                  {currentCode}
                </span>
              </div>
              
              <p className="text-sm text-green-600">
                Ce code est valable 30 jours et donne accès à tous vos documents.
              </p>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => handleCopyCode(currentCode)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copier le code
              </Button>
              
              <Button 
                onClick={() => setShowConfirmation(false)}
                className="flex items-center gap-2"
              >
                Continuer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showCard && fixedCode) {
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
            directivesCode={fixedCode}
          />
          
          <Button 
            onClick={() => setShowCard(false)}
            variant="outline"
            className="w-full mt-6"
          >
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Code d'accès permanent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Code d'accès permanent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Code personnel permanent</strong><br />
              Ce code vous est propre et ne change jamais. Partagez-le avec vos professionnels de santé.
            </AlertDescription>
          </Alert>

          {fixedCode && (
            <>
              <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <span className="font-mono text-2xl tracking-[0.3em] font-bold text-green-800">
                  {fixedCode}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopyCode(fixedCode)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => handleCopyCode(fixedCode)}
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Code d'accès temporaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Code d'accès temporaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Code temporaire sécurisé</strong><br />
              Générez un code temporaire avec expiration pour un partage ponctuel.
            </AlertDescription>
          </Alert>

          {currentCode && !showConfirmation && (
            <div className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <span className="font-mono text-xl tracking-[0.2em] font-bold text-blue-800">
                {currentCode}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleCopyCode(currentCode)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button 
            onClick={handleGenerateTemporaryCode}
            disabled={isGenerating}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Share2 className="h-4 w-4" />
            {isGenerating ? "Génération en cours..." : "Générer un code temporaire"}
          </Button>
        </CardContent>
      </Card>

      {/* Informations de debug */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Sécurité :</strong> Le code permanent est calculé à partir de votre profil et ne change jamais. 
          Les codes temporaires expirent automatiquement et peuvent être révoqués à tout moment.
        </AlertDescription>
      </Alert>
    </div>
  );
};
