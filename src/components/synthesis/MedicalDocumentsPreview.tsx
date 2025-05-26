
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicalDocumentsPreviewProps {
  documents: any[];
  onPreview: (document: any) => void;
}

const MedicalDocumentsPreview = ({ documents, onPreview }: MedicalDocumentsPreviewProps) => {
  if (documents.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Documents médicaux inclus</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 italic">
            Aucun document médical ajouté. Les documents ajoutés dans la section ci-dessus apparaîtront automatiquement dans le PDF final.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Documents médicaux inclus</CardTitle>
        <p className="text-sm text-gray-600">
          Ces documents seront automatiquement intégrés à la fin de votre PDF de directives anticipées.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    {index + 1}. {doc.name}
                  </p>
                  {doc.created_at && (
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-green-600" />
                      <p className="text-xs text-green-600">
                        Ajouté le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    ✅ Sera inclus dans le PDF final
                  </p>
                </div>
              </div>
              {doc.file_path && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(doc)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Aperçu
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>📄 Intégration dans le PDF :</strong> Ces documents apparaîtront dans une section dédiée à la fin de vos directives anticipées, avec leur contenu complet (images, textes, etc.).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalDocumentsPreview;
