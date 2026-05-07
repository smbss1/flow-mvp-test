/**
 * Capitalizes the first character of a string.
 * - Uppercases the first character
 * - Leaves the rest unchanged
 * - Returns empty string for empty input
 *
 * @param {string} input
 * @returns {string}
 */
function capitalize(input) {
  if (!input) return "";
  return input[0].toUpperCase() + input.slice(1);
}

module.exports = { capitalize };
