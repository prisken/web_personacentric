/**
 * Validation Utilities
 * Centralized validation functions for forms and data
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation
export const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Number validation
export const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Minimum length validation
export const hasMinLength = (value, minLength) => {
  if (typeof value === 'string') {
    return value.length >= minLength;
  }
  return false;
};

// Maximum length validation
export const hasMaxLength = (value, maxLength) => {
  if (typeof value === 'string') {
    return value.length <= maxLength;
  }
  return false;
};

// Range validation for numbers
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      const { type, message, ...params } = rule;
      
      let isValid = true;
      
      switch (type) {
        case 'required':
          isValid = isRequired(value);
          break;
        case 'email':
          isValid = isValidEmail(value);
          break;
        case 'password':
          isValid = isValidPassword(value);
          break;
        case 'phone':
          isValid = isValidPhoneNumber(value);
          break;
        case 'url':
          isValid = isValidUrl(value);
          break;
        case 'date':
          isValid = isValidDate(value);
          break;
        case 'number':
          isValid = isValidNumber(value);
          break;
        case 'minLength':
          isValid = hasMinLength(value, params.length);
          break;
        case 'maxLength':
          isValid = hasMaxLength(value, params.length);
          break;
        case 'range':
          isValid = isInRange(value, params.min, params.max);
          break;
        case 'creditCard':
          isValid = isValidCreditCard(value);
          break;
        case 'custom':
          isValid = params.validator ? params.validator(value) : true;
          break;
        default:
          isValid = true;
      }
      
      if (!isValid) {
        errors[field] = message;
        return; // Stop checking other rules for this field
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const VALIDATION_RULES = {
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email address' }
  ],
  
  password: [
    { type: 'required', message: 'Password is required' },
    { type: 'password', message: 'Password must be at least 8 characters with uppercase, lowercase, and number' }
  ],
  
  confirmPassword: (password) => [
    { type: 'required', message: 'Please confirm your password' },
    { 
      type: 'custom', 
      message: 'Passwords do not match',
      validator: (value) => value === password
    }
  ],
  
  phone: [
    { type: 'required', message: 'Phone number is required' },
    { type: 'phone', message: 'Please enter a valid phone number' }
  ],
  
  required: (fieldName) => [
    { type: 'required', message: `${fieldName} is required` }
  ],
  
  name: [
    { type: 'required', message: 'Name is required' },
    { type: 'minLength', message: 'Name must be at least 2 characters', length: 2 },
    { type: 'maxLength', message: 'Name must be less than 50 characters', length: 50 }
  ],
  
  title: [
    { type: 'required', message: 'Title is required' },
    { type: 'minLength', message: 'Title must be at least 3 characters', length: 3 },
    { type: 'maxLength', message: 'Title must be less than 200 characters', length: 200 }
  ],
  
  description: [
    { type: 'required', message: 'Description is required' },
    { type: 'minLength', message: 'Description must be at least 10 characters', length: 10 },
    { type: 'maxLength', message: 'Description must be less than 1000 characters', length: 1000 }
  ],
  
  url: [
    { type: 'url', message: 'Please enter a valid URL' }
  ],
  
  date: [
    { type: 'required', message: 'Date is required' },
    { type: 'date', message: 'Please enter a valid date' }
  ],
  
  number: [
    { type: 'required', message: 'Number is required' },
    { type: 'number', message: 'Please enter a valid number' }
  ],
  
  positiveNumber: [
    { type: 'required', message: 'Number is required' },
    { type: 'number', message: 'Please enter a valid number' },
    { type: 'range', message: 'Number must be greater than 0', min: 0.01, max: Infinity }
  ]
};

// Sanitization functions
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return html;
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeInput(input[key]);
    });
    return sanitized;
  }
  return input;
};