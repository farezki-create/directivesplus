
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Share2, Copy, Check, Calendar, CreditCard } from "lucide-react";
import { useUnifiedSharing } from "@/hooks/sharing/useUnifiedSharing";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AccessCard } from "@/components/documents/sharing/AccessCard";

interface AccessCodeGeneratorProps {
  onCodeGenerated?: (code: string) => void;
}

export const AccessCodeGenerator = ({ onCodeGenerated }: AccessCodeGeneratorProps) => {
  const { user, profile } = useAuth();
  const { generateInstitutionCode, isGenerating } = useUnifiedSharing();
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const handleGenerateCode = async () => {
    if (!user?.id || !profile) {
      toast({
        title: "Erreur",
        description: "Profil utilisateur requis",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("=== DÉBUT GÉNÉRATION CODE D'ACCÈS ===");
      console.log("User ID:", user.id);

      // Vérifier ou créer une directive
      let { data: directives, error: checkError } = await supabase
        .from('directives')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1);

      if (checkError) {
        console.error("Erreur vérification directives:", checkError);
        throw new Error("Erreur lors de la vérification des directives");
      }

      let directiveId: string;
      let directiveContent: any;

      if (!directives || directives.length === 0) {
        console.log("Création d'une nouvelle directive...");
        
        const { data: newDirective, error: createError } = await supabase
          .from('directives')
          .insert({
            user_id: user.id,
            content: {
              title: "Directives anticipées",
              created_at: new Date().toISOString(),
              patient: {
                nom: profile.last_name || '',
                prenom: profile.first_name || '',
                date_naissance: profile.birth_date || ''
              },
              created_for_access: true
            },
            is_active: true
          })
          .select('id, content')
          .single();

        if (createError || !newDirective) {
          console.error("Erreur création directive:", createError);
          throw new Error("Impossible de créer une directive");
        }

        directiveId = newDirective.id;
        directiveContent = newDirective.content;
        console.log("Nouvelle directive créée:", directiveId);
      } else {
        directiveId = directives[0].id;
        directiveContent = directives[0].content;
        console.log("Directive existante utilisée:", directiveId);
      }

      // Créer le document partageable
      const shareableDocument = {
        id: directiveId,
        file_name: "Directives anticipées",
        file_path: "",
        created_at: new Date().toISOString(),
        user_id: user.id,
        file_type: "directive",
        source: "directives" as const,
        content: directiveContent
      };

      console.log("Document partageable créé:", shareableDocument);

      // Générer le code d'accès (validité 12 mois)
      const code = await generateInstitutionCode(shareableDocument, 365);
      
      if (code) {
        console.log("Code généré avec succès:", code);
        setAccessCode(code);
        onCodeGenerated?.(code);
        toast({
          title: "Code généré",
          description: "Code d'accès valable 12 mois créé avec succès"
        });
      }
    } catch (error: any) {
      console.error("Erreur génération code:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le code d'accès",
        variant: "destructive"
      });
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
          Code d'accès professionnel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!accessCode ? (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <Calendar className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Générez un code sécurisé valable <strong>12 mois</strong> pour permettre 
                aux professionnels de santé d'accéder à vos directives anticipées.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Share2 className="mr-2 h-4 w-4" />
              Générer un code d'accès
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Code généré avec succès !</strong><br />
                Valable 12 mois. Partagez ce code avec vos professionnels de santé.
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
                <strong>Important :</strong> Ne partagez ce code qu'avec des professionnels 
                de santé de confiance. Tous les accès sont journalisés.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
