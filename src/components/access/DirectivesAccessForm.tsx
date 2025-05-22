
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

  const onFormSubmit = async () => {
    if (onSubmit && form.getValues) {
      const values = form.getValues();
      onSubmit(values.accessCode, values);
    } else {
      await handleSubmit();
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          onFormSubmit();
        }}>
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
