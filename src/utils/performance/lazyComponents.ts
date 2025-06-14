
import { lazy } from 'react';

// Code splitting des pages principales
export const LazyIndex = lazy(() => import('@/pages/Index'));
export const LazyAuth = lazy(() => import('@/pages/Auth'));
export const LazyProfile = lazy(() => import('@/pages/Profile'));
export const LazyDirectives = lazy(() => import('@/pages/Directives'));
export const LazySupabaseAuditPage = lazy(() => import('@/pages/SupabaseAuditPage'));
export const LazyAdminMainDashboard = lazy(() => import('@/pages/AdminMainDashboard'));
export const LazyPdfViewer = lazy(() => import('@/pages/PdfViewer'));

// Code splitting des composants lourds
export const LazySupabaseWarningsAnalyzer = lazy(() => import('@/components/audit/SupabaseWarningsAnalyzer'));
export const LazySimpleOTPAuth = lazy(() => import('@/components/auth/SimpleOTPAuth'));
export const LazyPdfViewerContainer = lazy(() => import('@/components/pdf-viewer/PdfViewerContainer'));

// Pages de questionnaires
export const LazyAvisGeneral = lazy(() => import('@/pages/AvisGeneral'));
export const LazyMaintienVie = lazy(() => import('@/pages/MaintienVie'));
export const LazyMaladieAvancee = lazy(() => import('@/pages/MaladieAvancee'));
export const LazyGoutsPeurs = lazy(() => import('@/pages/GoutsPeurs'));
export const LazyPersonneConfiance = lazy(() => import('@/pages/PersonneConfiance'));
export const LazyExemplesPhrases = lazy(() => import('@/pages/ExemplesPhrases'));
export const LazyCarteAcces = lazy(() => import('@/pages/CarteAcces'));

// Fallback de chargement
export const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Chargement...</p>
    </div>
  </div>
);
