import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ImportQuestionsForm() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "text/csv" || selectedFile.type === "application/json") {
        console.log("Fichier sélectionné:", selectedFile.name, "Type:", selectedFile.type);
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Format de fichier non supporté",
          description: "Veuillez utiliser un fichier CSV ou JSON"
        });
      }
    }
  };

  const parseFileContent = async (file: File): Promise<any[]> => {
    const content = await file.text();
    console.log("Début du parsing du fichier");

    if (file.type === "application/json") {
      try {
        const data = JSON.parse(content);
        console.log("Données JSON parsées avec succès:", data.length, "entrées");
        return data;
      } catch (error) {
        console.error("Erreur lors du parsing JSON:", error);
        throw new Error("Le fichier JSON est mal formaté");
      }
    } else {
      // Parse CSV
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {} as Record<string, string>);
        });
      console.log("Données CSV parsées avec succès:", data.length, "entrées");
      return data;
    }
  };

  const getTableName = (type: string) => {
    switch (type) {
      case "general_opinion":
        return "questions";
      case "life_support":
        return "life_support_questions";
      case "advanced_illness":
        return "advanced_illness_questions";
      case "preferences":
        return "preferences_questions";
      default:
        throw new Error("Type de questions invalide");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !type) {
      toast({
        variant: "destructive",
        title: "Données manquantes",
        description: "Veuillez sélectionner un fichier et un type de questions"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Début de l'importation pour le type:", type);
      const tableName = getTableName(type);
      console.log("Table cible:", tableName);

      const data = await parseFileContent(file);
      console.log("Données préparées pour l'insertion:", data);

      const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert(data);

      if (error) {
        console.error("Erreur Supabase lors de l'insertion:", error);
        throw error;
      }

      console.log("Données insérées avec succès:", insertedData);
      toast({
        title: "Import réussi",
        description: `${data.length} questions ont été importées avec succès`
      });
      
      setFile(null);
      setType("");
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import des questions"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file">Fichier (CSV ou JSON)</Label>
        <Input
          id="file"
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type de questions</Label>
        <Select
          value={type}
          onValueChange={setType}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general_opinion">Avis général</SelectItem>
            <SelectItem value="life_support">Maintien en vie</SelectItem>
            <SelectItem value="advanced_illness">Maladie avancée</SelectItem>
            <SelectItem value="preferences">Préférences</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={!file || !type || isLoading}>
        {isLoading ? "Import en cours..." : "Importer les questions"}
      </Button>
    </form>
  );
}