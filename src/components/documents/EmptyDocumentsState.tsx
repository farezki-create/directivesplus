
import { FC } from "react";
import { FileText } from "lucide-react";

interface EmptyDocumentsStateProps {
  message?: string;
}

const EmptyDocumentsState: FC<EmptyDocumentsStateProps> = ({ 
  message = "Vous n'avez pas encore ajouté de directives" 
}) => {
  return (
    <div className="py-10 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileText size={24} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun document</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyDocumentsState;
