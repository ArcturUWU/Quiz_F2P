import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Размеры для прогресс-бара
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`bg-[color:var(--primary-color)] ${sizeClasses[size]} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
