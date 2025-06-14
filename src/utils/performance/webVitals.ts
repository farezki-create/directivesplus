
// Monitoring des Web Vitals pour mesurer les performances réelles
interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

class WebVitalsMonitor {
  private vitals: WebVital[] = [];

  // Mesure du Largest Contentful Paint (LCP)
  measureLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        const lcp = lastEntry.startTime;
        this.vitals.push({
          name: 'LCP',
          value: lcp,
          rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor'
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // Mesure du First Input Delay (FID)
  measureFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.vitals.push({
            name: 'FID',
            value: fid,
            rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor'
          });
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  // Mesure du Cumulative Layout Shift (CLS)
  measureCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.vitals.push({
          name: 'CLS',
          value: clsValue,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor'
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Démarrage du monitoring
  startMonitoring() {
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
  }

  // Récupération des métriques
  getVitals(): WebVital[] {
    return this.vitals;
  }

  // Rapport de performance
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      vitals: this.vitals,
      summary: {
        good: this.vitals.filter(v => v.rating === 'good').length,
        needsImprovement: this.vitals.filter(v => v.rating === 'needs-improvement').length,
        poor: this.vitals.filter(v => v.rating === 'poor').length
      }
    };
    
    console.log('Performance Report:', report);
    return report;
  }
}

export const webVitalsMonitor = new WebVitalsMonitor();

// Démarrage automatique du monitoring
export const initWebVitalsMonitoring = () => {
  if (typeof window !== 'undefined') {
    webVitalsMonitor.startMonitoring();
    
    // Génération d'un rapport après 10 secondes
    setTimeout(() => {
      webVitalsMonitor.generateReport();
    }, 10000);
  }
};
