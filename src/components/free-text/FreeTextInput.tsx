
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FreeTextSection } from "./FreeTextSection";
import { SaveButton } from "./SaveButton";
import { SignButton } from "./SignButton";
import { SignatureComponent } from "./SignatureComponent";

interface FreeTextInputProps {
  userId: string;
  onSaveComplete?: () => void;
  onSignComplete?: () => void;
}

export function FreeTextInput({ userId, onSaveComplete, onSignComplete }: FreeTextInputProps) {
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialText, setInitialText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignatureSection, setShowSignatureSection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFreeText = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        console.log("[FreeTextInput] Fetching existing text for user:", userId);
        
        const { data, error } = await supabase
          .from("questionnaire_synthesis")
          .select("free_text, signature")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("[FreeTextInput] Error fetching free text:", error);
          return;
        }

        if (data) {
          console.log("[FreeTextInput] Found existing text:", data.free_text ? "Yes (length: " + data.free_text.length + ")" : "No");
          setFreeText(data.free_text || "");
          setInitialText(data.free_text || "");
          if (data.signature) {
            setSignature(data.signature);
            setIsSaved(true);
          }
        } else {
          console.log("[FreeTextInput] No existing text found");
        }
      } catch (error) {
        console.error("[FreeTextInput] Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeText();
  }, [userId]);

  const handleTextChange = (newText: string) => {
    console.log("[FreeTextInput] Text changed, new length:", newText.length);
    setFreeText(newText);
  };

  const handleSignatureSaved = (signatureData: string) => {
    setSignature(signatureData);
    setShowSignatureSection(false);
    
    toast({
      title: "Succès",
      description: "Votre signature a été enregistrée.",
    });
    
    if (onSignComplete) {
      onSignComplete();
    }
  };

  const handleConfirmSignature = async () => {
    if (!signature || !userId) return;
    
    try {
      setLoading(true);
      
      toast({
        title: "Succès",
        description: "Votre signature a été confirmée.",
      });
      
      setShowSignatureSection(false);
      
      if (onSignComplete) {
        onSignComplete();
      }
    } catch (error) {
      console.error("[FreeTextInput] Error confirming signature:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la confirmation de votre signature.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine if there are changes that need to be saved
  const hasChanges = freeText !== initialText;
  
  // Show signature options when user clicks the sign button
  const handleSignButtonClick = () => {
    setShowSignatureSection(true);
  };

  return (
    <div className="space-y-6">
      <FreeTextSection 
        freeText={freeText}
        onTextChange={handleTextChange}
      />
      
      <div className="space-y-4">
        <SaveButton
          userId={userId}
          freeText={freeText}
          hasChanges={hasChanges || freeText.trim().length > 0}
          loading={loading}
          onSaveComplete={() => {
            if (onSaveComplete) onSaveComplete();
            setIsSaved(true);
          }}
          setLoading={setLoading}
          setInitialText={setInitialText}
          setIsSaved={setIsSaved}
        />
        
        <SignButton 
          isSaved={isSaved} 
          onShowSignature={handleSignButtonClick}
          existingSignature={signature}
        />
      </div>
      
      {isSaved && showSignatureSection && (
        <SignatureComponent 
          userId={userId} 
          existingSignature={signature}
          onSignatureSaved={handleSignatureSaved}
          onConfirmExisting={handleConfirmSignature}
        />
      )}
    </div>
  );
}
