
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Heart, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export const PalliativeCareSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          Dossier Soins Palliatifs
        </CardTitle>
        <CardDescription>
          Accès au suivi de symptômes des patients en soins palliatifs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Consultez en temps réel l'évolution des symptômes de vos patients 
          grâce à leur code de partage personnel.
        </p>
        
        <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <Activity className="h-6 w-6 text-pink-600 flex-shrink-0" />
          <div className="flex-grow">
            <h4 className="font-medium text-pink-800">Suivi des symptômes</h4>
            <p className="text-sm text-pink-700">
              Douleur, dyspnée, anxiété - Graphiques d'évolution
            </p>
          </div>
          <Link to="/acces-soins-palliatifs">
            <Button 
              variant="outline" 
              size="sm"
              className="border-pink-600 text-pink-600 hover:bg-pink-100"
            >
              Accéder
            </Button>
          </Link>
        </div>

        <Alert className="border-pink-200 bg-pink-50">
          <Heart className="h-4 w-4 text-pink-600" />
          <AlertDescription className="text-pink-800">
            <strong>Code de partage requis :</strong> Demandez à votre patient son code 
            personnel de partage des symptômes pour accéder à son suivi et ses directives anticipées.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
