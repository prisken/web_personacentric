// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Minimum length validation
export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

// Maximum length validation
export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength;
};

// Number validation
export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

// Positive number validation
export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

// Date validation
export const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Future date validation
export const validateFutureDate = (date) => {
  if (!validateDate(date)) return false;
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj > now;
};

// File size validation (in bytes)
export const validateFileSize = (file, maxSize) => {
  return file && file.size <= maxSize;
};

// File type validation
export const validateFileType = (file, allowedTypes) => {
  return file && allowedTypes.includes(file.type);
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }

    if (value && fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
      return;
    }

    if (value && fieldRules.password && !validatePassword(value)) {
      errors[field] = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      return;
    }

    if (value && fieldRules.phone && !validatePhoneNumber(value)) {
      errors[field] = 'Invalid phone number format';
      return;
    }

    if (value && fieldRules.url && !validateURL(value)) {
      errors[field] = 'Invalid URL format';
      return;
    }

    if (value && fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
      return;
    }

    if (value && fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `${field} must be no more than ${fieldRules.maxLength} characters`;
      return;
    }

    if (value && fieldRules.number && !validateNumber(value)) {
      errors[field] = `${field} must be a number`;
      return;
    }

    if (value && fieldRules.positiveNumber && !validatePositiveNumber(value)) {
      errors[field] = `${field} must be a positive number`;
      return;
    }

    if (value && fieldRules.date && !validateDate(value)) {
      errors[field] = 'Invalid date format';
      return;
    }

    if (value && fieldRules.futureDate && !validateFutureDate(value)) {
      errors[field] = 'Date must be in the future';
      return;
    }

    if (value && fieldRules.custom) {
      const customError = fieldRules.custom(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
}; 