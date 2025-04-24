
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock, User, Calendar } from "lucide-react";
import { useAdvanceDirectives } from "@/hooks/useAdvanceDirectives";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AdvanceDirectiveAccessDialog } from "./AdvanceDirectiveAccessDialog";

interface AdvanceDirectivesListProps {
  userId: string;
}

export function AdvanceDirectivesList({ userId }: AdvanceDirectivesListProps) {
  const { directives, isLoading, fetchUserDirectives } = useAdvanceDirectives(userId);
  
  useEffect(() => {
    if (userId) {
      fetchUserDirectives();
    }
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Chargement de vos directives anticipées...</p>
      </div>
    );
  }
  
  if (!directives.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Vous n'avez pas encore créé de directives anticipées</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Mes directives anticipées</h3>
      
      {directives.map((directive) => (
        <Card key={directive.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Directives anticipées
              </h4>
              <p className="text-sm text-muted-foreground">
                Créées le {format(new Date(directive.created_at), 'dd/MM/yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                Mises à jour le {format(new Date(directive.updated_at), 'dd/MM/yyyy')}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Gérer l'accès
                  </Button>
                </DialogTrigger>
                <AdvanceDirectiveAccessDialog directive={directive} />
              </Dialog>
              
              <Button variant="default" size="sm" onClick={() => {
                // Handle viewing/downloading directive
              }}>
                <FileText className="h-4 w-4 mr-2" />
                Consulter
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
