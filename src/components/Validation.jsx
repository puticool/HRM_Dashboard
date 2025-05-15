import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { validateField } from "@/utils/validation-utils";

// Input component with validation
const ValidatedInput = ({ 
  id, 
  label, 
  type = "text", 
  value, 
  onChange, 
  validationRules = [], 
  validateOnBlur = true,
  validateOnChange = false,
  placeholder,
  disabled = false,
  className = "",
  required = false,
  autoFocus = false,
  endAdornment,
  ...props 
}) => {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  // Validate when value changes and touched is true
  useEffect(() => {
    if ((touched && validateOnBlur) || validateOnChange) {
      const validationError = validateField(value, validationRules);
      setError(validationError);
    }
  }, [value, touched, validateOnBlur, validateOnChange, validationRules]);

  const handleBlur = () => {
    setTouched(true);
  };

  const baseInputClass = "w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-white dark:placeholder-slate-500";
  const validClass = "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800";
  const errorClass = "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20";
  
  const inputClass = `${baseInputClass} ${error ? errorClass : validClass} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
          required={required}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center px-3">
            {endAdornment}
          </div>
        )}
      </div>
      
      {error && (
        <div id={`${id}-error`} className="mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

ValidatedInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  validationRules: PropTypes.array,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  endAdornment: PropTypes.node
};

export default ValidatedInput; 