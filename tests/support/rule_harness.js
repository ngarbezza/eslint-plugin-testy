import { Linter } from 'eslint';

/**
 * Wraps a single rule in an ESLint `Linter`, so tests can ask for the reported
 * messages (`lint`) or for the source after applying autofixes (`fix`).
 */
export const ruleHarness = (ruleName, rule) => {
  const linter = new Linter({ configType: 'flat' });
  const config = [
    {
      files: ['**/*.js'],
      languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      plugins: { under_test: { rules: { [ruleName]: rule } } },
      rules: { [`under_test/${ruleName}`]: 'error' },
    },
  ];

  return {
    lint: code => linter.verify(code, config, 'example.js'),
    fix: code => linter.verifyAndFix(code, config, 'example.js').output,
  };
};
