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
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
}

/**
 * Converts a slug back to a readable string.
 * - Replaces hyphens with spaces
 * - Capitalizes the first letter
 *
 * @param {string} slug
 * @returns {string}
 */
function unslugify(slug) {
  if (!slug) return "";
  const spaced = slug.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

module.exports = { slugify, unslugify };
