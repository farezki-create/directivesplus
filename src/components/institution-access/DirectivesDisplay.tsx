
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";

interface Document {
  id: string;
  user_id: string;
  content: any;
  created_at: string;
}

interface DirectivesDisplayProps {
  documents: Document[];
}

export const DirectivesDisplay = ({ documents }: DirectivesDisplayProps) => {
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  if (!documents || documents.length === 0) {
    return null;
  }

  const toggleExpand = (docId: string) => {
    if (expandedDocId === docId) {
      setExpandedDocId(null);
    } else {
      setExpandedDocId(docId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-medium">Directives trouvées ({documents.length})</h3>
      
      {documents.map((doc) => {
        const isExpanded = expandedDocId === doc.id;
        const title = doc.content?.title || "Directive";
        const content = doc.content?.content || "Aucun contenu disponible";
        
        return (
          <Card key={doc.id} className="shadow-sm">
            <CardHeader className="py-3 px-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(doc.id)}
              >
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-directiveplus-600" />
                  {title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(doc.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="pt-0 pb-3 px-4 border-t">
                <div className="prose prose-sm max-w-none">
                  {typeof content === "string" ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  ) : (
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(content, null, 2)}
                    </pre>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
