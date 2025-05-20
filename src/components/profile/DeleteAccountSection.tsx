
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

export default function DeleteAccountSection() {
  const { isDeleting, deleteAccount } = useDeleteAccount();

  return (
    <Card className="border-red-200 bg-white">
      <CardHeader>
        <CardTitle className="text-red-600">Supprimer mon compte</CardTitle>
        <CardDescription>
          Cette action supprimera définitivement votre compte et toutes les données associées.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression en cours...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer mon compte
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est <span className="font-bold">irréversible</span> et entraînera la suppression permanente de :
              </AlertDialogDescription>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground text-sm">
                <li>Votre profil utilisateur</li>
                <li>Toutes vos directives médicales</li>
                <li>Tous vos documents et fichiers</li>
                <li>Toutes les données médicales associées</li>
              </ul>
              <div className="mt-2 text-red-600 font-medium text-sm">
                Vous ne pourrez pas récupérer ces informations une fois supprimées.
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
