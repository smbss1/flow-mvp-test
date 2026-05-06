const { test } = require("node:test");
const assert = require("node:assert/strict");
const { slugify } = require("../src/slugify.js");

test("lowercases and replaces spaces with hyphens", () => {
  assert.equal(slugify("Hello World!"), "hello-world");
});

test("strips characters outside [a-z0-9-]", () => {
  assert.equal(slugify("foo@bar#baz"), "foobarbaz");
});

test("trims leading and trailing hyphens", () => {
  assert.equal(slugify("  --hello--  "), "hello");
});

test("collapses multiple whitespace runs into one hyphen", () => {
  assert.equal(slugify("a   b"), "a-b");
});

test("empty string returns empty string", () => {
  assert.equal(slugify(""), "");
});
