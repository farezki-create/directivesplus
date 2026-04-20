import React, { lazy, Suspense } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Database, Activity, Zap, FileSearch } from 'lucide-react';
import Header from '@/components/Header';
import BackButton from '@/components/ui/back-button';
import { useAuth } from '@/hooks/useAuth';

// Lazy-load each audit panel — only the active tab pays the cost
const SecurityAuditDashboard = lazy(() => import('@/components/admin/SecurityAuditDashboard'));
const StrictRLSAuditDashboard = lazy(() => import('@/components/admin/StrictRLSAuditDashboard'));
const SupabaseWarningsAnalyzer = lazy(() => import('@/components/audit/SupabaseWarningsAnalyzer'));
const SystemMonitoringDashboard = lazy(() => import('@/components/admin/SystemMonitoringDashboard'));
const SupabaseOptimizationPanel = lazy(() => import('@/components/admin/SupabaseOptimizationPanel'));
const AuthAuditReport = lazy(() =>
  import('@/features/auth/audit/AuthAuditReport').then(m => ({ default: m.AuthAuditReport }))
);

const TABS = [
  { value: 'security', label: 'Sécurité', icon: Shield },
  { value: 'auth', label: 'Auth', icon: Lock },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'rls', label: 'RLS', icon: FileSearch },
  { value: 'monitoring', label: 'Monitoring', icon: Activity },
  { value: 'optimization', label: 'Optimisation', icon: Zap },
] as const;

const TabFallback = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
  </div>
);

const AdminAuditUnified = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'security';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BackButton label="Retour au Dashboard" onClick={() => navigate('/admin/dashboard')} />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Audit & Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Vue unifiée de la sécurité, de la base de données et des performances.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-2 py-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Card className="p-4 md:p-6">
            <Suspense fallback={<TabFallback />}>
              <TabsContent value="security" className="mt-0">
                <SecurityAuditDashboard />
              </TabsContent>
              <TabsContent value="auth" className="mt-0">
                <AuthAuditReport />
              </TabsContent>
              <TabsContent value="database" className="mt-0">
                <SupabaseWarningsAnalyzer />
              </TabsContent>
              <TabsContent value="rls" className="mt-0">
                <StrictRLSAuditDashboard />
              </TabsContent>
              <TabsContent value="monitoring" className="mt-0">
                <SystemMonitoringDashboard />
              </TabsContent>
              <TabsContent value="optimization" className="mt-0">
                <SupabaseOptimizationPanel />
              </TabsContent>
            </Suspense>
          </Card>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminAuditUnified;
