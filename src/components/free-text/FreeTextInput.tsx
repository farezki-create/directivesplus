
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import SignatureCanvas from 'react-signature-canvas';
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface FreeTextInputProps {
  userId: string;
}

export function FreeTextInput({ userId }: FreeTextInputProps) {
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const sigCanvas = React.useRef<SignatureCanvas>(null);

  // Fetch existing free text when component mounts
  useEffect(() => {
    const fetchFreeText = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("questionnaire_synthesis")
          .select("free_text, signature")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching free text:", error);
          return;
        }

        if (data) {
          setFreeText(data.free_text || "");
          setInitialText(data.free_text || "");
          if (data.signature) {
            setSignature(data.signature);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFreeText();
    }
  }, [userId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Check if a record already exists
      const { data, error: fetchError } = await supabase
        .from("questionnaire_synthesis")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking for existing synthesis:", fetchError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des données existantes.",
          variant: "destructive",
        });
        return;
      }

      let error;
      const signatureData = sigCanvas.current && showSignature
        ? sigCanvas.current.toDataURL('image/png')
        : signature;
      
      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("questionnaire_synthesis")
          .update({
            free_text: freeText,
            signature: signatureData,
          })
          .eq("id", data.id);
          
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("questionnaire_synthesis")
          .insert({
            user_id: userId,
            free_text: freeText,
            signature: signatureData,
          });
          
        error = insertError;
      }

      if (error) {
        console.error("Error saving free text:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre texte. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      setInitialText(freeText);
      setSignature(signatureData);
      setShowSignature(false);
      toast({
        title: "Succès",
        description: "Vos directives anticipées ont été enregistrées.",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const hasChanges = freeText !== initialText || showSignature;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('synthesisTitle')}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {t('synthesisDescription')}
        </p>
      </div>
      
      <Textarea
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder={t('writeSynthesis')}
        className="min-h-[200px]"
      />
      
      {!showSignature && !signature && (
        <Button
          onClick={() => setShowSignature(true)}
          className="w-full"
        >
          Ajouter ma signature
        </Button>
      )}

      {signature && !showSignature && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Signature existante:</p>
          <Card className="p-4 flex justify-center">
            <img src={signature} alt="Signature" className="max-h-[150px]" />
          </Card>
          <Button
            onClick={() => setShowSignature(true)}
            variant="outline"
            className="w-full"
          >
            Modifier ma signature
          </Button>
        </div>
      )}
      
      {showSignature && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Veuillez signer ci-dessous:</p>
          <Card className="p-2 border-2 border-gray-300">
            <SignatureCanvas 
              ref={sigCanvas}
              canvasProps={{
                className: 'w-full h-[250px]'
              }}
            />
          </Card>
          <div className="flex gap-2">
            <Button 
              onClick={clearSignature} 
              variant="outline"
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Effacer
            </Button>
            <Button 
              onClick={() => setShowSignature(false)} 
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              Confirmer
            </Button>
          </div>
        </div>
      )}
      
      <Button
        onClick={handleSubmit}
        disabled={loading || !hasChanges}
        className="w-full"
      >
        {loading ? t('saving') : "Enregistrer mes directives anticipées"}
      </Button>
    </div>
  );
}
