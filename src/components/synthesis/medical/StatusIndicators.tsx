
import React from 'react';
import { Mic, Eye } from "lucide-react";

interface StatusIndicatorsProps {
  isRecording: boolean;
  isOcrProcessing: boolean;
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  isRecording,
  isOcrProcessing
}) => {
  return (
    <>
      {isRecording && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <Mic className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Enregistrement en cours...</span>
          </div>
        </div>
      )}

      {isOcrProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Eye className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Analyse de l'image en cours...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusIndicators;
