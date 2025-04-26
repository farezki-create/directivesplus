
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { FileIcon, CreditCard } from "lucide-react";

interface DocumentMetaProps {
  description: string;
  createdAt: string;
  externalId?: string;
  isCard?: boolean;
}

export function DocumentMeta({ description, createdAt, externalId, isCard }: DocumentMetaProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg ${isCard ? 'bg-purple-50' : 'bg-blue-50'}`}>
        {isCard ? (
          <CreditCard className="h-6 w-6 text-purple-600" />
        ) : (
          <FileIcon className="h-6 w-6 text-blue-600" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{description || "Directives anticipées"}</h3>
          {isCard && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Format carte
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {format(new Date(createdAt), "dd MMMM yyyy à HH:mm", { locale: fr })}
          </span>
        </div>
        {externalId && (
          <Badge variant="outline" className="mt-2">
            ID: {externalId}
          </Badge>
        )}
      </div>
    </div>
  );
}
