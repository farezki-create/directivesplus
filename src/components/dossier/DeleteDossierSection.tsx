
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";

export default function DeleteDossierSection() {
  const clearDossierActif = useDossierStore(state => state.clearDossierActif);
  const clearDecryptedContent = useDossierStore(state => state.clearDecryptedContent);

  const handleDeleteDossier = () => {
    try {
      // Clear the active dossier from the store
      clearDossierActif();
      clearDecryptedContent();
      
      toast({
        title: "Dossier supprimé",
        description: "Votre dossier actif a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-red-200 bg-white">
      <CardHeader>
        <CardTitle className="text-red-600">Supprimer mon dossier</CardTitle>
        <CardDescription>
          Cette action supprimera le dossier actuellement chargé de votre vue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer le dossier
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera le dossier actuellement affiché de votre vue. Vous pourrez le recharger plus tard si nécessaire.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDossier}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer le dossier
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
