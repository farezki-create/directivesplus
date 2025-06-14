
import { useEffect, useCallback } from 'react';
import { cacheManager, persistentCache } from '@/utils/performance/cacheStrategy';
import { preloadCriticalResources } from '@/utils/performance/bundleOptimization';

export const usePerformanceOptimization = () => {
  // Préchargement des ressources critiques
  useEffect(() => {
    preloadCriticalResources();
  }, []);

  // Optimisation des images avec lazy loading
  const optimizeImages = useCallback(() => {
    if ('loading' in HTMLImageElement.prototype) {
      // Le navigateur supporte le lazy loading natif
      const images = document.querySelectorAll('img[data-src]');
      images.forEach((img: any) => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
      });
    } else {
      // Fallback pour les navigateurs plus anciens
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }, []);

  // Monitoring des performances
  const trackPerformance = useCallback(() => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Log des métriques importantes
      console.log('Performance Metrics:', {
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
        loadComplete: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
      });
    }
  }, []);

  // Optimisation de la mémoire
  const optimizeMemory = useCallback(() => {
    // Nettoyage des caches expirés
    cacheManager.clearExpired();
    
    // Nettoyage du localStorage si nécessaire
    const storageUsage = new Blob(Object.values(localStorage)).size;
    if (storageUsage > 5 * 1024 * 1024) { // 5MB
      console.warn('localStorage usage is high, consider cleanup');
    }
  }, []);

  useEffect(() => {
    optimizeImages();
    trackPerformance();
    
    // Nettoyage mémoire périodique
    const memoryCleanup = setInterval(optimizeMemory, 10 * 60 * 1000); // 10 min
    
    return () => clearInterval(memoryCleanup);
  }, [optimizeImages, trackPerformance, optimizeMemory]);

  return {
    cacheManager,
    persistentCache,
    optimizeImages,
    trackPerformance,
    optimizeMemory
  };
};
