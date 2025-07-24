
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicPageButton } from "@/components/navigation/PublicPageButton";

const NoAccessView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <PublicPageButton className="mb-6 justify-center" />
            <h2 className="text-xl font-semibold mb-4">Accès aux directives anticipées</h2>
            <p className="text-gray-600 mb-4">
              Pour consulter des directives anticipées, vous pouvez :
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/auth")} 
                className="w-full"
              >
                Me connecter à mon compte
              </Button>
              <Button 
                onClick={() => navigate("/")} 
                variant="outline"
                className="w-full"
              >
                Saisir un code d'accès
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <PageFooter />
    </div>
  );
};

export default NoAccessView;
