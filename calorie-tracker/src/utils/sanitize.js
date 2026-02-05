import DOMPurify from 'dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @param {boolean} allowBasicFormatting - If true, allows basic HTML tags like <b>, <i>, <em>, <strong>
 * @returns {string} - The sanitized string
 */
export function sanitizeInput(input, allowBasicFormatting = false) {
  if (typeof input !== 'string') {
    return '';
  }

  // For plain text (no HTML allowed)
  if (!allowBasicFormatting) {
    // Strip all HTML tags and return plain text
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  }

  // For basic formatting (allow minimal HTML)
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitizes an object's string properties recursively
 * @param {Object} obj - The object to sanitize
 * @returns {Object} - The sanitized object
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
