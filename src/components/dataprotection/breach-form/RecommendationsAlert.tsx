
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Update interface to accept the same risk level types used in the form
interface RecommendationsProps {
  notifyAuthorities: boolean;
  notifyUsers: boolean;
  urgency: "low" | "medium" | "high" | "critical";
}

export const RecommendationsAlert: React.FC<RecommendationsProps> = ({ 
  notifyAuthorities, 
  notifyUsers, 
  urgency 
}) => {
  // Convert risk levels to urgency levels for display
  const getUrgencyClass = (level: string) => {
    switch(level) {
      case 'critical': return 'bg-red-50 text-red-800 border-red-200';
      case 'high': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'medium': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'low': 
      default: return 'bg-green-50 text-green-800 border-green-200';
    }
  };
  
  const getUrgencyIconClass = (level: string) => {
    switch(level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-amber-600';
      case 'medium': return 'text-blue-600';
      case 'low':
      default: return 'text-green-600';
    }
  };
  
  const getUrgencyLabel = (level: string) => {
    switch(level) {
      case 'critical': return 'Critique';
      case 'high': return 'Élevé';
      case 'medium': return 'Moyen';
      case 'low':
      default: return 'Faible';
    }
  };

  return (
    <Alert className={getUrgencyClass(urgency)}>
      <AlertCircle className={`h-4 w-4 ${getUrgencyIconClass(urgency)}`} />
      <AlertTitle>Recommandations</AlertTitle>
      <AlertDescription className="mt-2">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            {notifyAuthorities 
              ? <strong>Notification à la CNIL requise dans les 72 heures.</strong>
              : "Notification à la CNIL probablement non nécessaire."}
          </li>
          <li>
            {notifyUsers 
              ? <strong>Information des personnes concernées requise dans les meilleurs délais.</strong>
              : "Information des personnes concernées probablement non nécessaire."}
          </li>
          <li>
            Niveau d'urgence: <strong>{getUrgencyLabel(urgency)}</strong>
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
