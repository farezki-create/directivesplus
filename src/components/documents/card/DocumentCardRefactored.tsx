import React, { useState } from "react";
import DocumentHeader from "@/components/documents/card/DocumentHeader";
import { DocumentActionsRefactored } from "./DocumentActionsRefactored";
import { detectDocumentType } from "../preview/documentUtils";
import { ShareableDocument } from "@/hooks/sharing/useUnifiedSharing";

interface DocumentCardRefactoredProps {
  document: ShareableDocument;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  onAddToSharedFolder?: () => void;
  showPrint?: boolean;
  showShare?: boolean;
  isAddingToShared?: boolean;
}

export const DocumentCardRefactored: React.FC<DocumentCardRefactoredProps> = ({
  document,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  onAddToSharedFolder,
  showPrint = true,
  showShare = false,
  isAddingToShared = false
}) => {
  const [isPrivate, setIsPrivate] = useState(document.is_private || false);

  const handleVisibilityChange = (documentId: string, checked: boolean) => {
    setIsPrivate(checked);
    if (onVisibilityChange) {
      onVisibilityChange(documentId, checked);
    }
  };

  const { isDirective } = detectDocumentType(document.file_path);
  const fileType = getFileType(document);

  const handleView = () => {
    console.log("DocumentCardRefactored - onView appelé pour:", document.file_path);
    
    if (isDirective || document.file_type === 'directive') {
      onView(document.file_path, 'directive');
      return;
    }
    
    if (document.content && typeof document.content === 'object') {
      displayDirectiveContent(document);
      return;
    }
    
    onView(document.file_path, fileType);
  };

  const handleDownload = () => {
    console.log("DocumentCardRefactored - onDownload appelé:", document.file_path, document.file_name);
    
    if (document.content && typeof document.content === 'object') {
      downloadDirectiveContent(document);
      return;
    }
    
    onDownload(document.file_path, document.file_name);
  };

  const handlePrint = () => {
    console.log("DocumentCardRefactored - onPrint appelé:", document.file_path, fileType);
    
    if (document.content && typeof document.content === 'object') {
      printDirectiveContent(document);
      return;
    }
    
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
        
        <DocumentActionsRefactored
          document={document}
          onView={handleView}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onDelete={() => onDelete(document.id)}
          onAddToSharedFolder={onAddToSharedFolder}
          showPrint={showPrint}
          showShare={showShare}
          isAddingToShared={isAddingToShared}
        />
      </div>
    </div>
  );
};

// Fonctions utilitaires pour la gestion des directives
const displayDirectiveContent = (document: ShareableDocument) => {
  const directiveContent = document.content;
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
          <h1>${directiveContent?.title || 'Directive Anticipée'}</h1>
          <div class="date">Créé le: ${new Date(document.created_at).toLocaleDateString('fr-FR')}</div>
          <div class="metadata">
            <strong>Document:</strong> ${document.description || 'Directive anticipée'}<br>
            <strong>Statut:</strong> Document accessible
          </div>
          <div class="content">
            <pre>${JSON.stringify(directiveContent, null, 2)}</pre>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  }
};

const downloadDirectiveContent = (document: ShareableDocument) => {
  const directiveContent = document.content;
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
};

const printDirectiveContent = (document: ShareableDocument) => {
  const directiveContent = document.content;
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
          <h1>${directiveContent?.title || 'Directive Anticipée'}</h1>
          <div class="date">Créé le: ${new Date(document.created_at).toLocaleDateString('fr-FR')}</div>
          <div class="metadata">
            <strong>Document:</strong> ${document.description || 'Directive anticipée'}<br>
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
};

const getFileType = (document: ShareableDocument): string => {
  if (document.file_type) return document.file_type;
  if (document.content_type) return document.content_type;
  
  if (document.file_path && document.file_path.startsWith('data:')) {
    const mimeMatch = document.file_path.match(/^data:([^;]+)/);
    if (mimeMatch) return mimeMatch[1];
  }
  
  return detectFileTypeFromPath(document.file_name || document.file_path);
};

const detectFileTypeFromPath = (filePath: string): string => {
  if (!filePath) return "application/pdf";
  
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
  return 'application/pdf';
};
