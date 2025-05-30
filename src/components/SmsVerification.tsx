
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBrevoSms } from "@/hooks/useBrevoSms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputSanitizer } from "@/utils/security/inputSanitization";

export default function SmsVerification() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState("");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  
  const { sendSms, isSending } = useBrevoSms();

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendCode = async () => {
    if (!phone.trim()) {
      setStatus("Veuillez saisir un numéro de téléphone");
      return;
    }

    // Sanitize phone number
    const sanitizedPhone = InputSanitizer.sanitizeField(phone, "phone");
    
    setStatus("Envoi en cours...");

    try {
      // Generate verification code
      const newCode = generateCode();
      setVerificationCode(newCode);

      // Send SMS using existing hook
      const result = await sendSms({
        to: sanitizedPhone,
        message: `Votre code de vérification est : ${newCode}`,
        sender: "DirectivesPlus"
      });

      if (result.success) {
        setStatus("Code envoyé par SMS");
        setStep("verify");
        
        // Store code temporarily in database for verification
        await supabase.rpc("send_sms_code", { phone: sanitizedPhone });
      } else {
        setStatus(result.error || "Erreur envoi SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      setStatus("Erreur lors de l'envoi du SMS");
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setStatus("Veuillez saisir le code de vérification");
      return;
    }

    if (code === verificationCode) {
      setStatus("Code vérifié avec succès !");
      // Here you can add logic for what happens after successful verification
    } else {
      setStatus("Code incorrect");
    }
  };

  if (step === "verify") {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold">Vérification SMS</h2>
        <p className="text-sm text-gray-600">
          Saisissez le code reçu par SMS au {phone}
        </p>
        <Input
          type="text"
          placeholder="Code de vérification"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleVerifyCode}
            disabled={!code.trim()}
            className="flex-1"
          >
            Vérifier
          </Button>
          <Button
            onClick={() => {
              setStep("phone");
              setCode("");
              setStatus("");
            }}
            variant="outline"
          >
            Retour
          </Button>
        </div>
        {status && <p className="text-center">{status}</p>}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Vérification par SMS</h2>
      <Input
        type="tel"
        placeholder="Numéro (ex: 06 12 34 56 78)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button
        onClick={handleSendCode}
        disabled={isSending || !phone.trim()}
        className="w-full"
      >
        {isSending ? "Envoi en cours..." : "Envoyer le code"}
      </Button>
      {status && <p className="text-center">{status}</p>}
    </div>
  );
}
