const { test } = require("node:test");
const assert = require("node:assert/strict");
const { capitalize } = require("../src/capitalize.js");

test("capitalizes first character of lowercase word", () => {
  assert.equal(capitalize("hello"), "Hello");
});

test("keeps already-capitalized words unchanged", () => {
  assert.equal(capitalize("Hello"), "Hello");
});

test("returns empty string for empty input", () => {
  assert.equal(capitalize(""), "");
});

test("only capitalizes first character, leaves rest unchanged", () => {
  assert.equal(capitalize("hello world"), "Hello world");
});
