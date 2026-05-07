const { test } = require("node:test");
const assert = require("node:assert/strict");
const { slugify, unslugify } = require("../src/slugify.js");

test("lowercases and replaces spaces with hyphens", () => {
  assert.equal(slugify("Hello World!"), "hello-world");
});

test("strips non-alphanumeric characters except hyphens", () => {
  assert.equal(slugify("foo@bar.baz"), "foobarbaz");
});

test("trims leading and trailing hyphens", () => {
  assert.equal(slugify("  leading and trailing  "), "leading-and-trailing");
});

test("collapses multiple whitespace runs into a single hyphen", () => {
  assert.equal(slugify("multiple   spaces"), "multiple-spaces");
});

test("handles already-clean slug", () => {
  assert.equal(slugify("already-clean-123"), "already-clean-123");
});

test("unslugify replaces hyphens with spaces and capitalizes first letter", () => {
  assert.equal(unslugify("hello-world"), "Hello world");
});

test("unslugify handles single word", () => {
  assert.equal(unslugify("hello"), "Hello");
});

test("roundtrip: slugify(unslugify(x)) for ASCII strings", () => {
  const inputs = ["hello-world", "foo-bar-baz", "single", "multi-word-slug"];
  for (const input of inputs) {
    assert.equal(slugify(unslugify(input)), input);
  }
});
