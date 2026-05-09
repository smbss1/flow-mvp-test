/**
 * Parses an Authorization header value for Bearer token auth.
 *
 * @param {string|undefined|null} header - the raw Authorization header value
 * @returns {{ ok: true, token: string } | { ok: false, error: string }}
 */
function parseAuthorizationHeader(header) {
  if (!header) {
    return { ok: false, error: "Missing Authorization header" };
  }

  const parts = header.split(" ");

  if (parts.length !== 2) {
    return { ok: false, error: "Malformed Authorization header" };
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer") {
    return { ok: false, error: "Unsupported authorization scheme" };
  }

  if (!token) {
    return { ok: false, error: "Missing bearer token" };
  }

  return { ok: true, token };
}

/**
 * Requires a valid Bearer token from an Authorization header.
 * Returns the token string on success, throws on failure.
 *
 * @param {string|undefined|null} header - the raw Authorization header value
 * @returns {string} the bearer token
 * @throws {Error} with a stable message for missing, malformed, or non-bearer headers
 */
function requireBearerToken(header) {
  const result = parseAuthorizationHeader(header);

  if (result.ok) {
    return result.token;
  }

  throw new Error(result.error);
}

module.exports = { parseAuthorizationHeader, requireBearerToken };
