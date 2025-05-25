
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Copy, Eye, Calendar } from "lucide-react";
import { useInstitutionCodes } from "@/hooks/useInstitutionCodes";
import { InstitutionCodeForm } from "./InstitutionCodeForm";
import { InstitutionCodeDetails } from "./InstitutionCodeDetails";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export const InstitutionCodesManager: React.FC = () => {
  const { codes, loading, generateCode, updateCode, toggleCodeStatus, deleteCode } = useInstitutionCodes();
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<any>(null);
  const [viewingCode, setViewingCode] = useState<any>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le code a été copié dans le presse-papier",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Codes d'accès Institution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Codes d'accès Institution</CardTitle>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Générer un code
          </Button>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aucun code d'accès institution créé
              </p>
              <Button onClick={() => setShowForm(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Créer votre premier code
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {codes.map((code) => (
                <Card key={code.id} className="border">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {code.institution_code}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.institution_code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {code.institution_name && (
                          <p className="text-sm font-medium">{code.institution_name}</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Créé le {formatDate(code.created_at)}
                          {code.expires_at && (
                            <span className="ml-2">
                              • Expire le {formatDate(code.expires_at)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={code.is_active ? "default" : "secondary"}
                            className={isExpired(code.expires_at) ? "bg-red-100 text-red-800" : ""}
                          >
                            {isExpired(code.expires_at) ? "Expiré" : code.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={code.is_active && !isExpired(code.expires_at)}
                          onCheckedChange={(checked) => toggleCodeStatus(code.id, checked)}
                          disabled={isExpired(code.expires_at)}
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingCode(code)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCode(code)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le code d'accès</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce code d'accès ? 
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCode(code.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulaire de création/édition */}
      <InstitutionCodeForm
        isOpen={showForm || !!editingCode}
        onClose={() => {
          setShowForm(false);
          setEditingCode(null);
        }}
        onSubmit={async (data) => {
          if (editingCode) {
            await updateCode(editingCode.id, data);
          } else {
            await generateCode(data);
          }
          setShowForm(false);
          setEditingCode(null);
        }}
        initialData={editingCode}
        mode={editingCode ? 'edit' : 'create'}
      />

      {/* Détails du code */}
      <InstitutionCodeDetails
        code={viewingCode}
        isOpen={!!viewingCode}
        onClose={() => setViewingCode(null)}
      />
    </div>
  );
};
