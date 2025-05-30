
import DOMPurify from 'dompurify';

export class InputSanitizer {
  private static readonly MAX_INPUT_LENGTH = 1000;
  private static readonly MAX_TEXT_LENGTH = 5000;

  /**
   * Sanitize form field input based on field type
   */
  static sanitizeField(value: string, fieldName: string): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Trim whitespace
    let sanitized = value.trim();

    // Apply length limits
    const maxLength = this.getMaxLength(fieldName);
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    // Field-specific sanitization
    switch (fieldName.toLowerCase()) {
      case 'email':
        return this.sanitizeEmail(sanitized);
      case 'phone':
      case 'telephone':
        return this.sanitizePhone(sanitized);
      case 'name':
      case 'firstname':
      case 'lastname':
      case 'first_name':
      case 'last_name':
        return this.sanitizeName(sanitized);
      case 'accesscode':
      case 'access_code':
        return this.sanitizeAccessCode(sanitized);
      case 'birthdate':
      case 'birth_date':
        return this.sanitizeDate(sanitized);
      default:
        return this.sanitizeText(sanitized);
    }
  }

  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
      ALLOWED_ATTR: [],
      FORBID_SCRIPT: true,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input']
    });
  }

  /**
   * Sanitize plain text (remove HTML/script content)
   */
  static sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  /**
   * Sanitize email addresses
   */
  private static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeText(email);
    // Basic email validation pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(sanitized) ? sanitized : '';
  }

  /**
   * Sanitize phone numbers
   */
  private static sanitizePhone(phone: string): string {
    // Allow only digits, spaces, hyphens, plus, and parentheses
    return phone.replace(/[^0-9\s\-\+\(\)]/g, '');
  }

  /**
   * Sanitize names (allow only letters, spaces, hyphens, apostrophes)
   */
  private static sanitizeName(name: string): string {
    const sanitized = this.sanitizeText(name);
    return sanitized.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
  }

  /**
   * Sanitize access codes (alphanumeric only)
   */
  private static sanitizeAccessCode(code: string): string {
    return code.replace(/[^A-Z0-9]/g, '');
  }

  /**
   * Sanitize date strings
   */
  private static sanitizeDate(date: string): string {
    // Allow only digits and hyphens for date format
    return date.replace(/[^0-9\-]/g, '');
  }

  /**
   * Get maximum length for field types
   */
  private static getMaxLength(fieldName: string): number {
    switch (fieldName.toLowerCase()) {
      case 'email':
        return 254;
      case 'phone':
      case 'telephone':
        return 20;
      case 'name':
      case 'firstname':
      case 'lastname':
      case 'first_name':
      case 'last_name':
        return 50;
      case 'accesscode':
      case 'access_code':
        return 20;
      case 'birthdate':
      case 'birth_date':
        return 10;
      default:
        return this.MAX_INPUT_LENGTH;
    }
  }
}
