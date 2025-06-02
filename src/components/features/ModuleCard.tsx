import React from 'react';
import { StudyModule, StudyStats } from '../../types';
import { Book, MoreVertical, Calendar, Star } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { calculateProgress } from '../../utils/studyHelpers';

interface ModuleCardProps {
  module: StudyModule;
  stats?: StudyStats;
  onClick?: () => void;
  onOptionsClick?: (e: React.MouseEvent) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  stats,
  onClick,
  onOptionsClick
}) => {
  const progress = stats ? calculateProgress(stats) : 0;
  
  // Форматирование даты
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <Card 
      variant="hover" 
      className="cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[color:var(--bg-color)] flex items-center justify-center text-[color:var(--primary-color)] mr-3">
            <Book size={20} />
          </div>
          <div>
            <h3 className="font-medium text-[color:var(--text-color)] text-lg group-hover:text-[color:var(--primary-color)] transition-colors">
              {module.title}
            </h3>
            <p className="text-[color:var(--text-color)]/70 text-sm">
              {module.terms.length} {module.terms.length === 1 ? 'термин' : 
                module.terms.length > 1 && module.terms.length < 5 ? 'термина' : 'терминов'}
            </p>
          </div>
        </div>
        {onOptionsClick && (
          <button 
            className="p-1 rounded-full hover:bg-[color:var(--bg-color)] text-[color:var(--text-color)]/70 hover:text-[color:var(--text-color)]"
            onClick={(e) => { 
              e.stopPropagation();
              onOptionsClick(e);
            }}
          >
            <MoreVertical size={18} />
          </button>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-[color:var(--text-color)]/70 text-sm line-clamp-2 mb-4">
          {module.description || 'Нет описания'}
        </p>
        
        <div className="mt-4 mb-3">
          <ProgressBar value={progress} showLabel={false} />
          <p className="text-xs text-[color:var(--text-color)]/70 mt-1">
            Изучено: {stats?.learned || 0} из {module.terms.length}
          </p>
        </div>
        
        <div className="flex justify-between text-[color:var(--text-color)]/50 text-xs mt-4 pt-3 border-t border-[color:var(--border-color)]">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(module.createdAt)}</span>
          </div>
          {module.lastStudied && (
            <div className="flex items-center">
              <Star size={14} className="mr-1" />
              <span>Изучали {formatDate(module.lastStudied)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ModuleCard;