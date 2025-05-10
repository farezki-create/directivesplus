
// This file prevents Rollup from trying to use native modules
// Forces the JavaScript implementation to be used instead
process.env.ROLLUP_SKIP_NATIVE = 'true';
process.env.ROLLUP_NATIVE_DISABLE = 'true';

// Explicitly disable native dependencies for Node.js v22
if (process.versions.node.startsWith('22')) {
  // Force pure JavaScript implementation
  process.env.DISABLE_NATIVE = 'true';
  process.env.FORCE_JS_IMPLEMENTATION = 'true';
}
