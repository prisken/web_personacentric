const ApiResponse = require('./apiResponse');

class Validation {
  static validateRequiredFields(req, res, requiredFields) {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return ApiResponse.badRequest(
        res, 
        `Missing required fields: ${missingFields.join(', ')}`,
        { missingFields }
      );
    }

    return null; // No validation error
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validatePhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
  }

  static sanitizeObject(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  static validatePagination(page, limit) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    return {
      page: Math.max(1, pageNum),
      limit: Math.min(100, Math.max(1, limitNum)),
      offset: (Math.max(1, pageNum) - 1) * Math.min(100, Math.max(1, limitNum))
    };
  }
}

module.exports = Validation; 