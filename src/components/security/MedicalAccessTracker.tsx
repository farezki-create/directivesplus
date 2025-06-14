
import React, { useEffect } from 'react';
import { useMedicalAuditLogger } from '@/hooks/useMedicalAuditLogger';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Eye } from 'lucide-react';

interface MedicalAccessTrackerProps {
  resourceId: string;
  resourceType: string;
  medicalContext?: 'urgence' | 'soins_palliatifs' | 'consultation_programmee' | 'urgence_vitale';
  medicalJustification?: string;
  institutionCode?: string;
  showTracker?: boolean;
}

/**
 * Composant pour traquer automatiquement les accès médicaux avec conformité HDS
 */
const MedicalAccessTracker: React.FC<MedicalAccessTrackerProps> = ({
  resourceId,
  resourceType,
  medicalContext = 'consultation_programmee',
  medicalJustification,
  institutionCode,
  showTracker = true
}) => {
  const {
    activeSession,
    sessionDuration,
    startConsultationSession,
    endConsultationSession
  } = useMedicalAuditLogger();

  // Démarrer automatiquement la session au montage
  useEffect(() => {
    const initSession = async () => {
      await startConsultationSession(
        resourceId,
        resourceType,
        medicalContext,
        medicalJustification,
        institutionCode
      );
    };

    initSession();

    // Cleanup: terminer la session au démontage
    return () => {
      endConsultationSession();
    };
  }, [resourceId, resourceType, medicalContext]);

  // Gérer la fermeture de page/onglet
  useEffect(() => {
    const handleBeforeUnload = () => {
      endConsultationSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [endConsultationSession]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getContextBadgeColor = (context: string) => {
    switch (context) {
      case 'urgence_vitale':
        return 'bg-red-600 text-white';
      case 'urgence':
        return 'bg-orange-500 text-white';
      case 'soins_palliatifs':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  if (!showTracker || !activeSession) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-72 shadow-lg border-l-4 border-l-blue-500 z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Audit HDS Actif</span>
          </div>
          <Badge className={getContextBadgeColor(medicalContext)}>
            {medicalContext.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3" />
            <span>Session: {activeSession.slice(-8)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Durée: {formatDuration(sessionDuration)}</span>
          </div>
          
          {institutionCode && (
            <div className="text-xs">
              <span className="font-medium">Institution:</span> {institutionCode}
            </div>
          )}
          
          {medicalJustification && (
            <div className="text-xs">
              <span className="font-medium">Motif:</span> {medicalJustification}
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Accès conforme HDS - Tous les accès sont tracés et auditables
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalAccessTracker;
