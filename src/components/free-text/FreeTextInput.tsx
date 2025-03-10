
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import SignatureCanvas from 'react-signature-canvas';
import { Card } from "@/components/ui/card";
import { Check, X, Save, FileSignature } from "lucide-react";

interface FreeTextInputProps {
  userId: string;
  onSaveComplete?: () => void;
  onSignComplete?: () => void;
}

export function FreeTextInput({ userId, onSaveComplete, onSignComplete }: FreeTextInputProps) {
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const sigCanvas = useRef<SignatureCanvas>(null);

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
            setIsSaved(true);
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
      
      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("questionnaire_synthesis")
          .update({
            free_text: freeText,
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
      setIsSaved(true);
      toast({
        title: "Succès",
        description: "Vos directives anticipées ont été enregistrées.",
      });
      
      if (onSaveComplete) {
        onSaveComplete();
      }
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

  const handleSaveSignature = async () => {
    try {
      setLoading(true);
      
      if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
        toast({
          title: "Erreur",
          description: "Veuillez signer avant de confirmer.",
          variant: "destructive",
        });
        return;
      }
      
      const signatureData = sigCanvas.current.toDataURL('image/png');
      
      // First save to questionnaire_synthesis
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

      let synthError;
      if (data) {
        const { error } = await supabase
          .from("questionnaire_synthesis")
          .update({ signature: signatureData })
          .eq("id", data.id);
        synthError = error;
      } else {
        const { error } = await supabase
          .from("questionnaire_synthesis")
          .insert({
            user_id: userId,
            free_text: freeText,
            signature: signatureData
          });
        synthError = error;
      }

      if (synthError) {
        throw synthError;
      }
      
      // Then save to user_signatures for reuse across PDFs
      const { data: sigData } = await supabase
        .from('user_signatures')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
        
      let sigError;
      if (sigData) {
        const { error } = await supabase
          .from('user_signatures')
          .update({ signature_data: signatureData })
          .eq('user_id', userId);
        sigError = error;
      } else {
        const { error } = await supabase
          .from('user_signatures')
          .insert({
            user_id: userId,
            signature_data: signatureData
          });
        sigError = error;
      }
      
      if (sigError) {
        throw sigError;
      }
      
      setSignature(signatureData);
      setShowSignature(false);
      toast({
        title: "Succès",
        description: "Votre signature a été enregistrée.",
      });
      
      if (onSignComplete) {
        onSignComplete();
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre signature. Veuillez réessayer.",
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

  const hasChanges = freeText !== initialText;

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
      
      {/* Step 1: Save Content */}
      <Button
        onClick={handleSubmit}
        disabled={loading || !hasChanges}
        className="w-full"
      >
        <Save className="mr-2 h-4 w-4" />
        Enregistrer mes directives anticipées
      </Button>
      
      {/* Step 2: Show Signature Section after saving */}
      {isSaved && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Signer le document</h3>
          <p className="text-sm text-gray-500">
            Merci d'avoir enregistré vos directives. Veuillez maintenant signer pour valider ce document.
          </p>
          
          {!showSignature && !signature && (
            <Button
              onClick={() => setShowSignature(true)}
              className="w-full"
            >
              <FileSignature className="mr-2 h-4 w-4" />
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
                <FileSignature className="mr-2 h-4 w-4" />
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
                  onClick={handleSaveSignature} 
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirmer ma signature
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
