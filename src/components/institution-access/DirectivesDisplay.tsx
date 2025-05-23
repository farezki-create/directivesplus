
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ChevronDown, ChevronUp, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const extractContentSummary = (content: any) => {
    if (!content) return "Aucun contenu disponible";
    
    if (typeof content === 'string') {
      return content.substring(0, 150) + (content.length > 150 ? '...' : '');
    }
    
    if (content.content) {
      const text = typeof content.content === 'string' ? content.content : JSON.stringify(content.content);
      return text.substring(0, 150) + (text.length > 150 ? '...' : '');
    }
    
    return "Contenu structuré disponible";
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-directiveplus-600" />
          Directives trouvées
        </h3>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {documents.length} document{documents.length > 1 ? 's' : ''}
        </Badge>
      </div>
      
      {documents.map((doc) => {
        const isExpanded = expandedDocId === doc.id;
        const title = doc.content?.title || doc.content?.type || "Directive anticipée";
        const summary = extractContentSummary(doc.content);
        
        return (
          <Card key={doc.id} className="shadow-sm border-l-4 border-l-directiveplus-600">
            <CardHeader className="py-3 px-4">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded p-2 -m-2"
                onClick={() => toggleExpand(doc.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-directiveplus-100 p-2 rounded">
                    <FileText className="h-4 w-4 text-directiveplus-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">
                      {title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(doc.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Document patient
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
              
              {!isExpanded && (
                <div className="mt-2 text-sm text-gray-600 pl-12">
                  {summary}
                </div>
              )}
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="pt-0 pb-4 px-4 border-t bg-gray-50">
                <div className="prose prose-sm max-w-none pl-8">
                  {typeof doc.content === "string" ? (
                    <div dangerouslySetInnerHTML={{ __html: doc.content }} />
                  ) : doc.content?.content ? (
                    typeof doc.content.content === "string" ? (
                      <div dangerouslySetInnerHTML={{ __html: doc.content.content }} />
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                        {JSON.stringify(doc.content.content, null, 2)}
                      </pre>
                    )
                  ) : (
                    <pre className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                      {JSON.stringify(doc.content, null, 2)}
                    </pre>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note importante :</strong> Ces informations sont confidentielles et ne doivent être utilisées que dans le cadre des soins médicaux autorisés. L'accès à ces documents est enregistré pour des raisons de sécurité et de traçabilité.
        </p>
      </div>
    </div>
  );
};
