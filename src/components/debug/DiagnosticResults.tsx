
import React from "react";
import { DiagnosticResult } from "./types";
import { getStatusBadge } from "./diagnosticUtils";

interface DiagnosticResultsProps {
  results: DiagnosticResult[];
}

const DiagnosticResults: React.FC<DiagnosticResultsProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Résultats du diagnostic :</h3>
      {results.map((result, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{result.test}</span>
            {getStatusBadge(result.status, result.success)}
          </div>
          <p className="text-sm text-gray-600">{result.details}</p>
          
          {result.duration && (
            <p className="text-xs text-gray-500 mt-1">
              Durée: {result.duration}ms
            </p>
          )}
          
          {result.rawError && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-red-600">
                Détails de l'erreur
              </summary>
              <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(result.rawError, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiagnosticResults;
