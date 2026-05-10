const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseAuthorizationHeader, requireBearerToken } = require("../src/auth.js");

// ── parseAuthorizationHeader ────────────────────────────────────────────

test("parseAuthorizationHeader: accepts valid Bearer token", () => {
  const result = parseAuthorizationHeader("Bearer abc123");
  assert.deepStrictEqual(result, { ok: true, token: "abc123" });
});

test("parseAuthorizationHeader: rejects null/undefined header", () => {
  assert.deepStrictEqual(parseAuthorizationHeader(null), { ok: false, error: "Missing authorization header" });
  assert.deepStrictEqual(parseAuthorizationHeader(undefined), { ok: false, error: "Missing authorization header" });
});

test("parseAuthorizationHeader: rejects empty string", () => {
  assert.deepStrictEqual(parseAuthorizationHeader(""), { ok: false, error: "Missing authorization header" });
});

test("parseAuthorizationHeader: rejects non-bearer scheme", () => {
  assert.deepStrictEqual(parseAuthorizationHeader("Basic abc123"), { ok: false, error: "Non-bearer authorization header" });
});

test("parseAuthorizationHeader: case-insensitive Bearer keyword", () => {
  assert.deepStrictEqual(parseAuthorizationHeader("bearer abc123"), { ok: true, token: "abc123" });
  assert.deepStrictEqual(parseAuthorizationHeader("BEARER abc123"), { ok: true, token: "abc123" });
});

test("parseAuthorizationHeader: exact match on token (no trimming)", () => {
  const result = parseAuthorizationHeader("Bearer  abc123 ");
  // double-space before token → malformed
  assert.deepStrictEqual(result, { ok: false, error: "Malformed authorization header" });
});

test("parseAuthorizationHeader: rejects double space between Bearer and token", () => {
  assert.deepStrictEqual(parseAuthorizationHeader("Bearer  abc123"), { ok: false, error: "Malformed authorization header" });
});

test("parseAuthorizationHeader: accepts tab between Bearer and token", () => {
  assert.deepStrictEqual(parseAuthorizationHeader("Bearer\tabc123"), { ok: true, token: "abc123" });
});

test("parseAuthorizationHeader: rejects header with only Bearer keyword", () => {
  assert.deepStrictEqual(parseAuthorizationHeader("Bearer"), { ok: false, error: "Malformed authorization header" });
});

// ── requireBearerToken ───────────────────────────────────────────────────

test("requireBearerToken: returns token on valid header", () => {
  assert.equal(requireBearerToken("Bearer xyz789"), "xyz789");
});

test("requireBearerToken: throws on missing header", () => {
  assert.throws(
    () => requireBearerToken(null),
    { message: "Missing authorization header" }
  );
});

test("requireBearerToken: throws on malformed header", () => {
  assert.throws(
    () => requireBearerToken("Bearer  double"),
    { message: "Malformed authorization header" }
  );
});

test("requireBearerToken: throws on non-bearer scheme", () => {
  assert.throws(
    () => requireBearerToken("Token abc"),
    { message: "Non-bearer authorization header" }
  );
});
