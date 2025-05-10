
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

// Monkey patch the require function to handle native module imports
// This is a more aggressive approach to prevent the native module loading
if (typeof require !== 'undefined' && require.cache) {
  const originalResolveFilename = require('module')._resolveFilename;
  if (originalResolveFilename) {
    require('module')._resolveFilename = function (request, parent, isMain, options) {
      // Skip any @rollup/rollup-* native modules
      if (request && request.includes('@rollup/rollup-')) {
        throw new Error(`Native module '${request}' loading prevented by rollup-patch.js`);
      }
      return originalResolveFilename(request, parent, isMain, options);
    };
  }
}
