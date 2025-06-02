
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Users, Calendar, Eye, Shield } from "lucide-react";
import { useAccessRights } from "@/hooks/useAccessRights";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ChatAssistant from "@/components/ChatAssistant";

const TableauBordInstitution = () => {
  const { accessRights, loading, error } = useAccessRights();

  const handleViewDirectives = (patient: any) => {
    // Navigation vers les directives du patient
    console.log("Voir les directives de:", patient);
    // TODO: Implémenter la navigation vers les directives
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
                alt="DirectivesPlus" 
                className="h-24 w-auto"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de Bord Institution
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Patients autorisés pour votre institution
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accessRights.length}</div>
                <p className="text-xs text-muted-foreground">
                  Patients autorisés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {accessRights.filter(right => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(right.date_autorisation) > weekAgo;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nouveaux accès
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statut</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Actif</div>
                <p className="text-xs text-muted-foreground">
                  Institution validée
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Liste des patients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Patients Autorisés
              </CardTitle>
              <CardDescription>
                Liste des patients pour lesquels votre institution a un droit d'accès
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Erreur lors du chargement des données : {error}
                  </AlertDescription>
                </Alert>
              ) : accessRights.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun patient autorisé
                  </h3>
                  <p className="text-gray-500">
                    Votre institution n'a pas encore de droits d'accès assignés.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prénom</TableHead>
                        <TableHead>Date de naissance</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>Date d'autorisation</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessRights.map((right) => (
                        <TableRow key={right.id}>
                          <TableCell className="font-medium">
                            {right.patient_nom}
                          </TableCell>
                          <TableCell>{right.patient_prenom}</TableCell>
                          <TableCell>
                            {format(new Date(right.patient_naissance), 'dd/MM/yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{right.institution_nom}</div>
                              <div className="text-sm text-gray-500">{right.institution_structure}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(right.date_autorisation), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            {right.notes && (
                              <Badge variant="secondary" className="text-xs">
                                Notes disponibles
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handleViewDirectives(right)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir directives
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations de sécurité */}
          <div className="mt-8">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Accès sécurisé :</strong> Seuls les patients explicitement autorisés 
                par l'administration apparaissent dans cette liste. Tous les accès sont 
                journalisés conformément aux exigences de sécurité.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
      
      <ChatAssistant />
    </div>
  );
};

export default TableauBordInstitution;
