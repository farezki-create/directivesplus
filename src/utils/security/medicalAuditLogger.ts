
import { supabase } from "@/integrations/supabase/client";

export type MedicalContext = 
  | 'urgence' 
  | 'soins_palliatifs' 
  | 'consultation_programmee' 
  | 'urgence_vitale' 
  | 'famille_proche';

export type AccessType = 
  | 'directive_consultation' 
  | 'document_medical' 
  | 'carte_acces' 
  | 'partage_institution' 
  | 'modification_directive';

export type ActionPerformed = 
  | 'view' 
  | 'download' 
  | 'print' 
  | 'share' 
  | 'modify' 
  | 'create' 
  | 'delete';

export type HDSComplianceLevel = 'standard' | 'critique' | 'urgence_vitale';
export type DataSensitivityLevel = 'medical' | 'sensitive' | 'critical';
export type HealthcareProfessionalRole = 'medecin' | 'infirmier' | 'urgentiste' | 'famille' | 'administrateur';

export interface MedicalAuditLogData {
  userId?: string;
  patientProfileId?: string;
  medicalContext: MedicalContext;
  accessType: AccessType;
  medicalJustification?: string;
  resourceType: string;
  resourceId: string;
  actionPerformed: ActionPerformed;
  ipAddress?: string;
  userAgent?: string;
  institutionCode?: string;
  healthcareRole?: HealthcareProfessionalRole;
  hdsComplianceLevel?: HDSComplianceLevel;
  consultationDuration?: number;
  accessGranted: boolean;
  securityFlags?: Record<string, any>;
  geolocationCountry?: string;
  geolocationRegion?: string;
}

/**
 * Logger enrichi pour les accès médicaux avec conformité HDS
 */
export class MedicalAuditLogger {
  
