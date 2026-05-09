/**
 * Parse an Authorization header value.
 * Accepts 'Bearer <token>' and rejects everything else.
 *
 * @param {string|undefined|null} header
 * @returns {{ ok: true, token: string } | { ok: false, error: string }}
 */
function parseAuthorizationHeader(header) {
  if (!header) {
    return { ok: false, error: "Missing Authorization header" };
  }

  if (typeof header !== "string") {
    return { ok: false, error: "Authorization header must be a string" };
  }

  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return { ok: false, error: "Malformed Authorization header: expected 'Bearer <token>'" };
  }

  const token = parts[1];

  if (token.length === 0) {
    return { ok: false, error: "Empty bearer token" };
  }

  return { ok: true, token };
}

/**
 * Require a valid Bearer token from an Authorization header.
 * Returns the token string on success; throws on any failure.
 *
 * @param {string|undefined|null} header
 * @returns {string}
 * @throws {Error}
 */
function requireBearerToken(header) {
  const result = parseAuthorizationHeader(header);

  if (result.ok) {
    return result.token;
  }

  throw new Error(result.error);
}

module.exports = { parseAuthorizationHeader, requireBearerToken };
