import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  // Базовые классы
  const baseClasses = "bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white transition-all duration-300 focus:outline-none focus:border-[color:var(--primary-color)] focus:shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.3)]";
  
  const inputClasses = `
    ${baseClasses}
    ${error ? 'border-red-500' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  return (
    <div className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-gray-300 mb-1.5 font-medium text-sm">
          {label}
        </label>
      )}
      <input ref={ref} className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
