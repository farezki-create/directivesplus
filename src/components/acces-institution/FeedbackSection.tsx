
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const FeedbackSection: React.FC = () => {
  return (
    <div className="mt-8">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">
            Votre avis nous intéresse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            En tant que professionnel de santé, votre retour d'expérience est précieux pour améliorer notre plateforme.
          </p>
          <Button 
            asChild
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-100"
          >
            <a 
              href="https://framaforms.org/questionnaire-sur-lapplication-de-redaction-des-directives-anticipees-directivesplus-1746994695" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Répondre au questionnaire
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
