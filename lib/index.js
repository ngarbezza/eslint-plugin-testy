import pkg from '../package.json' with { type: 'json' };
import preferIsEmpty from './rules/prefer-is-empty.js';

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
    namespace: 'testy',
  },
  rules: {
    'prefer-is-empty': preferIsEmpty,
  },
  configs: {},
};

// Flat config. Usage: `plugins: { testy }` or `testy.configs.recommended`
plugin.configs.recommended = {
  name: 'testy/recommended',
  plugins: { testy: plugin },
  rules: {
    'testy/prefer-is-empty': 'warn',
  },
};

export default plugin;
