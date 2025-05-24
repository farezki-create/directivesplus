
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DirectivesPageHeaderProps {
  onAddDocument: () => void;
  onDeleteAllDocuments?: () => void;
  documentsCount?: number;
}

const DirectivesPageHeader: React.FC<DirectivesPageHeaderProps> = ({
  onAddDocument,
  onDeleteAllDocuments,
  documentsCount = 0
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Directives Anticipées
          </h1>
          <p className="text-gray-600">
            Gérez vos directives anticipées et documents associés
          </p>
          {documentsCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {documentsCount} document{documentsCount > 1 ? 's' : ''} disponible{documentsCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {onDeleteAllDocuments && documentsCount > 0 && (
            <Button
              variant="destructive"
              onClick={onDeleteAllDocuments}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer tout ({documentsCount})
            </Button>
          )}
          <Button 
            onClick={onAddDocument} 
            className="flex items-center gap-2"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Ajouter un document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectivesPageHeader;
