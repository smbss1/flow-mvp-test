import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capitalize } from '../src/capitalize.js';

test('capitalizes first character of a lowercase word', () => {
  assert.equal(capitalize('hello'), 'Hello');
});

test('leaves already-capitalized word unchanged', () => {
  assert.equal(capitalize('Hello'), 'Hello');
});

test('returns empty string for empty input', () => {
  assert.equal(capitalize(''), '');
});

test('uppercases only the first character, rest unchanged', () => {
  assert.equal(capitalize('hELLO'), 'HELLO');
});
