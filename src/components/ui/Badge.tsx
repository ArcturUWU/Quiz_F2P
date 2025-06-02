import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm'
}) => {
  // Базовые классы
  const baseClasses = "inline-flex items-center justify-center rounded-full font-medium";
  
  // Классы для размеров
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1"
  };
  
  // Классы для вариантов
  const variantClasses = {
    default: "bg-gray-800 text-gray-300",
    success: "bg-emerald-950 text-emerald-400 border border-emerald-500",
    warning: "bg-amber-950 text-amber-400 border border-amber-500",
    error: "bg-rose-950 text-rose-400 border border-rose-500",
    info: "bg-blue-950 text-blue-400 border border-blue-500"
  };
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
