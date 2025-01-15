import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { importQuestions } from "@/utils/importQuestions";

export function ImportQuestionsForm() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "text/csv" || selectedFile.type === "application/json") {
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
      await importQuestions(file, type);
      toast({
        title: "Import réussi",
        description: "Les questions ont été importées avec succès"
      });
      setFile(null);
      setType("");
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import des questions"
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