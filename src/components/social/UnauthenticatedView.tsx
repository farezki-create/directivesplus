
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const UnauthenticatedView = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="bg-blue-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Rejoignez notre communauté</h3>
          <p className="text-gray-600 mb-6 text-lg">
            Connectez-vous pour partager vos expériences, poser des questions et échanger avec d'autres membres de la communauté DirectivesPlus.
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Se connecter pour participer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthenticatedView;
