
// This file prevents Rollup from trying to use native modules
// Forces the JavaScript implementation to be used instead

// Add global variables to force pure JS implementations
if (typeof globalThis !== 'undefined') {
  globalThis.__ROLLUP_NO_NATIVE__ = true;
  globalThis.__FORCE_JS_IMPLEMENTATION__ = true;
}

if (typeof window !== 'undefined') {
  window.__ROLLUP_NO_NATIVE__ = true;
  window.__FORCE_JS_IMPLEMENTATION__ = true;
}

if (typeof global !== 'undefined') {
  global.__ROLLUP_NO_NATIVE__ = true;
  global.__FORCE_JS_IMPLEMENTATION__ = true;
}

// Environment variables to disable native modules
process.env.ROLLUP_SKIP_NATIVE = 'true';
process.env.ROLLUP_NATIVE_DISABLE = 'true';
process.env.SKIP_ROLLUP_NATIVE = 'true';
process.env.DISABLE_NATIVE = 'true';
process.env.FORCE_JS_IMPLEMENTATION = 'true';
process.env.NODE_OPTIONS = '--no-native-modules';
process.env.OPTIONAL_NO_NATIVE = 'true';

// Completely override the require function for native modules
const originalRequire = module.require;
module.require = function(id) {
  if (id && (
    id.includes('@rollup/rollup-') || 
    id.includes('rollup/dist/native') ||
    id.includes('node-gyp') ||
    id.includes('bindings')
  )) {
    throw new Error(`Native module '${id}' loading prevented by rollup-patch.js`);
  }
  return originalRequire.apply(this, arguments);
};

// Try to monkey-patch the built-in require as well
if (typeof require !== 'undefined' && require.cache) {
  try {
    const Module = require('module');
    const originalLoad = Module._load;
    
    Module._load = function(request, parent, isMain) {
      // Block any native module requests
      if (request && (
        request.includes('@rollup/rollup-') || 
        request.includes('rollup/dist/native') ||
        request.includes('node-gyp') ||
        request.includes('bindings')
      )) {
        console.warn(`Prevented loading native module: ${request}`);
        
        // For rollup native, return a mock implementation
        if (request.includes('rollup/dist/native')) {
          return {
            // Mock the native module with JS implementations
            getDefaultRollupPlugins: () => [],
            defineConfig: (config) => config
          };
        }
        
        throw new Error(`Native module '${request}' loading blocked`);
      }
      return originalLoad.apply(this, arguments);
    };
    
    // Also patch _resolveFilename
    const originalResolveFilename = Module._resolveFilename;
    if (originalResolveFilename) {
      Module._resolveFilename = function(request, parent, isMain, options) {
        if (request && (
          request.includes('@rollup/rollup-') || 
          request.includes('rollup/dist/native') ||
          request.includes('node-gyp') ||
          request.includes('bindings')
        )) {
          console.warn(`Prevented resolving native module: ${request}`);
          throw new Error(`Native module '${request}' resolution blocked`);
        }
        return originalResolveFilename.apply(this, arguments);
      };
    }
  } catch (e) {
    console.warn('Could not patch Node.js module system:', e);
  }
}
