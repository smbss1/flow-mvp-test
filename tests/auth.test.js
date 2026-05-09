const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseAuthorizationHeader, requireBearerToken } = require("../src/auth.js");

// --- parseAuthorizationHeader ---

test("parseAuthorizationHeader: returns ok with token for valid Bearer header", () => {
  const result = parseAuthorizationHeader("Bearer abc123");
  assert.deepEqual(result, { ok: true, token: "abc123" }, "should return ok:true with the extracted token");
});

test("parseAuthorizationHeader: rejects missing header (null/undefined/empty)", () => {
  assert.deepEqual(
    parseAuthorizationHeader(null),
    { ok: false, error: "Missing Authorization header" },
    "null header should yield missing error"
  );
  assert.deepEqual(
    parseAuthorizationHeader(undefined),
    { ok: false, error: "Missing Authorization header" },
    "undefined header should yield missing error"
  );
  assert.deepEqual(
    parseAuthorizationHeader(""),
    { ok: false, error: "Missing Authorization header" },
    "empty string header should yield missing error"
  );
});

test("parseAuthorizationHeader: rejects non-Bearer scheme", () => {
  const result = parseAuthorizationHeader("Basic dXNlcjpwYXNz");
  assert.equal(result.ok, false, "non-Bearer scheme should fail");
  assert.equal(result.error, "Malformed Authorization header: expected 'Bearer <token>'", "should give malformed error for wrong scheme");
});

test("parseAuthorizationHeader: rejects malformed header with no space", () => {
  const result = parseAuthorizationHeader("Bearer");
  assert.equal(result.ok, false, "header with no space should fail");
  assert.equal(result.error, "Malformed Authorization header: expected 'Bearer <token>'", "should give malformed error for missing token");
});

test("parseAuthorizationHeader: rejects empty bearer token", () => {
  const result = parseAuthorizationHeader("Bearer ");
  assert.equal(result.ok, false, "Bearer with empty token should fail");
  assert.equal(result.error, "Empty bearer token", "should give empty-token error");
});

test("parseAuthorizationHeader: rejects header with extra spaces", () => {
  const result = parseAuthorizationHeader("Bearer token extra");
  assert.equal(result.ok, false, "header with extra segments should fail");
  assert.equal(result.error, "Malformed Authorization header: expected 'Bearer <token>'", "should give malformed error for extra parts");
});

// --- requireBearerToken ---

test("requireBearerToken: returns token for valid header", () => {
  const token = requireBearerToken("Bearer my-secret");
  assert.equal(token, "my-secret", "should return the extracted token");
});

test("requireBearerToken: throws for missing header", () => {
  assert.throws(
    () => requireBearerToken(null),
    { message: "Missing Authorization header" },
    "should throw missing error for null header"
  );
});

test("requireBearerToken: throws for malformed header", () => {
  assert.throws(
    () => requireBearerToken("Basic abc"),
    { message: "Malformed Authorization header: expected 'Bearer <token>'" },
    "should throw malformed error for non-Bearer scheme"
  );
});
