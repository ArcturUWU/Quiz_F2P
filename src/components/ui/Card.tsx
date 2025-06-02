import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  // Базовые классы
  const baseClasses = "bg-[color:var(--card-bg)] border border-[color:var(--border-color)] rounded-xl transition-all duration-300";
  
  // Классы для размеров padding
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7"
  };
  
  // Классы для вариантов
  const variantClasses = {
    default: "",
    hover: "hover:border-[color:var(--primary-color)] hover:shadow-[0_0_20px_rgba(var(--primary-color-rgb),0.3)]",
    glow: "border-[color:var(--primary-color)] shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.5)]"
  };
  
  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;