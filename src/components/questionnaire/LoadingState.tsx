
import { Loader2 } from "lucide-react";

type LoadingStateProps = {
  loading: boolean;
};

const LoadingState = ({ loading }: LoadingStateProps) => {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center py-4">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-directiveplus-600 animate-spin" />
        <p className="mt-2 text-sm text-gray-600">Chargement en cours...</p>
      </div>
    </div>
  );
};

export default LoadingState;
