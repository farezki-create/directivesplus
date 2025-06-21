
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  isRateLimitActive: boolean;
}

export const EmailStep: React.FC<EmailStepProps> = ({
  email,
  setEmail,
  onSubmit,
  loading,
  isRateLimitActive
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !email.trim() || isRateLimitActive}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        {isRateLimitActive ? 'Veuillez patienter...' : 'Envoyer le code'}
      </Button>
    </form>
  );
};
