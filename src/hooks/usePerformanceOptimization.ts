
import { useEffect, useCallback } from 'react';
import { cacheManager, persistentCache } from '@/utils/performance/cacheStrategy';
import { preloadCriticalResources } from '@/utils/performance/bundleOptimization';

export const usePerformanceOptimization = () => {
  useEffect(() => {
    preloadCriticalResources();
  }, []);

  const optimizeImages = useCallback(() => {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach((img: any) => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
      });
    } else {
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

  const trackPerformance = useCallback(() => {
    // Performance metrics tracked internally
  }, []);

  const optimizeMemory = useCallback(() => {
    cacheManager.clearExpired();
    
    const storageUsage = new Blob(Object.values(localStorage)).size;
    if (storageUsage > 5 * 1024 * 1024) {
      // localStorage usage is high, consider cleanup
    }
  }, []);

  useEffect(() => {
    optimizeImages();
    trackPerformance();
    
    const memoryCleanup = setInterval(optimizeMemory, 10 * 60 * 1000);
    
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
