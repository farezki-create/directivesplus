
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import LoadingState from "@/components/questionnaire/LoadingState";
import SecurityAlerts from "../SecurityAlerts";
import FormActions from "../FormActions";
import { useMedicalAccessForm } from "@/hooks/access-document/useMedicalAccessForm";
import MedicalFormFields from "./MedicalFormFields";

const MedicalAccessForm = () => {
  const { 
    form, 
    loading, 
    errorMessage,
    blockedAccess,
    remainingAttempts,
    handleAccess
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
                blockedAccess={blockedAccess}
                loading={loading}
              />

              <SecurityAlerts 
                errorMessage={errorMessage}
                remainingAttempts={remainingAttempts}
                blockedAccess={blockedAccess}
              />
            </CardContent>

            {/* Loading spinner */}
            <LoadingState loading={loading} message="Vérification en cours..." />

            <CardFooter>
              <div className="w-full">
                <FormActions 
                  loading={loading}
                  onAction={handleAccess}
                  actionLabel="Accéder aux données médicales"
                  actionIcon="file-search"
                  buttonColor="bg-blue-600 hover:bg-blue-700"
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
