
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const FreeTextEditor = () => {
  const [freeText, setFreeText] = useState("");

  const handleSave = () => {
    if (freeText.trim()) {
      toast({
        title: "Texte sauvegardé",
        description: "Votre texte libre a été sauvegardé avec succès"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos instructions personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Utilisez cet espace pour exprimer vos souhaits personnels concernant vos soins médicaux. 
          Vous pouvez préciser vos valeurs, vos craintes, ou tout autre élément important pour vous.
        </p>
        
        <Textarea
          placeholder="Écrivez ici vos instructions personnelles..."
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          rows={10}
          className="resize-none"
        />
        
        <div className="text-sm text-gray-500">
          {freeText.length} caractères
        </div>
        
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder le texte
        </Button>
      </CardContent>
    </Card>
  );
};

export default FreeTextEditor;
