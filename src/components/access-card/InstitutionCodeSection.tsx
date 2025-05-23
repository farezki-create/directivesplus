
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { generateInstitutionCode } from "@/utils/institutionCodeGenerator";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InstitutionCodeSectionProps {
  userId?: string;
}

const InstitutionCodeSection = ({ userId }: InstitutionCodeSectionProps) => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateInstitutionCode = async () => {
    console.log("Button clicked - handleGenerateInstitutionCode called");
    console.log("UserId:", userId);
    
    if (!userId) {
      console.log("No userId provided");
      toast({
        title: "Erreur",
        description: "Utilisateur non authentifié",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Starting institution code generation process");
      
      // First, check if user has any directives
      console.log("Checking for existing directives for user:", userId);
      const { data: existingDirectives, error: directivesError } = await supabase
        .from('directives')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (directivesError) {
        console.error("Error checking directives:", directivesError);
        throw new Error("Erreur lors de la vérification des directives");
      }
      
      console.log("Existing directives found:", existingDirectives?.length || 0);
      
      let directiveId: string;
      
      if (!existingDirectives || existingDirectives.length === 0) {
        console.log("No existing directives found, creating a new one");
        
        // Create a minimal directive for this user
        const { data: newDirective, error: createError } = await supabase
          .from('directives')
          .insert({
            user_id: userId,
            content: { 
              title: "Directive de test pour code institution",
              created_for_institution_access: true,
              created_at: new Date().toISOString()
            }
          })
          .select('id')
          .single();
          
        if (createError || !newDirective) {
          console.error("Error creating directive:", createError);
          throw new Error("Impossible de créer une directive");
        }
        
        directiveId = newDirective.id;
        console.log("Created new directive with ID:", directiveId);
      } else {
        directiveId = existingDirectives[0].id;
        console.log("Using existing directive with ID:", directiveId);
      }
      
      console.log("Generating institution code for directive:", directiveId);
      const code = await generateInstitutionCode(directiveId);
      
      if (code) {
        console.log("Institution code generated successfully:", code);
        setInstitutionCode(code);
        toast({
          title: "Code d'institution généré",
          description: `Code: ${code} (valide 30 jours)`,
        });
      } else {
        console.log("Failed to generate institution code");
        throw new Error("Impossible de générer le code");
      }
    } catch (error) {
      console.error("Error in handleGenerateInstitutionCode:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de générer le code d'institution",
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
