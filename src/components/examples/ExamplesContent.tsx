
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface ExamplesContentProps {
  onBack: () => void;
}

export function ExamplesContent({ onBack }: ExamplesContentProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);

  const commonPhrases = [
    "Je souhaite que l'on privilégie mon confort et que l'on soulage mes douleurs",
    "Je ne souhaite pas d'acharnement thérapeutique",
    "Je souhaite être accompagné(e) par mes proches dans mes derniers moments",
    "Je souhaite bénéficier d'une sédation profonde si nécessaire",
    "Je souhaite que mes organes puissent être donnés après mon décès",
  ];

  if (showPhrases) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={() => setShowPhrases(false)} 
          variant="outline" 
          className="mb-4"
        >
          Retour
        </Button>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Exemples de phrases à utiliser</h3>
          <ul className="space-y-3">
            {commonPhrases.map((phrase, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-primary">•</span>
                {phrase}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  }

  if (!showTemplates) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="mb-4"
        >
          Retour
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowTemplates(true)}
          >
            <h3 className="text-lg font-semibold">Propositions de modèles pré-remplis</h3>
          </Button>

          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowPhrases(true)}
          >
            <h3 className="text-lg font-semibold">Exemples de phrases à utiliser</h3>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={() => setShowTemplates(false)} 
        variant="outline" 
        className="mb-4"
      >
        Retour
      </Button>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Plus de soins thérapeutiques</h3>
            <p className="text-sm text-gray-600">
              Exemple de directives anticipées privilégiant les soins thérapeutiques actifs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Plus de soulagement des souffrances</h3>
            <p className="text-sm text-gray-600">
              Exemple de directives anticipées privilégiant le confort et le soulagement de la douleur.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Intermédiaire, Soins thérapeutiques et soulagement</h3>
            <p className="text-sm text-gray-600">
              Exemple équilibré entre les soins thérapeutiques et le soulagement des souffrances.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
