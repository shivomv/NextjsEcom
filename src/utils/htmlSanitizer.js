import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */

/**
 * Default sanitization config
 */
const DEFAULT_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SAFE_FOR_TEMPLATES: true
};

/**
 * Strict sanitization config (for user-generated content)
 */
const STRICT_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SAFE_FOR_TEMPLATES: true
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content to sanitize
 * @param {Object} config - Custom sanitization config
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html, config = DEFAULT_CONFIG) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitize HTML with strict rules (for user-generated content)
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeUserHtml(html) {
  return sanitizeHtml(html, STRICT_CONFIG);
}

/**
 * Strip all HTML tags from content
 * @param {string} html - HTML content
 * @returns {string} - Plain text
 */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

const htmlSanitizer = {
  sanitizeHtml,
  sanitizeUserHtml,
  stripHtml
};

export default htmlSanitizer;
