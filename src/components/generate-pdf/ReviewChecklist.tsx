
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DirectiveStatusItems } from "./DirectiveStatusItems";

interface ReviewChecklistProps {
  hasAnyResponses: boolean;
  hasFreeText: boolean;
  hasTrustedPerson: boolean;
  hasReviewed: boolean;
  onConfirmReview: () => void;
}

export function ReviewChecklist({
  hasAnyResponses,
  hasFreeText,
  hasTrustedPerson,
  hasReviewed,
  onConfirmReview
}: ReviewChecklistProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Éléments de vos directives anticipées :</h3>
      
      <DirectiveStatusItems 
        hasAnyResponses={hasAnyResponses}
        hasFreeText={hasFreeText}
        hasTrustedPerson={hasTrustedPerson}
      />

      {!hasReviewed && (
        <div className="pt-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Vérification requise</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Veuillez vérifier que toutes les informations ci-dessus sont complètes avant de continuer.
                Si vous souhaitez compléter certaines sections, utilisez les liens suivants :
              </p>
              <div className="grid gap-2 pt-2">
                <a href="/general-opinion" className="text-blue-600 hover:underline flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire d'opinion générale
                </a>
                <a href="/life-support" className="text-blue-600 hover:underline flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire sur le maintien en vie
                </a>
                <a href="/advanced-illness" className="text-blue-600 hover:underline flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire sur la maladie avancée
                </a>
                <a href="/preferences" className="text-blue-600 hover:underline flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire sur vos préférences
                </a>
                <a href="/free-text" className="text-blue-600 hover:underline flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1" /> Compléter ou modifier votre texte libre
                </a>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={onConfirmReview}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              J'ai vérifié mes informations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
