
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ArrowLeft, Clock, RefreshCw } from "lucide-react";

interface OTPStepProps {
  email: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResendCode: () => void;
  onGoBack: () => void;
  loading: boolean;
  isRateLimitActive: boolean;
  rateLimitExpiry: Date | null;
}

export const OTPStep: React.FC<OTPStepProps> = ({
  email,
  otpCode,
  setOtpCode,
  onSubmit,
  onResendCode,
  onGoBack,
  loading,
  isRateLimitActive,
  rateLimitExpiry
}) => {
  const getRemainingSeconds = () => {
    if (!rateLimitExpiry) return 0;
    return Math.max(0, Math.ceil((rateLimitExpiry.getTime() - Date.now()) / 1000));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Code de vérification (6 chiffres)</Label>
        <div className="flex justify-center">
          <InputOTP
            value={otpCode}
            onChange={setOtpCode}
            maxLength={6}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading || otpCode.length !== 6}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Se connecter
      </Button>
      
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onResendCode}
          disabled={loading || isRateLimitActive}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isRateLimitActive ? (
            <Clock className="mr-2 h-4 w-4" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isRateLimitActive 
            ? `Patienter ${getRemainingSeconds()}s`
            : 'Renvoyer le code'
          }
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={onGoBack}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Changer d'email
        </Button>
      </div>
    </form>
  );
};
