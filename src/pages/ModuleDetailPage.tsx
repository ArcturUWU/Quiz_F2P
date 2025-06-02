import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { Book, Edit, ArrowLeft, BarChart3, Calendar, Play } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import StudyModeSelector from '../components/features/StudyModeSelector';
import { StudyMode } from '../types';
import { calculateProgress } from '../utils/studyHelpers';

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { modules, stats, setCurrentModule } = useModules();
  const navigate = useNavigate();
  const [module, setModule] = useState(modules.find(m => m.id === moduleId));
  const [moduleStats, setModuleStats] = useState(stats.find(s => s.moduleId === moduleId));
  
  useEffect(() => {
    if (!moduleId || !modules.find(m => m.id === moduleId)) {
      navigate('/modules');
    } else {
      const currentModule = modules.find(m => m.id === moduleId);
      setModule(currentModule);
      setCurrentModule(currentModule || null);
      setModuleStats(stats.find(s => s.moduleId === moduleId));
    }
  }, [moduleId, modules, stats, navigate, setCurrentModule]);
  
  if (!module) {
    return null;
  }
  
  const progress = moduleStats ? calculateProgress(moduleStats) : 0;
  
  // Обработчик выбора режима обучения
  const handleStudyModeSelect = (mode: StudyMode) => {
    navigate(`/modules/${moduleId}/study/${mode}`);
  };
  
  // Форматирование даты
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Заголовок и кнопка назад */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate('/modules')}
              className="mr-4"
            >
              Все модули
            </Button>
            <h1 className="text-3xl font-bold text-white">{module.title}</h1>
          </div>
          
          <Button
            as={Link}
            to={`/modules/${module.id}/edit`}
            variant="outline"
            size="sm"
            icon={<Edit size={16} />}
          >
            Редактировать
          </Button>
        </div>
        
        {/* Информация о модуле */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="md:col-span-2">
            <h2 className="text-xl font-medium text-white mb-4">О модуле</h2>
            
            <p className="text-gray-300 mb-6">
              {module.description || 'Нет описания'}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center justify-between border-t border-gray-800 pt-4">
              <div className="flex items-center">
                <Book size={18} className="text-[color:var(--primary-color)] mr-2" />
                <span className="text-gray-300">
                  {module.terms.length} {module.terms.length === 1 ? 'термин' : 
                    module.terms.length > 1 && module.terms.length < 5 ? 'термина' : 'терминов'}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={18} className="text-[color:var(--primary-color)] mr-2" />
                <span className="text-gray-300">
                  Создан {formatDate(module.createdAt)}
                </span>
              </div>
            </div>
          </Card>
          
          <Card>
            <h2 className="text-xl font-medium text-white mb-4">Прогресс</h2>
            
            <div className="mb-4">
              <ProgressBar value={progress} showLabel size="lg" />
              <p className="text-center text-gray-400 mt-2">
                {moduleStats?.learned || 0} из {module.terms.length} терминов изучено
              </p>
            </div>
            
            {module.lastStudied && (
              <div className="text-center mt-4 text-sm text-gray-400">
                Последнее изучение: {formatDate(module.lastStudied)}
              </div>
            )}
            
            <div className="mt-6">
              <Button
                onClick={() => navigate(`/modules/${module.id}/study/flashcards`)}
                icon={<Play size={18} />}
                className="w-full"
              >
                Начать обучение
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Режимы обучения */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-white mb-6">Выберите режим обучения</h2>
          <StudyModeSelector onSelect={handleStudyModeSelect} />
        </div>
        
        {/* Список терминов */}
        <div>
          <h2 className="text-2xl font-medium text-white mb-6">Термины в этом модуле</h2>
          
          {module.terms.length > 0 ? (
            <div className="space-y-4">
              {module.terms.map((term, index) => (
                <Card key={term.id} variant="hover" padding="sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[color:var(--primary-color)]">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg text-white">{term.term}</h3>
                        <p className="text-gray-400">{term.definition}</p>
                      </div>
                    </div>
                    
                    {term.learned && (
                      <Badge variant="success" size="sm">Изучено</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-gray-400 mb-4">В этом модуле пока нет терминов</p>
              <Button
                as={Link}
                to={`/modules/${module.id}/edit`}
                variant="outline"
                icon={<Edit size={16} />}
              >
                Добавить термины
              </Button>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ModuleDetailPage;