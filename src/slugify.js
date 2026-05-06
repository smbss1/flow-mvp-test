/**
 * Converts a string to a URL-safe slug.
 * - Lowercases input
 * - Replaces whitespace runs with hyphens
 * - Strips characters outside [a-z0-9-]
 * - Trims leading/trailing hyphens
 *
 * @param {string} input
 * @returns {string}
 */
function slugify(input) {
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
}

module.exports = { slugify };