  /**
   * Enregistre un accès médical avec contexte enrichi
   */
  static async logMedicalAccess(data: MedicalAuditLogData): Promise<string | null> {
    try {
      console.log("🏥 Logging medical access:", {
        context: data.medicalContext,
        type: data.accessType,
        action: data.actionPerformed,
        resourceType: data.resourceType,
        hdsLevel: data.hdsComplianceLevel
      });

      // Générer une référence d'audit unique
      const auditReference = `HDS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Préparer les données pour l'insertion
      const logData = {
        user_id: data.userId,
        patient_profile_id: data.patientProfileId,
        medical_context: data.medicalContext,
        access_type: data.accessType,
        medical_justification: data.medicalJustification,
        resource_type: data.resourceType,
        resource_id: data.resourceId,
        action_performed: data.actionPerformed,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        geolocation_country: data.geolocationCountry,
        geolocation_region: data.geolocationRegion,
        institution_code: data.institutionCode,
        healthcare_professional_role: data.healthcareRole,
        hds_compliance_level: data.hdsComplianceLevel || 'standard',
        consultation_duration_seconds: data.consultationDuration,
        audit_trail_reference: auditReference,
        access_granted: data.accessGranted,
        security_flags: data.securityFlags || {},
        data_sensitivity_level: this.determineSensitivityLevel(data),
        session_start: new Date().toISOString()
      };

      // Insérer dans la table d'audit médical enrichi
      const { data: result, error } = await supabase
        .from('medical_access_audit_enhanced')
        .insert(logData)
        .select('id, audit_trail_reference')
        .single();

      if (error) {
        console.error("❌ Error logging medical access:", error);
        // Fallback vers le système de log de sécurité existant
        await this.fallbackToSecurityLog(data, auditReference);
        return null;
      }

      // Log additionnel pour les accès critiques
      if (data.hdsComplianceLevel === 'urgence_vitale' || data.medicalContext === 'urgence') {
        await this.logCriticalAccess(data, auditReference);
      }

      console.log("✅ Medical access logged successfully:", result.audit_trail_reference);
      return result.audit_trail_reference;

    } catch (error) {
      console.error("❌ Failed to log medical access:", error);
      // Fallback vers le système existant
      await this.fallbackToSecurityLog(data, `FALLBACK-${Date.now()}`);
      return null;
    }
  }

  /**
   * Log spécialisé pour l'accès aux directives anticipées
   */
  static async logDirectiveAccess(
    directiveId: string,
    action: ActionPerformed,
    context: MedicalContext = 'consultation_programmee',
    medicalJustification?: string,
    institutionCode?: string,
    healthcareRole?: HealthcareProfessionalRole
  ): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    return this.logMedicalAccess({
      userId: user?.id,
      medicalContext: context,
      accessType: 'directive_consultation',
      medicalJustification,
      resourceType: 'directive',
      resourceId: directiveId,
      actionPerformed: action,
      institutionCode,
      healthcareRole,
      hdsComplianceLevel: context === 'urgence_vitale' ? 'urgence_vitale' : 'standard',
      accessGranted: true,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent
    });
  }

  /**
   * Log pour l'accès aux documents PDF médicaux
   */
  static async logDocumentAccess(
    documentId: string,
    action: ActionPerformed,
    context: MedicalContext = 'consultation_programmee',
    consultationDuration?: number
  ): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    return this.logMedicalAccess({
      userId: user?.id,
      medicalContext: context,
      accessType: 'document_medical',
      resourceType: 'pdf_document',
      resourceId: documentId,
      actionPerformed: action,
      consultationDuration,
      hdsComplianceLevel: 'standard',
      accessGranted: true,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent
    });
  }

  /**
   * Log pour les accès d'urgence avec géolocalisation
   */
  static async logEmergencyAccess(
    resourceId: string,
    resourceType: string,
    medicalJustification: string,
    geolocation?: { country?: string; region?: string }
  ): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    return this.logMedicalAccess({
      userId: user?.id,
      medicalContext: 'urgence_vitale',
      accessType: 'directive_consultation',
      medicalJustification,
      resourceType,
      resourceId,
      actionPerformed: 'view',
      hdsComplianceLevel: 'urgence_vitale',
      geolocationCountry: geolocation?.country,
      geolocationRegion: geolocation?.region,
      accessGranted: true,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      securityFlags: { emergency_access: true, requires_follow_up: true }
    });
  }

  /**
   * Terminer une session de consultation avec durée
   */
  static async endConsultationSession(auditReference: string, duration: number): Promise<void> {
    try {
      await supabase
        .from('medical_access_audit_enhanced')
        .update({
          session_end: new Date().toISOString(),
          consultation_duration_seconds: duration
        })
        .eq('audit_trail_reference', auditReference);

      console.log(`📊 Consultation session ended: ${auditReference}, duration: ${duration}s`);
    } catch (error) {
      console.error("❌ Failed to end consultation session:", error);
    }
  }

  /**
   * Obtenir un rapport d'audit pour une période donnée
   */
  static async getAuditReport(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('hds_audit_summary')
        .select('*')
        .gte('audit_date', startDate.toISOString())
        .lte('audit_date', endDate.toISOString())
        .order('audit_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Failed to get audit report:", error);
      return [];
    }
  }

  /**
   * Déterminer le niveau de sensibilité des données
   */
  private static determineSensitivityLevel(data: MedicalAuditLogData): DataSensitivityLevel {
    if (data.medicalContext === 'urgence_vitale' || data.hdsComplianceLevel === 'urgence_vitale') {
      return 'critical';
    }
    if (data.accessType === 'directive_consultation' || data.resourceType === 'directive') {
      return 'sensitive';
    }
    return 'medical';
  }

  /**
   * Log critique pour les accès d'urgence
   */
  private static async logCriticalAccess(data: MedicalAuditLogData, auditReference: string): Promise<void> {
    try {
      // Utiliser le système de log de sécurité existant pour les accès critiques
      const { error } = await supabase.rpc('log_security_event_secure', {
        p_event_type: 'critical_medical_access',
        p_user_id: data.userId,
        p_ip_address: data.ipAddress,
        p_user_agent: data.userAgent,
        p_details: {
          audit_reference: auditReference,
          medical_context: data.medicalContext,
          resource_id: data.resourceId,
          institution: data.institutionCode,
          justification: data.medicalJustification
        },
        p_risk_level: 'critical'
      });

      if (error) {
        console.error("❌ Failed to log critical access:", error);
      }
    } catch (error) {
      console.error("❌ Failed to log critical medical access:", error);
    }
  }

  /**
   * Fallback vers le système de log de sécurité existant
   */
  private static async fallbackToSecurityLog(data: MedicalAuditLogData, auditReference: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('log_security_event_secure', {
        p_event_type: 'medical_access_fallback',
        p_user_id: data.userId,
        p_ip_address: data.ipAddress,
        p_user_agent: data.userAgent,
        p_details: {
          audit_reference: auditReference,
          medical_context: data.medicalContext,
          access_type: data.accessType,
          resource_type: data.resourceType,
          resource_id: data.resourceId,
          action: data.actionPerformed,
          fallback_reason: 'enhanced_audit_table_unavailable'
        },
        p_risk_level: data.hdsComplianceLevel === 'urgence_vitale' ? 'critical' : 'medium'
      });

      if (error) {
        console.error("❌ Fallback logging also failed:", error);
      }
    } catch (error) {
      console.error("❌ Complete logging failure:", error);
    }
  }

  /**
   * Obtenir l'IP du client (approximation côté client)
   */
  private static async getClientIP(): Promise<string | undefined> {
    try {
      // Note: En production, vous devriez obtenir l'IP côté serveur
      // Ceci est une approximation côté client
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn("Could not get client IP:", error);
      return undefined;
    }
  }
}
