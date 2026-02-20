
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

  useEffect(() => {
    initWebVitalsMonitoring();
    
    const performanceInterval = setInterval(() => {
      performanceMonitor.generateReport();
    }, 60000);

    return () => {
      clearInterval(performanceInterval);
      performanceMonitor.cleanup();
    };
  }, []);

  const optimizeCriticalResources = useCallback(() => {
    import('@/pages/Rediger');
    import('@/pages/Profile');
    import('@/pages/MesDirectives');
    
    optimizeImages();
    optimizeMemory();
  }, [optimizeImages, optimizeMemory]);

  const optimizeDataCache = useCallback(() => {
    const cacheKeys = ['questionnaire_', 'document_', 'access_card_'];
    
    cacheKeys.forEach(keyPrefix => {
      Object.keys(localStorage)
        .filter(key => key.startsWith(`cache_${keyPrefix}`))
        .slice(0, 5);
    });
  }, []);

  const getPerformanceMetrics = useCallback(() => {
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
