const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseAuthorizationHeader, requireBearerToken } = require("../src/auth.js");

test("parseAuthorizationHeader: returns token for valid Bearer header", () => {
  const result = parseAuthorizationHeader("Bearer abc123");
  assert.equal(result.ok, true, "ok must be true for valid Bearer header");
  assert.equal(result.token, "abc123", "token must match the value after Bearer");
});

test("parseAuthorizationHeader: rejects missing header", () => {
  const result = parseAuthorizationHeader(undefined);
  assert.equal(result.ok, false, "ok must be false for undefined header");
  assert.equal(result.error, "Missing Authorization header", "error message must be stable for missing header");
});

test("parseAuthorizationHeader: rejects null header", () => {
  const result = parseAuthorizationHeader(null);
  assert.equal(result.ok, false, "ok must be false for null header");
  assert.equal(result.error, "Missing Authorization header", "error message must be stable for null header");
});

test("parseAuthorizationHeader: rejects empty string header", () => {
  const result = parseAuthorizationHeader("");
  assert.equal(result.ok, false, "ok must be false for empty string header");
  assert.equal(result.error, "Missing Authorization header", "error message must be stable for empty header");
});

test("parseAuthorizationHeader: rejects malformed header with too many parts", () => {
  const result = parseAuthorizationHeader("Bearer abc 123");
  assert.equal(result.ok, false, "ok must be false for malformed header with extra parts");
  assert.equal(result.error, "Malformed Authorization header", "error message must be stable for malformed header");
});

test("parseAuthorizationHeader: accepts case-insensitive Bearer keyword", () => {
  const result = parseAuthorizationHeader("bearer abc123");
  assert.equal(result.ok, true, "ok must be true for lowercase 'bearer'");
  assert.equal(result.token, "abc123", "token must be extracted exactly as-is");
});

test("parseAuthorizationHeader: accepts tab separator between Bearer and token", () => {
  const result = parseAuthorizationHeader("Bearer\tabc123");
  assert.equal(result.ok, true, "ok must be true for tab separator");
  assert.equal(result.token, "abc123", "token must be extracted with tab separator");
});

test("parseAuthorizationHeader: accepts double-space separator", () => {
  const result = parseAuthorizationHeader("Bearer  abc123");
  assert.equal(result.ok, true, "ok must be true for double-space separator");
  assert.equal(result.token, "abc123", "token must be extracted with double-space separator");
});

test("parseAuthorizationHeader: rejects non-Bearer scheme", () => {
  const result = parseAuthorizationHeader("Basic abc123");
  assert.equal(result.ok, false, "ok must be false for non-Bearer scheme");
  assert.equal(result.error, "Unsupported authorization scheme", "error message must be stable for non-Bearer scheme");
});

test("requireBearerToken: returns token for valid Bearer header", () => {
  const token = requireBearerToken("Bearer xyz789");
  assert.equal(token, "xyz789", "must return the token string for valid header");
});

test("requireBearerToken: throws for missing header", () => {
  assert.throws(
    () => requireBearerToken(undefined),
    (err) => err.message === "Missing Authorization header",
    "must throw stable error for missing header"
  );
});

test("requireBearerToken: throws for malformed header", () => {
  assert.throws(
    () => requireBearerToken("Bearer abc 123"),
    (err) => err.message === "Malformed Authorization header",
    "must throw stable error for malformed header"
  );
});

test("requireBearerToken: throws for non-Bearer scheme", () => {
  assert.throws(
    () => requireBearerToken("Token abc123"),
    (err) => err.message === "Unsupported authorization scheme",
    "must throw stable error for non-Bearer scheme"
  );
});
