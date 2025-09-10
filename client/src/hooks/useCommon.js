/**
 * Common Hooks
 * Reusable hooks for common functionality across components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import logger from '../utils/logger';

// Loading state hook
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const toggleLoading = useCallback(() => setLoading(prev => !prev), []);
  
  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading
  };
};

// Error state hook
export const useError = () => {
  const [error, setError] = useState(null);
  
  const setErrorMessage = useCallback((message) => {
    setError(message);
    logger.error('Component Error:', message);
  }, []);
  
  const clearError = useCallback(() => setError(null), []);
  
  return {
    error,
    setError: setErrorMessage,
    clearError
  };
};

// Async operation hook
export const useAsync = (asyncFunction, dependencies = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      logger.error('Async operation failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);
  
  return {
    loading,
    error,
    data,
    execute
  };
};

// Form state hook
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);
  
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);
  
  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return true;
    
    // Simple validation - can be enhanced with validation utility
    for (const rule of rules) {
      if (rule.required && (!value || value.toString().trim() === '')) {
        setFieldError(name, rule.message);
        return false;
      }
    }
    
    setFieldError(name, null);
    return true;
  }, [validationRules, setFieldError]);
  
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const fieldRules = validationRules[field];
      const value = values[field];
      
      for (const rule of fieldRules) {
        if (rule.required && (!value || value.toString().trim() === '')) {
          newErrors[field] = rule.message;
          isValid = false;
          break;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);
  
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setValue(name, fieldValue);
  }, [setValue]);
  
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setFieldTouched(name);
    validateField(name, value);
  }, [setFieldTouched, validateField]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    handleChange,
    handleBlur,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  };
};

// Modal state hook
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen
  };
};

// Tab state hook
export const useTabs = (initialTab = 0, tabs = []) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const setTab = useCallback((tabIndex) => {
    if (tabIndex >= 0 && tabIndex < tabs.length) {
      setActiveTab(tabIndex);
    }
  }, [tabs.length]);
  
  const nextTab = useCallback(() => {
    setActiveTab(prev => (prev + 1) % tabs.length);
  }, [tabs.length]);
  
  const prevTab = useCallback(() => {
    setActiveTab(prev => (prev - 1 + tabs.length) % tabs.length);
  }, [tabs.length]);
  
  return {
    activeTab,
    setActiveTab: setTab,
    nextTab,
    prevTab,
    activeTabData: tabs[activeTab] || null
  };
};

// Pagination hook
export const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
    setPageSize,
    setTotalItems,
    resetPagination,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);
  
  return { ref, isIntersecting, hasIntersected };
};

// Previous value hook
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Component mount tracking hook
export const useComponentMount = (componentName) => {
  useEffect(() => {
    logger.componentMount(componentName);
    
    return () => {
      logger.componentUnmount(componentName);
    };
  }, [componentName]);
};

// Performance tracking hook
export const usePerformance = (operationName) => {
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - startTime.current;
    logger.performance(operationName, duration);
  }, [operationName]);
};
