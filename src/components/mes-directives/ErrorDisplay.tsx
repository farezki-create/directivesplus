
import React from "react";

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 text-sm">
      {error}
    </div>
  );
};

export default ErrorDisplay;
