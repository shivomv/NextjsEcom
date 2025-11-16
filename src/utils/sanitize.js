/**
 * Input sanitization utilities to prevent NoSQL injection and other attacks
 */

/**
 * Sanitize user input to prevent NoSQL injection
 * Removes $ and . from beginning of keys and values
 */
export function sanitizeInput(input) {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    // Remove $ and . from beginning of string
    return input.replace(/^\$+/, '').replace(/^\./g, '');
  }

  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }

  if (typeof input === 'object') {
    const sanitized = {};
    Object.keys(input).forEach(key => {
      // Remove keys that start with $ or .
      if (!key.startsWith('$') && !key.startsWith('.')) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    });
    return sanitized;
  }

  return input;
}

/**
 * Sanitize MongoDB query parameters
 */
export function sanitizeQuery(query) {
  if (!query || typeof query !== 'object') {
    return query;
  }

  const sanitized = {};
  
  for (const [key, value] of Object.entries(query)) {
    // Skip MongoDB operators at top level (they're safe when we control them)
    if (key.startsWith('$')) {
      continue;
    }
    
    sanitized[key] = sanitizeInput(value);
  }
  
  return sanitized;
}

/**
 * Escape special regex characters in user input
 */
export function escapeRegex(string) {
  if (typeof string !== 'string') {
    return string;
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
