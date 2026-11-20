import { assert, suite, test } from '@pmoo/testy';

import rule from '../../lib/rules/prefer-is-empty.js';
import { ruleHarness } from '../support/rule_harness.js';

const { lint, fix } = ruleHarness('prefer-is-empty', rule);

const messageIds = code => lint(code).map(message => message.messageId);

suite('prefer-is-empty rule', () => {
  const validCodes = [
    'assert.that(algo).isEmpty()',
    'assert.that(algo).isNotEmpty()',
    'assert.that(algo).isEqualTo([1])',
    'assert.that(algo).isEqualTo([[]])',
    'assert.that(algo).isEqualTo({})',
    'assert.that(algo).isEqualTo(otherThing)',
    'assert.that(algo).isEqualTo()',
    'assert.that(algo).isNotEqualTo([1])',
    'assert.that(algo).isEqualTo(\'texto\')',
    'assert.that(algo).isEqualTo(\' \')',
    'assert.that(algo).isEqualTo(`${otherThing}`)',
    'assert.that(algo).isEqualTo(null)',
    'assert.that(algo).isEqualTo(0)',
    'assert.that(algo).isEqualTo(new Set([1]))',
    'assert.that(algo).isEqualTo(new Set(items))',
    'assert.that(algo).isEqualTo(new Map([[1, 2]]))',
    'assert.that(algo).isEqualTo(new Map(entries))',
    'assert.that(algo).isEqualTo(new Array())',
    'assert.that(algo).isEqualTo(new Other())',
    'assert.that(algo).isEqualTo(Set)',
    'assert.that(algo).isNotEqualTo(\'texto\')',
    'assert.that(algo).isNotEqualTo(new Set([1]))',
    // a custom equality criteria changes the meaning of the assertion
    'assert.that(algo).isEqualTo([], (a, b) => a.length === b.length)',
    'assert.that(algo).isNotEqualTo([], customCriteria)',
    // not a testy assertion
    'expect(algo).isEqualTo([])',
    'other.that(algo).isEqualTo([])',
    'assert.thing(algo).isEqualTo([])',
    'algo.isEqualTo([])',
    'isEqualTo([])',
  ];

  validCodes.forEach(code => {
    test(`does not report \`${code}\``, () => {
      assert.that(lint(code)).isEmpty();
    });
  });

  test('reports isEqualTo([]) suggesting isEmpty()', () => {
    const [message, ...others] = lint('assert.that(algo).isEqualTo([])');

    assert.that(others).isEmpty();
    assert.that(message.messageId).isEqualTo('preferIsEmpty');
    assert.that(message.message).isEqualTo('Use `isEmpty()` instead of `isEqualTo([])`.');
  });

  test('reports isNotEqualTo([]) suggesting isNotEmpty()', () => {
    const [message, ...others] = lint('assert.that(algo).isNotEqualTo([])');

    assert.that(others).isEmpty();
    assert.that(message.message).isEqualTo('Use `isNotEmpty()` instead of `isNotEqualTo([])`.');
  });

  const emptyValues = [
    { description: 'empty string with single quotes', literal: '\'\'' },
    { description: 'empty string with double quotes', literal: '""' },
    { description: 'empty template literal', literal: '``' },
    { description: 'empty Set', literal: 'new Set()' },
    { description: 'empty Set without parentheses', literal: 'new Set' },
    { description: 'empty Map', literal: 'new Map()' },
    { description: 'empty Map without parentheses', literal: 'new Map' },
  ];

  emptyValues.forEach(({ description, literal }) => {
    test(`reports isEqualTo(${literal}) (${description}) suggesting isEmpty()`, () => {
      const [message, ...others] = lint(`assert.that(algo).isEqualTo(${literal})`);

      assert.that(others).isEmpty();
      assert.that(message.messageId).isEqualTo('preferIsEmpty');
      assert.that(message.message).isEqualTo(`Use \`isEmpty()\` instead of \`isEqualTo(${literal})\`.`);
    });

    test(`reports isNotEqualTo(${literal}) (${description}) suggesting isNotEmpty()`, () => {
      const [message, ...others] = lint(`assert.that(algo).isNotEqualTo(${literal})`);

      assert.that(others).isEmpty();
      assert.that(message.message).isEqualTo(`Use \`isNotEmpty()\` instead of \`isNotEqualTo(${literal})\`.`);
    });

    test(`fixes isEqualTo(${literal}) into isEmpty()`, () => {
      assert.that(fix(`assert.that(algo).isEqualTo(${literal})`)).isEqualTo('assert.that(algo).isEmpty()');
    });

    test(`fixes isNotEqualTo(${literal}) into isNotEmpty()`, () => {
      assert.that(fix(`assert.that(algo).isNotEqualTo(${literal})`)).isEqualTo('assert.that(algo).isNotEmpty()');
    });
  });

  test('does not report an empty string with a custom equality criteria', () => {
    assert.that(messageIds('assert.that(algo).isEqualTo(\'\', customCriteria)')).isEmpty();
  });

  test('reports the method name, not the whole statement', () => {
    const [message] = lint('assert.that(algo)\n  .isEqualTo([]);');

    assert.that(message.line).isEqualTo(2);
    assert.that(message.column).isEqualTo(4);
  });

  test('fixes isEqualTo([]) into isEmpty()', () => {
    assert.that(fix('assert.that(algo).isEqualTo([])')).isEqualTo('assert.that(algo).isEmpty()');
  });

  test('fixes isNotEqualTo([]) into isNotEmpty()', () => {
    assert.that(fix('assert.that(algo).isNotEqualTo([])')).isEqualTo('assert.that(algo).isNotEmpty()');
  });

  test('keeps a complex subject untouched when fixing', () => {
    assert
      .that(fix('assert.that(algo.filter(x => x > 2)).isEqualTo([ ])'))
      .isEqualTo('assert.that(algo.filter(x => x > 2)).isEmpty()');
  });

  test('fixes a chain split in several lines', () => {
    assert.that(fix('assert.that(algo)\n  .isEqualTo([]);')).isEqualTo('assert.that(algo)\n  .isEmpty();');
  });

  test('fixes a call with a trailing comma', () => {
    assert.that(fix('assert.that(algo).isEqualTo([],);')).isEqualTo('assert.that(algo).isEmpty();');
  });

  test('reports and fixes several assertions in the same file', () => {
    const code = 'assert.that(a).isEqualTo([]); assert.that(b).isNotEqualTo([]);';

    assert.that(messageIds(code)).isEqualTo(['preferIsEmpty', 'preferIsEmpty']);
    assert.that(fix(code)).isEqualTo('assert.that(a).isEmpty(); assert.that(b).isNotEmpty();');
  });

  test('reports but does not fix when the fix would drop a comment', () => {
    const code = 'assert.that(algo).isEqualTo(/* sin elementos */ []);';

    assert.that(messageIds(code)).isEqualTo(['preferIsEmpty']);
    assert.that(fix(code)).isEqualTo(code);
  });
});
