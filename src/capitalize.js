/**
 * Uppercases the first character of a string, leaving the rest unchanged.
 * Returns empty string for empty input.
 * @param {string} input
 * @returns {string}
 */
export function capitalize(input) {
  if (input.length === 0) return '';
  return input[0].toUpperCase() + input.slice(1);
}
