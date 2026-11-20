import { assert, suite, test } from '@pmoo/testy';

import plugin from '../lib/index.js';
import pkg from '../package.json' with { type: 'json' };

suite('plugin entry point', () => {
  test('exposes name and version from package.json', () => {
    assert.that(plugin.meta.name).isEqualTo(pkg.name);
    assert.that(plugin.meta.version).isEqualTo(pkg.version);
  });

  test('exports every rule', () => {
    assert.that(Object.keys(plugin.rules)).isEqualTo(['prefer-is-empty']);
  });

  test('recommended config registers the plugin', () => {
    // identity check: the plugin references itself, so deep equality can't be used
    assert.that(plugin.configs.recommended.plugins.testy === plugin).isTrue();
  });

  test('recommended config enables every rule', () => {
    const enabledRules = Object.keys(plugin.configs.recommended.rules).sort();
    const allRules = Object.keys(plugin.rules).map(name => `testy/${name}`).sort();

    assert.that(enabledRules).isEqualTo(allRules);
  });
});
