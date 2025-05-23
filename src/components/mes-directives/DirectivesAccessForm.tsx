
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AccessSharedProfile } from "./AccessSharedProfile";

export const DirectivesAccessForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Accéder à vos directives</CardTitle>
      </CardHeader>
      <CardContent>
        <AccessSharedProfile />
      </CardContent>
      <CardFooter className="text-sm text-center text-muted-foreground">
        Entrez vos informations pour accéder à vos directives médicales
      </CardFooter>
    </Card>
  );
};

export default DirectivesAccessForm;
