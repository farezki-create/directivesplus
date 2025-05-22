
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import DirectivesFormFields from "./DirectivesFormFields";
import { useDirectivesAccessForm } from "@/hooks/access/useDirectivesAccessForm";

interface DirectivesAccessFormProps {
  onSubmit?: (accessCode: string, formData: any) => void;
}

const DirectivesAccessForm: React.FC<DirectivesAccessFormProps> = ({ onSubmit }) => {
  const {
    form,
    loading,
    handleSubmit,
    errorMessage,
    remainingAttempts,
    blockedAccess
  } = useDirectivesAccessForm();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si un gestionnaire personnalisé est fourni, utilisez-le
    if (onSubmit && form.getValues) {
      const values = form.getValues();
      console.log("Soumission du formulaire avec les valeurs:", values);
      await onSubmit(values.accessCode, values);
    } else {
      // Sinon, utilisez le gestionnaire par défaut
      await handleSubmit();
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={onFormSubmit}>
          <CardContent className="space-y-4 pt-4">
            <DirectivesFormFields 
              form={form}
              loading={loading}
              blockedAccess={blockedAccess}
              errorMessage={errorMessage}
              remainingAttempts={remainingAttempts}
            />
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || blockedAccess}
            >
              {loading ? "Vérification..." : "Accéder aux directives anticipées"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default DirectivesAccessForm;
