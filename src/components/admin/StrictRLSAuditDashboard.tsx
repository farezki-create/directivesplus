
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  Lock,
  Eye,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useStrictRLS } from '@/hooks/useStrictRLS';
import { useAuth } from '@/contexts/AuthContext';

const StrictRLSAuditDashboard = () => {
  const { handleSecureLogAccess, logSecurityEvent, cleanupOldLogs, loading, error, isAdmin } = useStrictRLS();
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState('security_audit_logs');
  const [logData, setLogData] = useState<any[]>([]);
  const [auditResults, setAuditResults] = useState<any>({});

  const logTables = [
    { name: 'security_audit_logs', label: 'Logs de Sécurité', adminOnly: false },
    { name: 'access_code_attempts', label: 'Tentatives Codes d\'Accès', adminOnly: true },
    { name: 'document_access_logs', label: 'Accès Documents', adminOnly: false },
    { name: 'medical_access_audit', label: 'Audit Médical', adminOnly: false },
    { name: 'institution_access_logs', label: 'Accès Institutions', adminOnly: true },
    { name: 'sms_send_logs', label: 'Logs SMS', adminOnly: true }
  ];

  const loadLogTable = async (tableName: string) => {
    try {
      const data = await handleSecureLogAccess(tableName);
      if (data) {
        setLogData(data);
        await logSecurityEvent('rls_audit_table_viewed', {
          table_name: tableName,
          record_count: data.length
        });
      }
    } catch (err) {
      console.error('Error loading log table:', err);
    }
  };

  const runRLSAudit = async () => {
    const results = {
      timestamp: new Date().toISOString(),
      user_id: user?.id,
      tables_audited: [],
      security_score: 0,
      issues_found: [],
      recommendations: []
    };

    for (const table of logTables) {
      try {
        const data = await handleSecureLogAccess(table.name);
        const tableResult = {
          table_name: table.name,
          rls_enabled: true,
          access_granted: data !== null,
          record_count: data?.length || 0,
          admin_only: table.adminOnly,
          last_accessed: new Date().toISOString()
        };

        results.tables_audited.push(tableResult);

        // Vérifier la conformité RLS
        if (!tableResult.access_granted && !table.adminOnly) {
          results.issues_found.push(`Accès refusé inattendu pour ${table.label}`);
        }

        if (tableResult.access_granted && table.adminOnly && !isAdmin) {
          results.issues_found.push(`Accès accordé à ${table.label} sans privilèges admin`);
        }

      } catch (err) {
        results.issues_found.push(`Erreur lors de l'audit de ${table.name}: ${err}`);
      }
    }

    // Calculer le score de sécurité
    const totalTables = logTables.length;
    const issuesCount = results.issues_found.length;
    results.security_score = Math.max(0, Math.round(((totalTables - issuesCount) / totalTables) * 100));

    // Recommandations basées sur les résultats
    if (results.security_score < 100) {
      results.recommendations.push('Corriger les problèmes d\'accès RLS identifiés');
    }
    if (results.security_score >= 90) {
      results.recommendations.push('Maintenir les bonnes pratiques de sécurité');
    }
    if (results.security_score < 70) {
      results.recommendations.push('Révision complète des politiques RLS requise');
    }

    setAuditResults(results);
    
    await logSecurityEvent('rls_audit_completed', {
      security_score: results.security_score,
      issues_count: issuesCount,
      tables_audited: totalTables
    }, issuesCount > 0 ? 'high' : 'low');
  };

  useEffect(() => {
    loadLogTable(selectedTable);
  }, [selectedTable]);

  useEffect(() => {
    runRLSAudit();
  }, []);

  const handleTableChange = (tableName: string) => {
    setSelectedTable(tableName);
  };

  const handleCleanupLogs = async () => {
    const success = await cleanupOldLogs();
    if (success) {
      // Recharger les données après nettoyage
      await loadLogTable(selectedTable);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit RLS Strict</h1>
          <p className="text-gray-600 mt-2">
            Vérification des politiques Row Level Security sur les tables de logs
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={runRLSAudit} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Relancer l'Audit
          </Button>
          {isAdmin && (
            <Button variant="outline" onClick={handleCleanupLogs} disabled={loading}>
              <Trash2 className="w-4 h-4 mr-2" />
              Nettoyer les Logs
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Résumé de l'audit */}
      {auditResults.security_score !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Résumé de l'Audit RLS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{auditResults.security_score}%</div>
                <div className="text-sm text-gray-600">Score de Sécurité</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{auditResults.tables_audited?.length || 0}</div>
                <div className="text-sm text-gray-600">Tables Auditées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{auditResults.issues_found?.length || 0}</div>
                <div className="text-sm text-gray-600">Problèmes Détectés</div>
              </div>
            </div>

            {auditResults.issues_found?.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Problèmes Détectés :</h3>
                <ul className="space-y-1">
                  {auditResults.issues_found.map((issue, index) => (
                    <li key={index} className="text-sm text-red-700">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Onglets pour les tables de logs */}
      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Tables de Logs</TabsTrigger>
          <TabsTrigger value="audit">Détails de l'Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Accès aux Tables de Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {logTables.map((table) => (
                  <Button
                    key={table.name}
                    variant={selectedTable === table.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTableChange(table.name)}
                    disabled={table.adminOnly && !isAdmin}
                    className="flex items-center gap-2"
                  >
                    {table.adminOnly && <Lock className="w-3 h-3" />}
                    {table.label}
                  </Button>
                ))}
              </div>

              {loading && (
                <div className="text-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p>Chargement des données...</p>
                </div>
              )}

              {!loading && logData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {logData.length} entrée(s) trouvée(s)
                    </span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      RLS Actif
                    </Badge>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <pre className="text-xs bg-gray-50 p-4 rounded-lg">
                      {JSON.stringify(logData.slice(0, 5), null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {!loading && logData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune donnée disponible pour cette table
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Détails de l'Audit</CardTitle>
            </CardHeader>
            <CardContent>
              {auditResults.tables_audited && (
                <div className="space-y-4">
                  {auditResults.tables_audited.map((table, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{table.table_name}</h3>
                        <div className="flex items-center gap-2">
                          {table.access_granted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                          <Badge variant={table.access_granted ? "default" : "destructive"}>
                            {table.access_granted ? "Accès OK" : "Accès Refusé"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>RLS Activé: {table.rls_enabled ? "Oui" : "Non"}</p>
                        <p>Nombre d'enregistrements: {table.record_count}</p>
                        <p>Admin uniquement: {table.admin_only ? "Oui" : "Non"}</p>
                        <p>Dernier accès: {new Date(table.last_accessed).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrictRLSAuditDashboard;
