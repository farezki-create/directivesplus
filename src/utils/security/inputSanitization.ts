
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

    // Detect and prevent potential XSS attempts
    if (this.containsSuspiciousContent(sanitized)) {
      console.warn('Suspicious content detected in field:', fieldName);
      sanitized = this.removeSuspiciousContent(sanitized);
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
      case 'professional_id':
      case 'rpps':
      case 'adeli':
      case 'finess':
        return this.sanitizeProfessionalId(sanitized);
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
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe']
    });
  }

  /**
   * Sanitize plain text (remove HTML/script content)
   */
  static sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  /**
   * Detect suspicious content that might indicate XSS or injection attempts
   */
  private static containsSuspiciousContent(input: string): boolean {
    const suspiciousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /expression\(/gi,
      /url\(/gi,
      /@import/gi,
      /document\./gi,
      /window\./gi,
      /eval\(/gi,
      /function\(/gi
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Remove suspicious content
   */
  private static removeSuspiciousContent(input: string): string {
    let cleaned = input;
    
    // Remove script tags and their content
    cleaned = cleaned.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    
    // Remove event handlers
    cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: and data: URIs
    cleaned = cleaned.replace(/(javascript|data|vbscript):[^"'\s>]*/gi, '');
    
    // Remove potentially dangerous HTML tags
    cleaned = cleaned.replace(/<(script|iframe|object|embed|form|input)[^>]*>/gi, '');
    
    return cleaned;
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
   * Sanitize professional IDs (alphanumeric only)
   */
  private static sanitizeProfessionalId(id: string): string {
    return id.replace(/[^0-9]/g, '');
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
      case 'professional_id':
      case 'rpps':
      case 'adeli':
      case 'finess':
        return 15;
      case 'birthdate':
      case 'birth_date':
        return 10;
      default:
        return this.MAX_INPUT_LENGTH;
    }
  }

  /**
   * Validate and sanitize SMS content
   */
  static sanitizeSmsContent(content: string): string {
    if (!content || typeof content !== 'string') {
      return '';
    }

    // Remove potential malicious content
    let sanitized = this.sanitizeText(content);
    
    // Limit to SMS character limit
    sanitized = sanitized.substring(0, 160);
    
    // Remove line breaks that could interfere with SMS formatting
    sanitized = sanitized.replace(/\r?\n|\r/g, ' ');
    
    // Remove potential SMS injection characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    
    return sanitized.trim();
  }
}
