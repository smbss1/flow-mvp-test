/**
 * Converts a string to a URL-friendly slug.
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
