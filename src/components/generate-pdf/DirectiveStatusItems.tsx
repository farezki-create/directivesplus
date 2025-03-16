
import { CheckCircle, AlertTriangle } from "lucide-react";

interface DirectiveStatusItemsProps {
  hasAnyResponses: boolean;
  hasFreeText: boolean;
  hasTrustedPerson: boolean;
}

export function DirectiveStatusItems({ 
  hasAnyResponses, 
  hasFreeText, 
  hasTrustedPerson 
}: DirectiveStatusItemsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        {hasAnyResponses ? (
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
        )}
        <div>
          <p className="font-medium">Réponses aux questionnaires</p>
          <p className="text-sm text-muted-foreground">
            {hasAnyResponses ? 
              "Vos réponses aux questionnaires sont enregistrées." : 
              "Vous n'avez pas encore répondu aux questionnaires."}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        {hasFreeText ? (
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
        )}
        <div>
          <p className="font-medium">Texte libre</p>
          <p className="text-sm text-muted-foreground">
            {hasFreeText ? 
              "Vous avez rédigé un texte libre pour vos directives." : 
              "Vous n'avez pas encore rédigé de texte libre pour vos directives."}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        {hasTrustedPerson ? (
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
        )}
        <div>
          <p className="font-medium">Personne de confiance</p>
          <p className="text-sm text-muted-foreground">
            {hasTrustedPerson ? 
              "Vous avez désigné une personne de confiance." : 
              "Vous n'avez pas encore désigné de personne de confiance."}
          </p>
        </div>
      </div>
    </div>
  );
}
