/**
 * Bearer auth helpers.
 *
 * parseAuthorizationHeader: result-object style — returns { ok, token } or { ok, error }
 * requireBearerToken: throwing style — returns the token or throws
 *
 * Rules:
 *  - "Bearer" keyword is matched case-insensitively
 *  - Token value is matched exactly (no trimming, no case folding)
 *  - Exactly one space between "Bearer" and the token
 *  - Tab characters in the header are converted to spaces before parsing
 */

/**
 * @param {string} header – the raw Authorization header value
 * @returns {{ ok: true, token: string } | { ok: false, error: string }}
 */
function parseAuthorizationHeader(header) {
  if (header == null || header === "") {
    return { ok: false, error: "Missing authorization header" };
  }

  // Normalize tabs to spaces, then collapse so we can enforce single-space
  // separator while still accepting tab input.
  const normalized = header.replace(/\t/g, " ");
  const parts = normalized.split(" ");

  // After normalisation we expect exactly ["Bearer" (any case), "<token>"]
  // with no empty strings from consecutive spaces — that would mean the
  // original had double spaces which we reject.
  if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
    return { ok: false, error: "Malformed authorization header" };
  }

  if (parts[0].toLowerCase() !== "bearer") {
    return { ok: false, error: "Non-bearer authorization header" };
  }

  return { ok: true, token: parts[1] };
}

/**
 * @param {string} header – the raw Authorization header value
 * @returns {string} the bearer token
 * @throws {{ message: string }} stable error for missing / malformed / non-bearer
 */
function requireBearerToken(header) {
  const result = parseAuthorizationHeader(header);
  if (result.ok) return result.token;
  throw new Error(result.error);
}

module.exports = { parseAuthorizationHeader, requireBearerToken };
