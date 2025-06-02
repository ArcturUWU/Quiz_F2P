import React from 'react';
import { useModules } from '../contexts/ModuleContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Empty from '../components/ui/Empty';
import { BarChart3, Calendar, Clock, Award, BookOpen } from 'lucide-react';
import { calculateProgress } from '../utils/studyHelpers';
import { StudyMode } from '../types';

const StatsPage: React.FC = () => {
  const { modules, stats } = useModules();
  
  // Если нет модулей или статистики
  if (modules.length === 0 || stats.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Статистика</h1>
          
          <Empty
            title="Нет данных для статистики"
            description="Начните изучение модулей, чтобы здесь появилась статистика"
            icon={<BarChart3 size={32} />}
          />
        </div>
      </Layout>
    );
  }
  
  // Общая статистика
  const totalTerms = modules.reduce((sum, module) => sum + module.terms.length, 0);
  const totalLearned = stats.reduce((sum, stat) => sum + stat.learned, 0);
  const totalProgress = totalTerms > 0 ? Math.round((totalLearned / totalTerms) * 100) : 0;
  
  // Общее количество сессий обучения
  const totalSessions = stats.reduce((sum, stat) => sum + stat.studyHistory.length, 0);
  
  // Общее время обучения в секундах
  const totalTimeSpent = stats.reduce((sum, stat) => 
    sum + stat.studyHistory.reduce((innerSum, session) => innerSum + session.timeSpent, 0), 0);
  
  // Форматирование времени
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} ч ${minutes} мин`;
    }
    return `${minutes} мин`;
  };
  
  // Получение названия режима
  const getModeText = (mode: StudyMode) => {
    switch (mode) {
      case 'flashcards': return 'Карточки';
      case 'quiz': return 'Тест';
      case 'writing': return 'Письменный ответ';
    }
  };
  
  // Получение последних сессий из всех модулей
  const getRecentSessions = () => {
    const allSessions = stats.flatMap(stat => 
      stat.studyHistory.map(session => ({
        ...session,
        moduleId: stat.moduleId
      }))
    );
    
    return allSessions
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  };
  
  const recentSessions = getRecentSessions();
  
  // Статистика по режимам обучения
  const modeStats = {
    flashcards: { count: 0, score: 0 },
    quiz: { count: 0, score: 0 },
    writing: { count: 0, score: 0 }
  };
  
  stats.forEach(stat => {
    stat.studyHistory.forEach(session => {
      modeStats[session.mode].count += 1;
      modeStats[session.mode].score += session.score;
    });
  });
  
  // Вычисление среднего балла для каждого режима
  Object.keys(modeStats).forEach(mode => {
    const typedMode = mode as StudyMode;
    if (modeStats[typedMode].count > 0) {
      modeStats[typedMode].score = Math.round(modeStats[typedMode].score / modeStats[typedMode].count);
    }
  });
  
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
        <h1 className="text-3xl font-bold text-white mb-8">Статистика</h1>
        
        {/* Общая статистика */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-[color:var(--primary-color)] mb-3">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">{totalLearned} из {totalTerms}</h3>
              <p className="text-sm text-gray-400">Изучено терминов</p>
            </div>
          </Card>
          
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-[color:var(--primary-color)] mb-3">
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">{totalSessions}</h3>
              <p className="text-sm text-gray-400">Сессий обучения</p>
            </div>
          </Card>
          
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-[color:var(--primary-color)] mb-3">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">{formatTime(totalTimeSpent)}</h3>
              <p className="text-sm text-gray-400">Времени обучения</p>
            </div>
          </Card>
          
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-[color:var(--primary-color)] mb-3">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">{totalProgress}%</h3>
              <p className="text-sm text-gray-400">Общий прогресс</p>
            </div>
          </Card>
        </div>
        
        {/* Прогресс по модулям */}
        <Card className="mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Прогресс по модулям</h2>
          
          <div className="space-y-6">
            {modules.map(module => {
              const moduleStats = stats.find(s => s.moduleId === module.id);
              const progress = moduleStats ? calculateProgress(moduleStats) : 0;
              
              return (
                <div key={module.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">{module.title}</h3>
                    <span className="text-sm text-gray-400">
                      {moduleStats?.learned || 0} из {module.terms.length}
                    </span>
                  </div>
                  <ProgressBar value={progress} showLabel={false} />
                </div>
              );
            })}
          </div>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Статистика по режимам */}
          <Card>
            <h2 className="text-xl font-medium text-white mb-6">Статистика по режимам</h2>
            
            <div className="space-y-4">
              {Object.entries(modeStats).map(([mode, data]) => {
                const typedMode = mode as StudyMode;
                return (
                  <div key={mode} className="flex justify-between items-center p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-[color:var(--primary-color)] mr-3">
                        {typedMode === 'flashcards' ? <BookOpen size={20} /> : 
                         typedMode === 'quiz' ? <Award size={20} /> : 
                         <Calendar size={20} />}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{getModeText(typedMode)}</h3>
                        <p className="text-xs text-gray-400">{data.count} сессий</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-white">{data.score}%</div>
                      <p className="text-xs text-gray-400">средний балл</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Последние сессии */}
          <Card>
            <h2 className="text-xl font-medium text-white mb-6">Последние сессии</h2>
            
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session, index) => {
                  const module = modules.find(m => m.id === session.moduleId);
                  
                  return (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-800">
                      <div>
                        <h3 className="font-medium text-white">{module?.title || 'Неизвестный модуль'}</h3>
                        <p className="text-xs text-gray-400">
                          {getModeText(session.mode)} • {formatDate(session.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium text-white">{session.score}%</div>
                        <p className="text-xs text-gray-400">{formatTime(session.timeSpent)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">Нет данных о сессиях</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StatsPage;
