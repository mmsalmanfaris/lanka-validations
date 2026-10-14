import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as lib from '../src';

/**
 * Runs every README line shaped like `call(...); // expected` (or `console.log(expr); // expected`)
 * against the library, so documented results cannot drift from real behavior. People and AI
 * assistants copy these examples verbatim.
 */

const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const codeBlocks = [...readme.matchAll(/```(?:typescript|ts|javascript|js)\n([\s\S]*?)```/g)].map(
  (match) => match[1] ?? '',
);

const libNames = Object.keys(lib);
const libValues = Object.values(lib);

function evaluate(expression: string, scope: Record<string, unknown>): unknown {
  // Evaluates trusted README snippets with only the library exports and earlier `const`s in scope.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(...libNames, ...Object.keys(scope), `return (${expression});`) as (
    ...args: unknown[]
  ) => unknown;
  return fn(...libValues, ...Object.values(scope));
}

/** Parses the literal before any trailing explanation, e.g. `false (underage)` -> false. */
function parseExpected(comment: string): { ok: true; value: unknown } | { ok: false } {
  const literal = comment.split(/\s+\(|\s+—\s|\s+-\s/)[0]!.trim();
  try {
    return { ok: true, value: evaluate(literal, {}) };
  } catch {
    return { ok: false };
  }
}

interface Example {
  line: string;
  expression: string;
  expected: unknown;
  scope: Record<string, unknown>;
}

function collectExamples(): Example[] {
  const examples: Example[] = [];
  for (const block of codeBlocks) {
    const scope: Record<string, unknown> = {};
    for (const raw of block.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('//') || line.startsWith('import')) continue;

      const declaration = /^const (\w+) = ([^{].*?);?\s*(?:\/\/.*)?$/.exec(line);
      if (declaration) {
        try {
          scope[declaration[1]!] = evaluate(declaration[2]!, scope);
        } catch {
          // Multi-line or illustrative declaration; examples that depend on it are skipped below.
        }
        continue;
      }

      const commented = /^(.+?);?\s*\/\/\s*(.+)$/.exec(line);
      if (!commented) continue;
      const expression = commented[1]!.replace(/^console\.log\((.*)\)$/, '$1');
      const expected = parseExpected(commented[2]!);
      const usesUnknownName = /^(\w+)[?.]/.exec(expression);
      if (
        !expected.ok ||
        (usesUnknownName && !(usesUnknownName[1]! in scope) && !(usesUnknownName[1]! in lib))
      )
        continue;
      examples.push({ line, expression, expected: expected.value, scope: { ...scope } });
    }
  }
  return examples;
}

const examples = collectExamples();

describe('README examples', () => {
  it('finds enough examples to be meaningful', () => {
    expect(examples.length).toBeGreaterThan(80);
  });

  it.each(examples.map((example) => [example.line, example] as const))('%s', (_line, example) => {
    let actual = evaluate(example.expression, example.scope);
    if (actual instanceof Date) actual = actual.toISOString().slice(0, 10);
    expect(actual).toEqual(example.expected);
  });
});

describe('llms.txt examples', () => {
  const llms = readFileSync(new URL('../llms.txt', import.meta.url), 'utf8');
  const calls = [...llms.matchAll(/`([^`]+)` → `([^`]+)`/g)].map((match) => ({
    expression: match[1]!,
    expected: match[2]!,
  }));

  it('documents example calls', () => {
    expect(calls.length).toBeGreaterThan(5);
  });

  it.each(calls.map((call) => [`${call.expression} → ${call.expected}`, call] as const))(
    '%s',
    (_label, call) => {
      expect(evaluate(call.expression, {})).toEqual(evaluate(call.expected, {}));
    },
  );
});
