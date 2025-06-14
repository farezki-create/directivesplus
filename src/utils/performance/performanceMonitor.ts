
// Monitor de performance pour surveiller l'application
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  // Initialisation du monitoring
  init() {
    this.setupResourceObserver();
    this.setupNavigationObserver();
    this.setupMemoryMonitoring();
  }

  // Observer les ressources
  private setupResourceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric(`resource_${resourceEntry.name}`, resourceEntry.duration);
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  // Observer la navigation
  private setupNavigationObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart);
            this.recordMetric('dom_ready_time', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  // Monitoring de la mémoire
  private setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('memory_used', memory.usedJSHeapSize);
        this.recordMetric('memory_total', memory.totalJSHeapSize);
        this.recordMetric('memory_limit', memory.jsHeapSizeLimit);
      }, 30000); // Toutes les 30 secondes
    }
  }

  // Enregistrer une métrique
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Garder seulement les 100 dernières valeurs
    if (values.length > 100) {
      values.shift();
    }
  }

  // Obtenir les statistiques d'une métrique
  getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }

  // Générer un rapport de performance
  generateReport() {
    const report: any = {
      timestamp: new Date().toISOString(),
      metrics: {}
    };

    this.metrics.forEach((values, name) => {
      report.metrics[name] = this.getMetricStats(name);
    });

    return report;
  }

  // Nettoyer les observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-initialisation si dans le navigateur
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}
