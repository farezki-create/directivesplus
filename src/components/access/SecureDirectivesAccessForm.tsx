
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Clock } from "lucide-react";
import DirectivesFormFields from "./DirectivesFormFields";
import { useSecureDirectivesAccess } from "@/hooks/access/useSecureDirectivesAccess";

interface SecureDirectivesAccessFormProps {
  onSubmit?: (accessCode: string, formData: any) => Promise<void>;
}

const SecureDirectivesAccessForm: React.FC<SecureDirectivesAccessFormProps> = ({ onSubmit }) => {
  const {
    form,
    loading,
    blocked,
    remainingAttempts,
    blockTimeRemaining,
    handleSubmit
  } = useSecureDirectivesAccess();

  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (blockTimeRemaining > 0) {
      setTimeRemaining(blockTimeRemaining);
      
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            clearInterval(interval);
            window.location.reload(); // Refresh to reset blocked state
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [blockTimeRemaining]);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      const values = form.getValues();
      await onSubmit(values.accessCode, values);
    } else {
      await handleSubmit();
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Accès Sécurisé aux Directives
        </CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={onFormSubmit}>
          <CardContent className="space-y-4">
            {blocked && timeRemaining > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Accès temporairement bloqué. Temps restant: {formatTimeRemaining(timeRemaining)}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {remainingAttempts !== null && remainingAttempts < 3 && !blocked && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Attention: Il vous reste {remainingAttempts} tentative{remainingAttempts > 1 ? 's' : ''} avant blocage temporaire.
                </AlertDescription>
              </Alert>
            )}

            <DirectivesFormFields 
              form={form}
              loading={loading}
              blockedAccess={blocked}
              errorMessage={null}
              remainingAttempts={remainingAttempts}
            />

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Sécurité renforcée</span>
              </div>
              <ul className="space-y-1">
                <li>• Maximum 5 tentatives par 15 minutes</li>
                <li>• Tous les accès sont enregistrés et surveillés</li>
                <li>• Validation automatique des codes d'accès</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || blocked}
            >
              {loading ? "Vérification sécurisée..." : blocked ? "Accès bloqué" : "Accéder aux directives"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SecureDirectivesAccessForm;
