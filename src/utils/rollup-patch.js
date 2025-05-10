
// This file prevents Rollup from trying to use native modules
// Forces the JavaScript implementation to be used instead

// Environment variables to disable native modules
process.env.ROLLUP_SKIP_NATIVE = 'true';
process.env.ROLLUP_NATIVE_DISABLE = 'true';
process.env.SKIP_ROLLUP_NATIVE = 'true';
process.env.DISABLE_NATIVE = 'true';
process.env.FORCE_JS_IMPLEMENTATION = 'true';
process.env.NODE_OPTIONS = '--no-native-modules';
process.env.OPTIONAL_NO_NATIVE = 'true';

// For Vite/Rollup specifically
if (typeof global !== 'undefined') {
  global.__ROLLUP_NO_NATIVE__ = true;
  global.__FORCE_JS_IMPLEMENTATION__ = true;
}

// Monkey patch require to prevent native module loading
if (typeof require !== 'undefined' && require.cache) {
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
      throw new Error(`Native module '${request}' loading prevented by rollup-patch.js`);
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
        throw new Error(`Native module '${request}' resolution blocked by rollup-patch.js`);
      }
      return originalResolveFilename.apply(this, arguments);
    };
  }
}

// Patch Node.js require system at a lower level
try {
  const fs = require('fs');
  const originalReadFile = fs.readFile;
  const originalReadFileSync = fs.readFileSync;
  
  // Patch fs.readFile to prevent loading native modules
  fs.readFile = function(path, ...args) {
    if (typeof path === 'string' && (
        path.includes('@rollup/rollup-') || 
        path.includes('rollup/dist/native.js')
      )) {
      const callback = args[args.length - 1];
      if (typeof callback === 'function') {
        process.nextTick(() => {
          callback(new Error(`Native module file read blocked: ${path}`));
        });
        return;
      }
    }
    return originalReadFile.apply(this, arguments);
  };
  
  // Patch fs.readFileSync to prevent loading native modules
  fs.readFileSync = function(path, ...args) {
    if (typeof path === 'string' && (
        path.includes('@rollup/rollup-') || 
        path.includes('rollup/dist/native.js')
      )) {
      throw new Error(`Native module file read blocked: ${path}`);
    }
    return originalReadFileSync.apply(this, arguments);
  };
} catch (e) {
  console.warn('Could not patch fs module:', e);
}
