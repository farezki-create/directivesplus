
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Lock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { StrictRLSManager } from '@/utils/security/strictRLSManager';
import { useAuth } from '@/hooks/useAuth';
import {
  AccessLog,
  AccessCodeAttempt,
  DocumentAccessLog,
  MedicalAccessAudit,
  InstitutionAccessLog,
  SecurityAuditLog,
  SymptomAccessLog,
  SmsLog
} from '@/types/logs';

interface LogsState {
  security: SecurityAuditLog[];
  medical: MedicalAccessAudit[];
  documents: DocumentAccessLog[];
  institution: InstitutionAccessLog[];
  attempts: AccessCodeAttempt[];
  access: AccessLog[];
  symptoms: SymptomAccessLog[];
  sms: SmsLog[];
}

const StrictRLSAuditDashboard = () => {
  const { isAdmin } = useAuth();
  const [logs, setLogs] = useState<LogsState>({
    security: [],
    medical: [],
    documents: [],
    institution: [],
    attempts: [],
    access: [],
    symptoms: [],
    sms: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('security');

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const logData: LogsState = {
        security: [],
        medical: [],
        documents: [],
        institution: [],
        attempts: [],
        access: [],
        symptoms: [],
        sms: []
      };

      // Charger les logs de sécurité
      try {
        const securityLogs = await StrictRLSManager.getSecurityAuditLogs();
        logData.security = securityLogs.map(log => ({
          ...log,
          ip_address: String(log.ip_address || '')
        }));
      } catch (err) {
        console.warn('Failed to load security logs:', err);
      }

      // Charger les logs médicaux
      try {
        const medicalLogs = await StrictRLSManager.getMedicalAccessAudit();
        logData.medical = medicalLogs.map(log => ({
          ...log,
          ip_address: String(log.ip_address || '')
        }));
      } catch (err) {
        console.warn('Failed to load medical logs:', err);
      }

      // Charger les logs de documents
      try {
        const documentLogs = await StrictRLSManager.getDocumentAccessLogs();
        logData.documents = documentLogs.map(log => ({
          ...log,
          ip_address: String(log.ip_address || '')
        }));
      } catch (err) {
        console.warn('Failed to load document logs:', err);
      }

      // Charger les logs institutionnels
      try {
        const institutionLogs = await StrictRLSManager.getInstitutionAccessLogs();
        logData.institution = institutionLogs.map(log => ({
          ...log,
          ip_address: String(log.ip_address || '')
        }));
      } catch (err) {
        console.warn('Failed to load institution logs:', err);
      }

      // Charger les logs d'accès général
      try {
        const accessLogs = await StrictRLSManager.getAccessLogs();
        logData.access = accessLogs.map(log => ({
          ...log,
          ip_address: String(log.ip_address || '')
        }));
      } catch (err) {
        console.warn('Failed to load access logs:', err);
      }

      // Charger les logs de symptômes
      try {
        const symptomLogs = await StrictRLSManager.getSymptomAccessLogs();
        logData.symptoms = symptomLogs.map(log => ({
          ...log,
          ip_address: String(log.ip_address || '')
        }));
      } catch (err) {
        console.warn('Failed to load symptom logs:', err);
      }

      // Charger les logs SMS
      try {
        const smsLogs = await StrictRLSManager.getSmsLogs();
        logData.sms = smsLogs.map(log => ({
          ...log,
          ip_address: String(log.ip_address || '')
        }));
      } catch (err) {
        console.warn('Failed to load SMS logs:', err);
      }

      // Ajouter les logs admin-only si l'utilisateur est admin
      if (isAdmin) {
        try {
          const attemptLogs = await StrictRLSManager.getAccessCodeAttempts();
          logData.attempts = attemptLogs.map(log => ({
            ...log,
            ip_address: String(log.ip_address || '')
          }));
        } catch (err) {
          console.warn('Failed to load attempt logs:', err);
        }
      }

      setLogs(logData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [isAdmin]);

  const getRiskBadge = (riskLevel?: string) => {
    const level = riskLevel || 'low';
    const variants = {
      low: 'default',
      medium: 'secondary',
      high: 'destructive',
      critical: 'destructive'
    } as const;

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'default'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const renderLogTable = (logEntries: any[], type: string) => {
    if (!logEntries.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun log disponible</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logEntries.slice(0, 50).map((log) => (
          <Card key={log.id} className="p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {log.event_type || log.access_type || 'Accès système'}
                  </span>
                  {log.risk_level && getRiskBadge(log.risk_level)}
                  {log.success !== undefined && (
                    <Badge variant={log.success ? 'default' : 'destructive'}>
                      {log.success ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    </Badge>
                  )}
                  {log.access_granted !== undefined && (
                    <Badge variant={log.access_granted ? 'default' : 'destructive'}>
                      {log.access_granted ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    Horodatage: {formatDate(
                      log.created_at || log.accessed_at || log.attempt_time || 
                      log.date_consultation || log.sent_at
                    )}
                  </div>
                  {log.ip_address && (
                    <div>IP: {log.ip_address}</div>
                  )}
                  {log.user_id && (
                    <div>Utilisateur: {log.user_id.substring(0, 8)}...</div>
                  )}
                  {log.patient_id && (
                    <div>Patient: {log.patient_id.substring(0, 8)}...</div>
                  )}
                  {log.details && typeof log.details === 'object' && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Lock className="w-8 h-8" />
            Audit RLS Strict
          </h1>
          <p className="text-gray-600">
            Surveillance sécurisée des accès aux logs avec Row Level Security
          </p>
        </div>
        <Button onClick={loadLogs} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Conformité HDS</strong>
          <br />
          Tous les accès aux logs sont audités et protégés par des politiques RLS strictes.
          {!isAdmin && " Accès limité aux logs personnels uniquement."}
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="medical">Médical</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="institution">Institution</TabsTrigger>
          {isAdmin && <TabsTrigger value="attempts">Tentatives</TabsTrigger>}
        </TabsList>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Logs d'Audit de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLogTable(logs.security, 'security')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Logs d'Accès Médical
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLogTable(logs.medical, 'medical')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Logs d'Accès Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLogTable(logs.documents, 'documents')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institution">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Logs d'Accès Institutionnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLogTable(logs.institution, 'institution')}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="attempts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Tentatives d'Accès (Admin)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderLogTable(logs.attempts, 'attempts')}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Logs de Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {logs.security?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Accès Médicaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {logs.medical?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Accès Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {logs.documents?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrictRLSAuditDashboard;
