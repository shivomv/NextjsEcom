/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} id - The string to check
 * @returns {boolean} - True if the string is a valid ObjectId
 */
export function isValidObjectId(id) {
  return id && id.match(/^[0-9a-fA-F]{24}$/);
}
