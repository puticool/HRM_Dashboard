// Validation rules
export const validationRules = {
  required: (value) => {
    return value ? null : "This field is required";
  },
  minLength: (length) => (value) => {
    return !value || value.length >= length
      ? null
      : `Must be at least ${length} characters`;
  },
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !value || emailRegex.test(value) ? null : "Invalid email format";
  },
  username: (value) => {
    // Allow alphanumeric characters, underscore and period
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    return !value || usernameRegex.test(value)
      ? null
      : "Username can only contain letters, numbers, underscore and period";
  },
  password: (value) => {
    // Password strength validation
    if (!value) return null;
    
    const errors = [];
    if (value.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(value)) errors.push("uppercase letter");
    if (!/[a-z]/.test(value)) errors.push("lowercase letter");
    if (!/[0-9]/.test(value)) errors.push("number");
    
    return errors.length > 0
      ? `Password must contain ${errors.join(", ")}`
      : null;
  }
};

// Validate a field with multiple rules
export const validateField = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
}; 