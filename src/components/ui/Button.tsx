import React, { ButtonHTMLAttributes, ElementType, ComponentPropsWithoutRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

// Создаем тип, который может принимать любой компонент и его пропсы
type PolymorphicComponentProp<C extends ElementType, Props = {}> = {
  as?: C;
} & ComponentPropsWithoutRef<C> & Props;

// Создаем тип для наших пропсов кнопки
type ButtonOwnProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
};

// Объединяем собственные пропсы с полиморфными
export type ButtonProps<C extends ElementType = 'button'> = 
  PolymorphicComponentProp<C, ButtonOwnProps>;

const Button = <C extends ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}: ButtonProps<C>) => {
  const { primaryColor } = useTheme();
  const Component = as || 'button';
  
  // Базовые классы
  const baseClasses = "rounded-full font-medium transition-all duration-300 flex items-center justify-center";
  
  // Классы для размеров
  const sizeClasses = {
    sm: "text-sm px-4 py-1.5",
    md: "px-6 py-2.5",
    lg: "text-lg px-8 py-3"
  };
  
  // Классы для вариантов
  const variantClasses = {
    primary: `bg-[color:var(--bg-color)] border-2 border-[color:var(--primary-color)] text-[color:var(--primary-color)] 
              hover:bg-[color:var(--primary-color)] hover:text-[color:var(--bg-color)] 
              hover:shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.7)]`,
    secondary: `bg-[color:var(--card-bg)] text-[color:var(--text-color)] 
                hover:text-[color:var(--primary-color)] 
                hover:shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.3)]`,
    outline: `bg-transparent border-2 border-[color:var(--border-color)] text-[color:var(--text-color)] 
              hover:border-[color:var(--primary-color)] hover:text-[color:var(--primary-color)]
              hover:shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.3)]`
  };
  
  // Устанавливаем CSS переменную с RGB значением для тени
  React.useEffect(() => {
    // Конвертируем hex в rgb для использования в rgba
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '138, 43, 226'; // Значение по умолчанию для фиолетового
    };
    
    document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(primaryColor));
  }, [primaryColor]);

  // Обработка случая, когда компонент рендерится как Link из React Router
  if (Component === Link) {
    return (
      <Link
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </Link>
    );
  }
  
  return (
    <Component
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </Component>
  );
};

export default Button;