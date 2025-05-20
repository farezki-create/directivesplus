
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  loading: boolean;
  message?: string;
}

const LoadingState = ({ loading, message = "Chargement en cours..." }: LoadingStateProps) => {
  if (!loading) return null;
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600 mb-2" />
      <p className="text-gray-500 text-center">{message}</p>
    </div>
  );
};

export default LoadingState;
