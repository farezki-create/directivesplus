
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import LoadingState from "@/components/questionnaire/LoadingState";
import { useMedicalAccessForm } from "@/hooks/access-document/useMedicalAccessForm";
import FormActions from "../FormActions";
import MedicalFormFields from "./MedicalFormFields";

const MedicalAccessForm = () => {
  const { 
    form, 
    loading, 
    handleAccessMedical, 
    errorMessage, 
    remainingAttempts, 
    blockedAccess 
  } = useMedicalAccessForm();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Accès aux données médicales
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accès sans connexion</CardTitle>
          <CardDescription>
            Accédez aux données médicales d'un patient à l'aide du code d'accès unique
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <div>
            <CardContent className="space-y-4">
              <MedicalFormFields
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
                  onAction={handleAccessMedical}
                  actionLabel="Accéder aux données médicales"
                  actionIcon="file-search"
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

export default MedicalAccessForm;
