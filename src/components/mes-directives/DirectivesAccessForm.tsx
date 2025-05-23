
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useDirectivesAccess } from "@/hooks/useDirectivesAccess";
import InstructionsBox from "./InstructionsBox";
import FormFields from "./FormFields";
import ErrorDisplay from "./ErrorDisplay";
import SubmitButton from "./SubmitButton";

export const DirectivesAccessForm = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    birthdate,
    setBirthdate,
    accessCode,
    setAccessCode,
    loading,
    error,
    handleVerify
  } = useDirectivesAccess();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-center text-directiveplus-700">
          Accès à mes directives anticipées
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <InstructionsBox />
        
        <FormFields 
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          birthdate={birthdate}
          setBirthdate={setBirthdate}
          accessCode={accessCode}
          setAccessCode={setAccessCode}
          loading={loading}
        />
        
        <ErrorDisplay error={error} />
      </CardContent>
      
      <CardFooter>
        <SubmitButton loading={loading} onClick={handleVerify} />
      </CardFooter>
    </Card>
  );
};

export default DirectivesAccessForm;
