import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Award, RotateCcw, BookOpen } from 'lucide-react';
import { StudyMode } from '../../types';

interface StudyResultsProps {
  mode: StudyMode;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  onRestart: () => void;
  onFinish: () => void;
}

const StudyResults: React.FC<StudyResultsProps> = ({
  mode,
  totalQuestions,
  correctAnswers,
  timeSpent,
  onRestart,
  onFinish
}) => {
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const [isActionLocked, setIsActionLocked] = useState(false);
  
  const lastActionTime = useRef<number>(0);
  const isComponentMounted = useRef(true);
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unlockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Управление монтированием компонента и очистка таймаутов
  useEffect(() => {
    isComponentMounted.current = true;
    
    return () => {
      isComponentMounted.current = false;
      
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current);
        actionTimeoutRef.current = null;
      }
      
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current);
        unlockTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Форматирование времени
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Получение текста режима
  const getModeText = useCallback((mode: StudyMode) => {
    switch (mode) {
      case 'flashcards': return 'Карточки';
      case 'quiz': return 'Тест';
      case 'writing': return 'Письменный ответ';
    }
  }, []);
  
  // Определение варианта бейджа в зависимости от результата
  const getScoreBadgeVariant = useCallback(() => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'info';
    if (score >= 50) return 'warning';
    return 'error';
  }, [score]);
  
  // Получение мотивационного сообщения в зависимости от результата
  const getMotivationalMessage = useCallback(() => {
    if (score >= 90) return 'Отличный результат! Вы отлично справились!';
    if (score >= 70) return 'Хороший результат! Вы на правильном пути.';
    if (score >= 50) return 'Неплохо! Продолжайте практиковаться.';
    return 'Не сдавайтесь! Регулярные тренировки помогут улучшить результат.';
  }, [score]);
  
  // Обработчик для кнопки "Начать заново"
  const handleRestartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActionLocked) return;
    
    // Защита от быстрых множественных нажатий
    const now = Date.now();
    if (now - lastActionTime.current < 180) return;
    
    lastActionTime.current = now;
    setIsActionLocked(true);
    
    // Вызываем callback с небольшой задержкой для визуальной обратной связи
    actionTimeoutRef.current = setTimeout(() => {
      if (isComponentMounted.current) {
        onRestart();
        
        // Разблокируем кнопки через некоторое время
        unlockTimeoutRef.current = setTimeout(() => {
          if (isComponentMounted.current) {
            setIsActionLocked(false);
          }
          unlockTimeoutRef.current = null;
        }, 300);
      }
      actionTimeoutRef.current = null;
    }, 50);
  }, [isActionLocked, onRestart]);
  
  // Обработчик для кнопки "Вернуться к модулю"
  const handleFinishClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActionLocked) return;
    
    // Защита от быстрых множественных нажатий
    const now = Date.now();
    if (now - lastActionTime.current < 180) return;
    
    lastActionTime.current = now;
    setIsActionLocked(true);
    
    // Вызываем callback с небольшой задержкой для визуальной обратной связи
    actionTimeoutRef.current = setTimeout(() => {
      if (isComponentMounted.current) {
        onFinish();
      }
      actionTimeoutRef.current = null;
    }, 50);
  }, [isActionLocked, onFinish]);
  
  return (
    <Card className="w-full">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="md:w-1/3 flex flex-col items-center text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[color:var(--bg-color)] flex items-center justify-center">
            <Award className="text-[color:var(--primary-color)]" size={42} />
          </div>
          <h2 className="text-2xl font-medium text-[color:var(--text-color)] mb-1">Результаты</h2>
          <Badge size="md" variant={getScoreBadgeVariant()}>
            {score}% правильных ответов
          </Badge>
          
          <p className="mt-3 text-[color:var(--text-color)]">{getMotivationalMessage()}</p>
        </div>
        
        <div className="md:w-2/3">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-[color:var(--border-color)]">
              <span className="text-[color:var(--text-color)]/70">Режим обучения</span>
              <span className="text-[color:var(--text-color)]">{getModeText(mode)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[color:var(--border-color)]">
              <span className="text-[color:var(--text-color)]/70">Правильных ответов</span>
              <span className="text-[color:var(--text-color)]">{correctAnswers} из {totalQuestions}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[color:var(--border-color)]">
              <span className="text-[color:var(--text-color)]/70">Затраченное время</span>
              <span className="text-[color:var(--text-color)]">{formatTime(timeSpent)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[color:var(--border-color)]">
              <span className="text-[color:var(--text-color)]/70">Среднее время на вопрос</span>
              <span className="text-[color:var(--text-color)]">
                {formatTime(Math.floor(timeSpent / totalQuestions))}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRestartClick}
              variant="outline"
              icon={<RotateCcw size={18} />}
              className="flex-1"
              disabled={isActionLocked}
              data-testid="restart-button"
            >
              Начать заново
            </Button>
            <Button
              onClick={handleFinishClick}
              icon={<BookOpen size={18} />}
              className="flex-1"
              disabled={isActionLocked}
              data-testid="finish-button"
            >
              Вернуться к модулю
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[color:var(--border-color)] text-center">
        <p className="text-sm text-[color:var(--text-color)]/50">
          Регулярные повторения помогут закрепить материал в долговременной памяти
        </p>
      </div>
    </Card>
  );
};

export default StudyResults;