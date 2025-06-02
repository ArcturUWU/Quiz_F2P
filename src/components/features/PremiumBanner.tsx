import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const PremiumBanner: React.FC = () => {
  return (
    <div className="bg-[color:var(--card-bg)] border border-[color:var(--border-color)] rounded-xl p-4 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[color:var(--primary-color)]/20 text-[color:var(--primary-color)] mr-4">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[color:var(--text-color)]">
              Улучшите ваш опыт обучения с Premium
            </h3>
            <p className="text-sm text-[color:var(--text-color)]/70">
              Неограниченное количество модулей, расширенная статистика и многое другое
            </p>
          </div>
        </div>
        <Button
          as={Link}
          to="/pricing"
          size="sm"
          className="whitespace-nowrap"
        >
          Узнать больше
        </Button>
      </div>
    </div>
  );
};

export default PremiumBanner;