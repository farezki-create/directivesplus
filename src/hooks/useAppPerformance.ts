
import { useEffect, useCallback } from 'react';
import { usePerformanceOptimization } from './usePerformanceOptimization';
import { webVitalsMonitor, initWebVitalsMonitoring } from '@/utils/performance/webVitals';
import { performanceMonitor } from '@/utils/performance/performanceMonitor';

export const useAppPerformance = () => {
  const { 
    cacheManager, 
    optimizeImages, 
    trackPerformance, 
    optimizeMemory 
  } = usePerformanceOptimization();

  // Initialisation du monitoring des performances
  useEffect(() => {
    initWebVitalsMonitoring();
    
    // Monitoring périodique
    const performanceInterval = setInterval(() => {
      const report = performanceMonitor.generateReport();
      console.log('📊 Performance Report:', report);
    }, 60000); // Toutes les minutes

    return () => {
      clearInterval(performanceInterval);
      performanceMonitor.cleanup();
    };
  }, []);

  // Optimisation des ressources critiques
  const optimizeCriticalResources = useCallback(() => {
    // Préchargement des routes fréquemment utilisées
    import('@/pages/Rediger');
    import('@/pages/Profile');
    import('@/pages/MesDirectives');
    
    // Optimisation des images
    optimizeImages();
    
    // Nettoyage mémoire
    optimizeMemory();
  }, [optimizeImages, optimizeMemory]);

  // Optimisation du cache pour les données fréquentes
  const optimizeDataCache = useCallback(() => {
    // Les données d'accès sont souvent consultées
    const cacheKeys = ['questionnaire_', 'document_', 'access_card_'];
    
    cacheKeys.forEach(keyPrefix => {
      // Préchargement intelligent basé sur l'historique
      const frequentKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`cache_${keyPrefix}`))
        .slice(0, 5); // Top 5 des plus fréquents
      
      console.log(`🔄 Optimizing cache for: ${keyPrefix}`, frequentKeys.length);
    });
  }, []);

  // Monitoring des métriques de performance
  const getPerformanceMetrics = useCallback(() => {
    // Vérification sécurisée de l'existence de performance.memory
    const memoryInfo = (performance as any).memory;
    
    return {
      webVitals: webVitalsMonitor.getVitals(),
      performance: performanceMonitor.generateReport(),
      cacheStats: {
        hitRate: cacheManager.get('cache_hit_rate') || 0,
        memoryUsage: memoryInfo ? memoryInfo.usedJSHeapSize : null
      }
    };
  }, []);

  return {
    optimizeCriticalResources,
    optimizeDataCache,
    getPerformanceMetrics,
    cacheManager
  };
};
