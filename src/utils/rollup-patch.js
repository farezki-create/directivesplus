
// This file prevents Rollup from trying to use native modules
// Forces the JavaScript implementation to be used instead
process.env.ROLLUP_SKIP_NATIVE = 'true';
process.env.ROLLUP_NATIVE_DISABLE = 'true';
process.env.SKIP_ROLLUP_NATIVE = 'true';

// Explicitly disable native dependencies for Node.js
process.env.DISABLE_NATIVE = 'true';
process.env.FORCE_JS_IMPLEMENTATION = 'true';
process.env.NODE_OPTIONS = '--no-native-modules';

// Disable optional native dependencies
process.env.OPTIONAL_NO_NATIVE = 'true';

// For Vite/Rollup specifically
if (typeof global !== 'undefined') {
  global.__ROLLUP_NO_NATIVE__ = true;
  global.__FORCE_JS_IMPLEMENTATION__ = true;
}

// Most aggressive approach: patch require.extensions to block native modules
if (typeof require !== 'undefined') {
  try {
    // Completely override Module._load for native modules
    const Module = require('module');
    const originalLoad = Module._load;
    
    Module._load = function(request, parent, isMain) {
      if (request && request.includes('@rollup/rollup-')) {
        // Force error for rollup native modules
        throw new Error(`Native module '${request}' loading prevented`);
      }
      return originalLoad.apply(this, arguments);
    };
    
    // Also patch _resolveFilename
    const originalResolveFilename = Module._resolveFilename;
    if (originalResolveFilename) {
      Module._resolveFilename = function(request, parent, isMain, options) {
        if (request && request.includes('@rollup/rollup-')) {
          throw new Error(`Native module '${request}' resolution blocked`);
        }
        return originalResolveFilename.apply(this, arguments);
      };
    }
  } catch (e) {
    // If patching fails, at least we tried
    console.warn('Failed to patch module loader:', e);
  }
}
