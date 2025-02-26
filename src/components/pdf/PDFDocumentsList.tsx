
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usePDFDocuments, PDFDocument } from '@/hooks/usePDFDocuments';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PDFDocumentsListProps {
  userId: string | null;
}

export function PDFDocumentsList({ userId }: PDFDocumentsListProps) {
  const { documents, loading, deleteDocument } = usePDFDocuments(userId);
  const [selectedDocument, setSelectedDocument] = useState<PDFDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: fr });
  };

  const openPreview = (doc: PDFDocument) => {
    setSelectedDocument(doc);
    setPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium">Aucun document</p>
            <p className="text-muted-foreground mt-2">
              Vous n'avez pas encore téléchargé de documents PDF.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">Vos documents ({documents.length})</h3>
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">Grille</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="flex flex-col overflow-hidden h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base truncate">{doc.file_name}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatDate(doc.created_at)} • {formatFileSize(doc.file_size)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-0 flex-grow">
                    {doc.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-1"
                      onClick={() => openPreview(doc)}
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        asChild
                      >
                        <a 
                          href={doc.public_url} 
                          download={doc.file_name}
                          className="inline-flex items-center"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le document</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer <strong>{doc.file_name}</strong> ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteDocument(doc.id, doc.file_path)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="w-full">
            <div className="space-y-2">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-grow overflow-hidden">
                    <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(doc.created_at)} • {formatFileSize(doc.file_size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openPreview(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                    >
                      <a 
                        href={doc.public_url} 
                        download={doc.file_name}
                        className="inline-flex items-center"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer <strong>{doc.file_name}</strong> ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteDocument(doc.id, doc.file_path)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate max-w-full">
              {selectedDocument?.file_name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow relative">
            {selectedDocument && (
              <iframe 
                src={`${selectedDocument.public_url}#toolbar=0`}
                className="absolute inset-0 w-full h-full border-0"
                title={selectedDocument.file_name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
