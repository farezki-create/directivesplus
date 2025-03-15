
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignatureCanvasLib from 'react-signature-canvas';
import { FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignatureCanvas } from "./SignatureCanvas";
import { SignatureDisplay } from "./SignatureDisplay";
import { SignatureActions } from "./SignatureActions";

interface SignatureComponentProps {
  userId: string;
  existingSignature: string | null;
  onSignatureSaved: (signature: string) => void;
  onConfirmExisting?: () => void;
}

export function SignatureComponent({ 
  userId, 
  existingSignature, 
  onSignatureSaved,
  onConfirmExisting
}: SignatureComponentProps) {
  const [showSignatureEditor, setShowSignatureEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const sigCanvas = useRef<SignatureCanvasLib>(null);

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
      
      onSignatureSaved(signatureData);
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

  const handleEditSignature = () => {
    setShowSignatureEditor(true);
  };

  const handleConfirmExistingSignature = () => {
    if (existingSignature && onConfirmExisting) {
      onConfirmExisting();
    }
  };

  // If there's an existing signature and we're not in edit mode, show the signature display
  if (existingSignature && !showSignatureEditor) {
    return (
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Confirmer ou modifier votre signature</h3>
        <p className="text-sm text-gray-500">
          Vous avez déjà une signature. Vous pouvez la confirmer ou la modifier.
        </p>
        
        <SignatureDisplay 
          signatureData={existingSignature}
          onEdit={handleEditSignature}
          onConfirm={handleConfirmExistingSignature}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Signer le document</h3>
      <p className="text-sm text-gray-500">
        Merci d'avoir enregistré vos directives. Veuillez maintenant signer pour valider ce document.
      </p>
      
      <div className="space-y-4">
        <SignatureCanvas 
          signatureRef={sigCanvas}
          disabled={loading}
        />
        <SignatureActions 
          onSaveSignature={handleSaveSignature}
          loading={loading}
        />
      </div>
    </div>
  );
}
