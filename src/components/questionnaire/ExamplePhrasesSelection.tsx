
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ExamplePhrasesSelection = () => {
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);

  const examplePhrases = [
    {
      category: "Fin de vie",
      phrases: [
        "Je souhaite mourir dans la dignité, entouré de mes proches.",
        "Si mon état devient irréversible, je préfère les soins de confort.",
        "Je ne souhaite pas d'acharnement thérapeutique."
      ]
    },
    {
      category: "Traitements",
      phrases: [
        "J'accepte tous les traitements qui peuvent améliorer ma qualité de vie.",
        "Je refuse les traitements qui prolongeraient inutilement ma souffrance.",
        "Je souhaite être informé(e) de tous les traitements proposés."
      ]
    },
    {
      category: "Douleur",
      phrases: [
        "Je souhaite que ma douleur soit soulagée, même si cela peut raccourcir ma vie.",
        "Je préfère rester conscient(e) même si j'ai mal.",
        "La gestion de la douleur est ma priorité absolue."
      ]
    }
  ];

  const handlePhraseToggle = (phrase: string) => {
    setSelectedPhrases(prev => 
      prev.includes(phrase) 
        ? prev.filter(p => p !== phrase)
        : [...prev, phrase]
    );
  };

  const handleSave = () => {
    toast({
      title: "Phrases sauvegardées",
      description: `${selectedPhrases.length} phrase(s) sélectionnée(s)`
    });
  };

  return (
    <div className="space-y-6">
      {examplePhrases.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.phrases.map((phrase, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`${category.category}-${index}`}
                    checked={selectedPhrases.includes(phrase)}
                    onCheckedChange={() => handlePhraseToggle(phrase)}
                  />
                  <label 
                    htmlFor={`${category.category}-${index}`}
                    className="text-sm cursor-pointer leading-relaxed"
                  >
                    {phrase}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedPhrases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Phrases sélectionnées ({selectedPhrases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {selectedPhrases.map((phrase, index) => (
                <p key={index} className="text-sm bg-gray-50 p-2 rounded">
                  {phrase}
                </p>
              ))}
            </div>
            <Button onClick={handleSave} className="w-full">
              Sauvegarder les phrases sélectionnées
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExamplePhrasesSelection;
