import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({
  title = 'Ничего не найдено',
  description = 'Похоже, здесь пока ничего нет.',
  icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[color:var(--bg-color)] text-[color:var(--primary-color)]">
        {icon || <FileQuestion size={32} />}
      </div>
      <h3 className="text-xl font-medium text-[color:var(--text-color)] mb-2">{title}</h3>
      <p className="text-[color:var(--text-color)]/70 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};

export default Empty;