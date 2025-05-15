
import { useEffect, useState } from "react";

interface LoadingStateProps {
  loading: boolean;
}

const LoadingState = ({ loading }: LoadingStateProps) => {
  const [showSpinner, setShowSpinner] = useState(false);
  
  // Only show the loading spinner after a short delay
  // This prevents flickering for fast loads
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowSpinner(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [loading]);
  
  if (!loading || !showSpinner) return null;
  
  return (
    <div className="flex justify-center my-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
    </div>
  );
};

export default LoadingState;
