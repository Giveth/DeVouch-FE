// Stand-in for optional peer dependencies that are dynamically imported by
// transitive packages (see `turbopack.resolveAlias` in next.config.mjs) but
// are never used by this application. CommonJS on purpose: named imports from
// it must not be statically rejected by the bundler.
module.exports = {};
