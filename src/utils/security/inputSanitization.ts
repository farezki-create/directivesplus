
import DOMPurify from 'dompurify';

export class InputSanitizer {
  // Sanitize HTML content
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
      ALLOWED_ATTR: [],
      FORBID_SCRIPT: true,
      FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
    });
  }

  // Sanitize plain text input
  static sanitizeText(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove HTML brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/data:/gi, '') // Remove data protocol
      .replace(/vbscript:/gi, '') // Remove vbscript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000); // Limit length
  }

  // Sanitize file names
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid file name characters
      .replace(/\.\./g, '') // Remove directory traversal
      .replace(/^\./, '') // Remove leading dot
      .trim()
      .slice(0, 255); // Limit to 255 characters
  }

  // Validate and sanitize URLs
  static sanitizeUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      
      // Only allow specific protocols
      if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
        return null;
      }
      
      // Block suspicious patterns
      if (url.includes('javascript:') || url.includes('data:') || url.includes('vbscript:')) {
        return null;
      }
      
      return parsed.toString();
    } catch {
      return null;
    }
  }

  // Sanitize search queries
  static sanitizeSearchQuery(query: string): string {
    return query
      .replace(/[^\w\s\-_.àáâãäåæçèéêëìíîïñòóôõöùúûüý]/gi, '') // Only allow safe characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 100); // Limit length
  }

  // Validate and sanitize phone numbers
  static sanitizePhoneNumber(phone: string): string {
    return phone
      .replace(/[^\d\+\-\(\)\s]/g, '') // Only allow digits, +, -, (), space
      .trim();
  }

  // Sanitize postal codes
  static sanitizePostalCode(code: string): string {
    return code
      .replace(/[^\w\s\-]/g, '') // Only allow alphanumeric, space, dash
      .trim()
      .slice(0, 10);
  }

  // Generic field sanitizer based on field type
  static sanitizeField(value: string, fieldType: string): string {
    switch (fieldType) {
      case 'name':
      case 'firstName':
      case 'lastName':
        return value
          .replace(/[^a-zA-ZÀ-ÿ\s\-'\.]/g, '')
          .trim()
          .slice(0, 50);
      
      case 'email':
        return value
          .toLowerCase()
          .replace(/[^a-z0-9@\.\-_]/g, '')
          .trim()
          .slice(0, 254);
      
      case 'phone':
        return this.sanitizePhoneNumber(value);
      
      case 'postalCode':
        return this.sanitizePostalCode(value);
      
      case 'address':
        return value
          .replace(/[<>]/g, '')
          .trim()
          .slice(0, 200);
      
      case 'text':
      default:
        return this.sanitizeText(value);
    }
  }
}

// Add DOMPurify as a dependency if not already present
declare global {
  interface Window {
    DOMPurify: any;
  }
}
