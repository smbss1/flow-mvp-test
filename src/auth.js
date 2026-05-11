/**
 * Parses an Authorization header value.
 * - Accepts 'Bearer <token>' → { ok: true, token }
 * - Rejects missing, malformed, or non-Bearer headers → { ok: false, error }
 *
 * @param {string|undefined|null} header
 * @returns {{ ok: boolean, token?: string, error?: string }}
 */
function parseAuthorizationHeader(header) {
  if (!header) {
    return { ok: false, error: "Missing Authorization header" };
  }

  const parts = header.split(" ");

  if (parts.length !== 2) {
    return { ok: false, error: "Malformed Authorization header" };
  }

  if (parts[0] !== "Bearer") {
    return { ok: false, error: "Unsupported authorization scheme" };
  }

  const token = parts[1];
  if (!token) {
    return { ok: false, error: "Missing token after Bearer" };
  }

  return { ok: true, token };
}

/**
 * Returns the Bearer token or throws with a stable error message.
 *
 * @param {string|undefined|null} header
 * @returns {string}
 * @throws {Error}
 */
function requireBearerToken(header) {
  const result = parseAuthorizationHeader(header);
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.token;
}

module.exports = { parseAuthorizationHeader, requireBearerToken };
