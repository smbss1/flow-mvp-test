const { test } = require('node:test');
const assert = require('node:assert/strict');
const { slugify } = require('../src/slugify.js');

test('lowercases and replaces spaces with hyphens', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('strips non-alphanumeric characters except hyphens', () => {
  assert.equal(slugify('Hello World!'), 'hello-world');
});

test('trims leading and trailing hyphens', () => {
  assert.equal(slugify('  trim me  '), 'trim-me');
});

test('collapses multiple whitespace runs into a single hyphen', () => {
  assert.equal(slugify('foo   bar'), 'foo-bar');
});

test('strips special characters entirely', () => {
  assert.equal(slugify('C++ is great!'), 'c-is-great');
});
