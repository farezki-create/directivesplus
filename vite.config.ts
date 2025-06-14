
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && (async () => {
      const { componentTagger } = await import('lovable-tagger');
      return componentTagger();
    })(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Code splitting optimisé
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk vendor pour les dépendances principales
          vendor: ['react', 'react-dom'],
          
          // Chunk UI pour les composants d'interface
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-button',
            '@radix-ui/react-card',
            '@radix-ui/react-alert',
            '@radix-ui/react-badge'
          ],
          
          // Chunk utils pour les utilitaires
          utils: [
            'date-fns',
            'clsx',
            'tailwind-merge'
          ],
          
          // Chunk supabase pour la base de données
          supabase: ['@supabase/supabase-js'],
          
          // Chunk query pour React Query
          query: ['@tanstack/react-query'],
          
          // Chunk icons pour les icônes (plus lourd)
          icons: ['lucide-react'],
          
          // Chunk charts pour les graphiques
          charts: ['recharts'],
          
          // Chunks par fonctionnalité
          auth: [
            'src/components/auth',
            'src/features/auth'
          ],
          admin: [
            'src/components/admin',
            'src/pages/AdminMainDashboard'
          ],
          pdf: [
            'src/components/pdf-viewer',
            'src/utils/pdfGenerator',
            'jspdf'
          ]
        }
      }
    },
    
    // Optimisation de la taille
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    },
    
    // Taille limite des chunks
    chunkSizeWarningLimit: 1000,
    
    // Optimisation des assets
    assetsInlineLimit: 4096
  },
  
  // Optimisation du cache
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // Cache optimisé pour le développement
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query'
    ],
    exclude: [
      // Exclure les gros packages pour éviter les problèmes de cache
      'jspdf',
      'html2canvas'
    ]
  }
}));
