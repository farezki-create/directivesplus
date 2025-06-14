
// Optimisation des imports pour réduire la taille du bundle
export const optimizedImports = {
  // Import sélectif des icônes Lucide
  icons: {
    AlertTriangle: () => import('lucide-react').then(mod => ({ default: mod.AlertTriangle })),
    Shield: () => import('lucide-react').then(mod => ({ default: mod.Shield })),
    Database: () => import('lucide-react').then(mod => ({ default: mod.Database })),
    Settings: () => import('lucide-react').then(mod => ({ default: mod.Settings })),
    RefreshCw: () => import('lucide-react').then(mod => ({ default: mod.RefreshCw })),
  },
  
  // Import dynamique des utilitaires lourds
  pdfUtils: () => import('@/utils/pdfGenerator'),
  chartUtils: () => import('recharts'),
  
  // Import conditionnel des fonctionnalités admin
  adminFeatures: () => import('@/components/admin/AdminMainDashboard'),
};

// Préchargement intelligent des ressources critiques
export const preloadCriticalResources = () => {
  // Précharger les composants susceptibles d'être utilisés rapidement
  const criticalComponents = [
    () => import('@/components/auth/SimpleOTPAuth'),
    () => import('@/components/Header'),
    () => import('@/components/ui/button'),
  ];

  criticalComponents.forEach(importFn => {
    // Préchargement avec requestIdleCallback pour éviter de bloquer le thread principal
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 100);
    }
  });
};
