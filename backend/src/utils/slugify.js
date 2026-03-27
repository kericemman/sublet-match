/**
 * Converts a string into a URL-friendly slug
 * @param {string} str - The string to slugify
 * @returns {string} The slugified string
 */
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

module.exports = slugify;