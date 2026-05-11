'use strict'

/**
 * Parse an Authorization header value.
 * - "Bearer" keyword is matched case-insensitively
 * - The token is returned exactly as provided
 * - A single space, multiple spaces, or a tab between "Bearer" and the token are all accepted
 *
 * @param {string|undefined|null} header
 * @returns {{ ok: true, token: string } | { ok: false, error: string }}
 */
function parseAuthorizationHeader(header) {
  if (!header || typeof header !== 'string') {
    return { ok: false, error: 'Missing authorization header' }
  }

  // Match the Bearer keyword (case-insensitive) with a whitespace separator
  const match = header.match(/^bearer[\s\t]+(.*)$/i)
  if (!match) {
    return { ok: false, error: 'Malformed authorization header' }
  }

  const token = match[1]
  if (!token) {
    return { ok: false, error: 'Missing bearer token' }
  }

  return { ok: true, token }
}

/**
 * Require a valid Bearer token from an Authorization header.
 * Returns the token string on success; throws on any failure.
 *
 * @param {string|undefined|null} header
 * @returns {string}
 * @throws {{ message: string }}
 */
function requireBearerToken(header) {
  const result = parseAuthorizationHeader(header)
  if (result.ok) {
    return result.token
  }
  throw new Error(result.error)
}

module.exports = { parseAuthorizationHeader, requireBearerToken }
