
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DocumentMetaProps {
  description: string;
  createdAt: string;
  externalId?: string | null;
  isCard?: boolean;
}

export function DocumentMeta({ 
  description, 
  createdAt, 
  externalId,
  isCard
}: DocumentMetaProps) {
  const formattedDate = format(new Date(createdAt), "d MMMM yyyy", { locale: fr });
  
  return (
    <div className="flex-grow">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">
          {isCard ? "Carte de directives anticipées" : description}
        </h3>
        {isCard && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            Format carte
          </span>
        )}
      </div>
      <div className="text-sm text-muted-foreground mt-1 space-y-1">
        <p>Généré le {formattedDate}</p>
        {externalId && (
          <p className="text-xs text-muted-foreground">ID: {externalId}</p>
        )}
      </div>
    </div>
  );
}
