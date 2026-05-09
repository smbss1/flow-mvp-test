const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseAuthorizationHeader,
  requireBearerToken,
} = require("../src/auth.js");

test("parseAuthorizationHeader: returns ok with token for valid Bearer header", () => {
  const result = parseAuthorizationHeader("Bearer abc123");
  assert.deepEqual(result, { ok: true, token: "abc123" }, "should parse valid Bearer token");
});

test("parseAuthorizationHeader: returns error for missing header (null)", () => {
  const result = parseAuthorizationHeader(null);
  assert.equal(result.ok, false, "ok should be false for null header");
  assert.equal(result.error, "Missing Authorization header", "should report missing header");
});

test("parseAuthorizationHeader: returns error for missing header (undefined)", () => {
  const result = parseAuthorizationHeader(undefined);
  assert.equal(result.ok, false, "ok should be false for undefined header");
  assert.equal(result.error, "Missing Authorization header", "should report missing header");
});

test("parseAuthorizationHeader: returns error for empty string header", () => {
  const result = parseAuthorizationHeader("");
  assert.equal(result.ok, false, "ok should be false for empty string");
  assert.equal(result.error, "Missing Authorization header", "should report missing header");
});

test("parseAuthorizationHeader: returns error for malformed header with too many parts", () => {
  const result = parseAuthorizationHeader("Bearer token extra");
  assert.equal(result.ok, false, "ok should be false for malformed header");
  assert.equal(result.error, "Malformed Authorization header", "should report malformed header");
});

test("parseAuthorizationHeader: returns error for non-Bearer scheme (Basic)", () => {
  const result = parseAuthorizationHeader("Basic dXNlcjpwYXNz");
  assert.equal(result.ok, false, "ok should be false for Basic auth");
  assert.equal(result.error, "Unsupported authorization scheme", "should report unsupported scheme");
});

test("parseAuthorizationHeader: returns error for Bearer with empty token", () => {
  const result = parseAuthorizationHeader("Bearer ");
  assert.equal(result.ok, false, "ok should be false for Bearer with empty token");
  assert.equal(result.error, "Missing bearer token", "should report missing token");
});

test("requireBearerToken: returns token for valid header", () => {
  const token = requireBearerToken("Bearer secret");
  assert.equal(token, "secret", "should return the token string");
});

test("requireBearerToken: throws for missing header", () => {
  assert.throws(
    () => requireBearerToken(null),
    { message: "Missing Authorization header" },
    "should throw with missing header message"
  );
});

test("requireBearerToken: throws for malformed header", () => {
  assert.throws(
    () => requireBearerToken("Bearer x y"),
    { message: "Malformed Authorization header" },
    "should throw with malformed header message"
  );
});

test("requireBearerToken: throws for non-Bearer scheme", () => {
  assert.throws(
    () => requireBearerToken("Basic abc"),
    { message: "Unsupported authorization scheme" },
    "should throw with unsupported scheme message"
  );
});
