
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Calendar, User, Mail, Phone, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InstitutionCodeDetailsProps {
  code: any;
  isOpen: boolean;
  onClose: () => void;
}

export const InstitutionCodeDetails: React.FC<InstitutionCodeDetailsProps> = ({
  code,
  isOpen,
  onClose
}) => {
  if (!code) return null;

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = () => {
    if (isExpired(code.expires_at)) {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    return (
      <Badge variant={code.is_active ? "default" : "secondary"}>
        {code.is_active ? "Actif" : "Inactif"}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du code d'accès</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Code d'accès */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Code d'accès</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                {code.institution_code}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(code.institution_code)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Institution */}
          {code.institution_name && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Institution
              </label>
              <p className="text-sm">{code.institution_name}</p>
            </div>
          )}

          {/* Contact */}
          {code.contact_person && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Personne de contact
              </label>
              <p className="text-sm">{code.contact_person}</p>
            </div>
          )}

          {code.contact_email && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email de contact
              </label>
              <p className="text-sm">{code.contact_email}</p>
            </div>
          )}

          {code.contact_phone && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone de contact
              </label>
              <p className="text-sm">{code.contact_phone}</p>
            </div>
          )}

          {/* Dates */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Créé le
            </label>
            <p className="text-sm">{formatDate(code.created_at)}</p>
          </div>

          {code.expires_at && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expire le
              </label>
              <p className="text-sm">{formatDate(code.expires_at)}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Instructions pour l'institution</h4>
            <p className="text-xs text-muted-foreground">
              L'institution doit utiliser ce code avec le nom, prénom et date de naissance 
              du patient pour accéder à ses directives anticipées.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
