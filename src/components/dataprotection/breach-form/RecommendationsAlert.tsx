
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RecommendationsProps {
  notifyAuthorities: boolean;
  notifyUsers: boolean;
  urgency: "normal" | "urgent" | "critical";
}

export const RecommendationsAlert: React.FC<RecommendationsProps> = ({ 
  notifyAuthorities, 
  notifyUsers, 
  urgency 
}) => {
  return (
    <Alert className={`
      ${urgency === 'normal' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''} 
      ${urgency === 'urgent' ? 'bg-amber-50 text-amber-800 border-amber-200' : ''} 
      ${urgency === 'critical' ? 'bg-red-50 text-red-800 border-red-200' : ''}
    `}>
      <AlertCircle className={`
        h-4 w-4 
        ${urgency === 'normal' ? 'text-blue-600' : ''} 
        ${urgency === 'urgent' ? 'text-amber-600' : ''} 
        ${urgency === 'critical' ? 'text-red-600' : ''}
      `} />
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
            Niveau d'urgence: <strong>{
              urgency === 'normal' ? 'Normal' : 
              urgency === 'urgent' ? 'Urgent' : 'Critique'
            }</strong>
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
