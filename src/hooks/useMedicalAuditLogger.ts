
import { useState, useCallback } from "react";
import { MedicalAuditLogger, MedicalContext, ActionPerformed, HealthcareProfessionalRole } from "@/utils/security/medicalAuditLogger";

export const useMedicalAuditLogger = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  /**
   * Commencer une session de consultation médicale
   */
  const startConsultationSession = useCallback(async (
    resourceId: string,
    resourceType: string,
    context: MedicalContext = 'consultation_programmee',
    medicalJustification?: string,
    institutionCode?: string,
    healthcareRole?: HealthcareProfessionalRole
  ) => {
    const startTime = Date.now();
    setSessionStartTime(startTime);

    const auditReference = await MedicalAuditLogger.logMedicalAccess({
      medicalContext: context,
      accessType: resourceType === 'directive' ? 'directive_consultation' : 'document_medical',
      medicalJustification,
      resourceType,
      resourceId,
      actionPerformed: 'view',
      institutionCode,
      healthcareRole,
      hdsComplianceLevel: context === 'urgence_vitale' ? 'urgence_vitale' : 'standard',
      accessGranted: true
    });

    if (auditReference) {
      setActiveSession(auditReference);
    }

    return auditReference;
  }, []);

  /**
   * Terminer la session de consultation actuelle
   */
  const endConsultationSession = useCallback(async () => {
    if (activeSession && sessionStartTime) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      await MedicalAuditLogger.endConsultationSession(activeSession, duration);
      
      setActiveSession(null);
      setSessionStartTime(null);
      
      return duration;
    }
    return 0;
  }, [activeSession, sessionStartTime]);

  /**
   * Logger une action spécifique pendant la session
   */
  const logSessionAction = useCallback(async (
    action: ActionPerformed,
    resourceId: string,
    resourceType: string,
    context: MedicalContext = 'consultation_programmee'
  ) => {
    return await MedicalAuditLogger.logMedicalAccess({
      medicalContext: context,
      accessType: resourceType === 'directive' ? 'directive_consultation' : 'document_medical',
      resourceType,
      resourceId,
      actionPerformed: action,
      hdsComplianceLevel: context === 'urgence_vitale' ? 'urgence_vitale' : 'standard',
      accessGranted: true
    });
  }, []);

  /**
   * Logger un accès d'urgence
   */
  const logEmergencyAccess = useCallback(async (
    resourceId: string,
    resourceType: string,
    medicalJustification: string
  ) => {
    return await MedicalAuditLogger.logEmergencyAccess(
      resourceId,
      resourceType,
      medicalJustification
    );
  }, []);

  return {
    activeSession,
    sessionDuration: sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0,
    startConsultationSession,
    endConsultationSession,
    logSessionAction,
    logEmergencyAccess
  };
};
