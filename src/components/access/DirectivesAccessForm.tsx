
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import LoadingState from "@/components/questionnaire/LoadingState";
import { useDirectivesAccessForm } from "@/hooks/access/useDirectivesAccessForm";
import FormActions from "./FormActions";
import DirectivesFormFields from "./DirectivesFormFields";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface DirectivesAccessFormProps {
  onSubmit?: (accessCode: string, formData: any) => Promise<void>;
}

const DirectivesAccessForm = ({ onSubmit }: DirectivesAccessFormProps) => {
  const { 
    form, 
    loading, 
    handleAccessDirectives, 
    errorMessage, 
    remainingAttempts, 
    blockedAccess 
  } = useDirectivesAccessForm(onSubmit);

  const { isAuthenticated, user } = useAuth();

  // Afficher les messages d'erreur via toast
  useEffect(() => {
    if (errorMessage) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: errorMessage
      });
    }
  }, [errorMessage]);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-directiveplus-700">
        Accès aux directives anticipées
      </h1>
      
      {isAuthenticated && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <InfoIcon className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Vous êtes connecté en tant que {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}. 
            En tant qu'utilisateur authentifié, vous pouvez accéder directement à vos directives sans saisir de code d'accès.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accès sans connexion</CardTitle>
          <CardDescription>
            Accédez aux directives anticipées d'un patient à l'aide du code d'accès unique
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <div>
            <CardContent className="space-y-4">
              <DirectivesFormFields
                form={form}
                loading={loading}
                blockedAccess={blockedAccess}
                errorMessage={errorMessage}
                remainingAttempts={remainingAttempts}
              />
            </CardContent>

            {/* Loading indicator */}
            <LoadingState loading={loading} message="Vérification en cours..." />

            <CardFooter>
              <div className="w-full">
                <FormActions 
                  loading={loading}
                  onAction={handleAccessDirectives}
                  actionLabel="Accéder aux directives anticipées"
                  actionIcon="file-text"
                  isDisabled={blockedAccess}
                />
              </div>
            </CardFooter>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default DirectivesAccessForm;
