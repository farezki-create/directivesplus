
import React, { useState } from "react";
import DocumentHeader from "@/components/documents/card/DocumentHeader";
import DocumentActions from "@/components/documents/card/DocumentActions";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  content_type?: string;
  is_private?: boolean;
  user_id?: string;
  original_directive?: any; // Pour les directives transformées en documents
}

interface DocumentCardProps {
  document: Document;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  onAddToSharedFolder?: () => void;
  showPrint?: boolean;
  isAddingToShared?: boolean;
}

const DocumentCard = ({
  document,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  onAddToSharedFolder,
  showPrint = true,
  isAddingToShared = false
}: DocumentCardProps) => {
  const [isPrivate, setIsPrivate] = useState(document.is_private || false);
  
  const handleVisibilityChange = (documentId: string, checked: boolean) => {
    setIsPrivate(checked);
    if (onVisibilityChange) {
      onVisibilityChange(documentId, checked);
    }
  };

  console.log("DocumentCard rendu avec document:", document);

  // Determine the correct file type to use
  const fileType = getFileType(document);

  // Gérer l'affichage pour les directives transformées
  const handleView = () => {
    console.log("DocumentCard - onView appelé pour:", document.file_path);
    
    // Si c'est une directive transformée, afficher le contenu de la directive
    if (document.original_directive) {
      const directiveContent = document.original_directive.content || document.original_directive;
      console.log("Affichage directive transférée:", directiveContent);
      
      // Créer une nouvelle fenêtre pour afficher le contenu de la directive
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${directiveContent?.title || 'Directive Anticipée'}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                .content { margin-top: 20px; }
                .date { color: #666; font-size: 0.9em; }
                .metadata { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
              </style>
            </head>
            <body>
              <h1>${directiveContent?.title || 'Directive Anticipée Transférée'}</h1>
              <div class="date">Créé le: ${new Date(document.created_at).toLocaleDateString('fr-FR')}</div>
              <div class="metadata">
                <strong>Document transféré depuis:</strong> Mes Directives Doc<br>
                <strong>Type:</strong> ${document.description || 'Directive anticipée'}<br>
                <strong>Statut:</strong> Document accessible
              </div>
              <div class="content">
                ${directiveContent ? JSON.stringify(directiveContent, null, 2) : 'Contenu de la directive non disponible'}
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
      return;
    }
    
    // Comportement normal pour les autres documents
    onView(document.file_path, fileType);
  };

  const handleDownload = () => {
    console.log("DocumentCard - onDownload appelé:", document.file_path, document.file_name);
    
    // Si c'est une directive transformée, télécharger le contenu formaté
    if (document.original_directive) {
      const directiveContent = document.original_directive.content || document.original_directive;
      const content = JSON.stringify(directiveContent, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.file_name.replace('.pdf', '.json');
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }
    
    // Comportement normal pour les autres documents
    onDownload(document.file_path, document.file_name);
  };

  const handlePrint = () => {
    console.log("DocumentCard - onPrint appelé:", document.file_path, fileType);
    
    // Si c'est une directive transformée, imprimer le contenu formaté
    if (document.original_directive) {
      const directiveContent = document.original_directive.content || document.original_directive;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${directiveContent?.title || 'Directive Anticipée'}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                .content { margin-top: 20px; }
                .date { color: #666; font-size: 0.9em; }
                .metadata { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <h1>${directiveContent?.title || 'Directive Anticipée Transférée'}</h1>
              <div class="date">Créé le: ${new Date(document.created_at).toLocaleDateString('fr-FR')}</div>
              <div class="metadata">
                <strong>Document transféré depuis:</strong> Mes Directives Doc<br>
                <strong>Type:</strong> ${document.description || 'Directive anticipée'}<br>
                <strong>Statut:</strong> Document accessible
              </div>
              <div class="content">
                <pre>${JSON.stringify(directiveContent, null, 2)}</pre>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() { window.print(); }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      return;
    }
    
    // Comportement normal pour les autres documents
    onPrint(document.file_path, fileType);
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <DocumentHeader 
          document={document}
          isPrivate={isPrivate}
          onVisibilityChange={handleVisibilityChange}
        />
        
        <DocumentActions
          onView={handleView}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onDelete={() => {
            console.log("DocumentCard - onDelete appelé pour ID:", document.id);
            onDelete(document.id);
          }}
          onAddToSharedFolder={onAddToSharedFolder}
          showPrint={showPrint}
          isAddingToShared={isAddingToShared}
        />
      </div>
    </div>
  );
};

// Enhanced helper function to detect file type
const getFileType = (document: Document): string => {
  // First, try to use the explicit file_type or content_type from the document
  if (document.file_type) {
    return document.file_type;
  }
  
  if (document.content_type) {
    return document.content_type;
  }
  
  // If file_path is base64 data, try to extract from the data URL
  if (document.file_path && document.file_path.startsWith('data:')) {
    const mimeMatch = document.file_path.match(/^data:([^;]+)/);
    if (mimeMatch) {
      return mimeMatch[1];
    }
  }
  
  // Fall back to detecting from file name
  return detectFileTypeFromPath(document.file_name || document.file_path);
};

// Helper function to detect file type from path or filename
const detectFileTypeFromPath = (filePath: string): string => {
  if (!filePath) return "application/pdf"; // Default
  
  const fileName = filePath.toLowerCase();
  
  if (fileName.includes('image') || 
      fileName.endsWith('.jpg') || 
      fileName.endsWith('.jpeg') || 
      fileName.endsWith('.png') || 
      fileName.endsWith('.gif')) {
    return 'image/jpeg';
  } else if (fileName.includes('pdf') || fileName.endsWith('.pdf')) {
    return 'application/pdf';
  } else if (fileName.includes('audio') || 
             fileName.endsWith('.mp3') || 
             fileName.endsWith('.wav')) {
    return 'audio/mpeg';
  }
  return 'application/pdf'; // Default
};

export default DocumentCard;
