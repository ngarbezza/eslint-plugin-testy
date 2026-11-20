/**
 * @fileoverview Prefer `isEmpty()` / `isNotEmpty()` over comparing against an empty array, string, Set or Map.
 */

const REPLACEMENTS = {
  isEqualTo: 'isEmpty',
  isNotEqualTo: 'isNotEmpty',
};

const isNamedMember = (node, name) =>
  node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier' && node.property.name === name;

const isEmptyArrayLiteral = node => node.type === 'ArrayExpression' && node.elements.length === 0;

const isEmptyStringLiteral = node =>
  (node.type === 'Literal' && node.value === '') ||
  (node.type === 'TemplateLiteral' && node.expressions.length === 0 && node.quasis[0].value.cooked === '');

const EMPTY_COLLECTION_CONSTRUCTORS = ['Set', 'Map'];

/** Matches `new Set()` and `new Map()` (with or without parentheses) */
const isEmptyCollectionConstruction = node =>
  node.type === 'NewExpression' &&
  node.callee.type === 'Identifier' &&
  EMPTY_COLLECTION_CONSTRUCTORS.includes(node.callee.name) &&
  node.arguments.length === 0;

/** Values for which `isEmpty()` is equivalent to comparing against them: `[]`, `''`, `new Set()` and `new Map()` */
const isEmptyValue = node =>
  isEmptyArrayLiteral(node) || isEmptyStringLiteral(node) || isEmptyCollectionConstruction(node);

/** Matches `assert.that(<anything>)` */
const isAssertThatCall = node =>
  node.type === 'CallExpression' &&
  isNamedMember(node.callee, 'that') &&
  node.callee.object.type === 'Identifier' &&
  node.callee.object.name === 'assert';

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `isEmpty()` and `isNotEmpty()` over comparing against an empty array, string, Set or Map with `isEqualTo` and `isNotEqualTo`',
      url: 'https://github.com/ngarbezza/eslint-plugin-testy/blob/main/docs/rules/prefer-is-empty.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferIsEmpty: 'Use `{{replacement}}()` instead of `{{original}}({{emptyValue}})`.',
    },
  },

  create(context) {
    const { sourceCode } = context;

    return {
      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== 'MemberExpression' || callee.computed || callee.property.type !== 'Identifier') return;

        const original = callee.property.name;
        if (!Object.hasOwn(REPLACEMENTS, original)) return;
        if (!isAssertThatCall(callee.object)) return;

        // A second argument is a custom equality criteria: not equivalent to `isEmpty()`
        if (node.arguments.length !== 1 || !isEmptyValue(node.arguments[0])) return;

        const replacement = REPLACEMENTS[original];
        const emptyValue = sourceCode.getText(node.arguments[0]);
        const [start] = callee.property.range;
        const hasCommentsToDrop = sourceCode
          .getCommentsInside(node)
          .some(comment => comment.range[0] >= start);

        context.report({
          node: callee.property,
          messageId: 'preferIsEmpty',
          data: { original, replacement, emptyValue },
          fix: hasCommentsToDrop
            ? null
            : fixer => fixer.replaceTextRange([start, node.range[1]], `${replacement}()`),
        });
      },
    };
  },
};

export default rule;
