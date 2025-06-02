import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Term } from '../../types';
import { Rotate3D, ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from '../ui/Button';

interface FlashCardProps {
  term: Term;
  onMarkLearned: (learned: boolean) => void;
  showControls?: boolean;
  currentIndex?: number;
  totalCards?: number;
}

const FlashCard: React.FC<FlashCardProps> = ({
  term,
  onMarkLearned,
  showControls = true,
  currentIndex,
  totalCards
}) => {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const lastActionTime = useRef<number>(0);
  const isComponentMounted = useRef(true);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const answerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Сброс состояния при изменении термина или при монтировании/размонтировании
  useEffect(() => {
    isComponentMounted.current = true;
    
    setFlipped(false);
    setAnswered(false);
    setIsAnswerCorrect(null);
    setIsLocked(false);
    lastActionTime.current = 0;
    
    // Очистка таймаутов при размонтировании компонента
    return () => {
      isComponentMounted.current = false;
      
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
        flipTimeoutRef.current = null;
      }
      
      if (answerTimeoutRef.current) {
        clearTimeout(answerTimeoutRef.current);
        answerTimeoutRef.current = null;
      }
    };
  }, [term.id]);
  
  // Обработчик для переворота карточки с защитой от множественных вызовов
  const handleFlip = useCallback((e?: React.MouseEvent) => {
    // Предотвращаем множественные быстрые нажатия
    const now = Date.now();
    if (isLocked || now - lastActionTime.current < 180) return;
    
    lastActionTime.current = now;
    setIsLocked(true);
    
    if (e) {
      e.stopPropagation();
    }
    
    setFlipped(prev => !prev);
    
    // Разблокируем после анимации
    flipTimeoutRef.current = setTimeout(() => {
      if (isComponentMounted.current) {
        setIsLocked(false);
      }
      flipTimeoutRef.current = null;
    }, 300); // Соответствует длительности анимации
  }, [isLocked]);
  
  // Функция для обработки ответа с защитой от множественных вызовов
  const handleAnswer = useCallback((learned: boolean) => {
    // Предотвращаем повторные ответы или быстрые множественные нажатия
    if (answered || isLocked) return;
    
    const now = Date.now();
    if (now - lastActionTime.current < 180) return;
    
    lastActionTime.current = now;
    setIsLocked(true);
    setAnswered(true);
    setIsAnswerCorrect(learned);
    
    // Вызываем родительский обработчик с небольшой задержкой
    answerTimeoutRef.current = setTimeout(() => {
      if (isComponentMounted.current) {
        if (onMarkLearned) {
          onMarkLearned(learned);
        }
        
        // Разблокируем интерфейс через небольшое время
        setTimeout(() => {
          if (isComponentMounted.current) {
            setIsLocked(false);
          }
        }, 100);
      }
      answerTimeoutRef.current = null;
    }, 50);
  }, [answered, isLocked, onMarkLearned]);
  
  return (
    <div 
      className="relative w-full h-[300px] perspective-1000"
      onClick={showControls ? undefined : handleFlip}
      ref={cardRef}
      aria-label={`Карточка: ${term.term}`}
      role="button"
    >
      {/* Индикатор прогресса карточек, если предоставлены индексы */}
      {currentIndex !== undefined && totalCards !== undefined && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center">
          <span className="text-sm text-[color:var(--text-color)]/70">
            Карточка {currentIndex + 1} из {totalCards}
          </span>
        </div>
      )}
      
      <div 
        className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Передняя сторона карточки */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl bg-[color:var(--card-bg)] border-2 border-[color:var(--border-color)] p-6 flex flex-col justify-between
          ${flipped ? '' : 'shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.15)]'}`}
          aria-hidden={flipped}
        >
          <div className="flex justify-between items-center">
            <div className="px-2 py-1 rounded-full bg-[color:var(--bg-color)] text-xs text-[color:var(--text-color)]/70">
              Нажмите для переворота
            </div>
            <span className="text-xs text-[color:var(--text-color)]/70">Термин</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-2xl text-[color:var(--text-color)] text-center font-medium">{term.term}</h2>
          </div>
          
          {showControls && (
            <div className="flex justify-center">
              <Button 
                onClick={handleFlip}
                variant="outline"
                size="sm"
                icon={<Rotate3D size={16} />}
                disabled={isLocked}
              >
                Перевернуть
              </Button>
            </div>
          )}
        </div>
        
        {/* Задняя сторона карточки */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl bg-[color:var(--card-bg)] border-2 rotate-y-180 
          border-[color:var(--primary-color)] p-6 flex flex-col justify-between
          shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.2)]`}
          aria-hidden={!flipped}
        >
          <div className="flex justify-between items-center">
            {answered && (
              <div className={`px-2 py-1 rounded-full text-xs ${
                isAnswerCorrect 
                  ? 'bg-emerald-900/50 text-emerald-400' 
                  : 'bg-rose-900/50 text-rose-400'
              }`}>
                {isAnswerCorrect ? 'Отмечено как изученное' : 'Требует повторения'}
              </div>
            )}
            <span className="text-xs text-[color:var(--text-color)]/70">Определение</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-[color:var(--text-color)] text-center">{term.definition}</p>
          </div>
          
          {showControls && !answered && (
            <div className="flex justify-center gap-3">
              <Button 
                onClick={() => handleAnswer(false)}
                variant="outline"
                size="sm"
                icon={<ThumbsDown size={16} />}
                className="text-rose-400 hover:border-rose-500"
                disabled={isLocked}
              >
                Не знаю
              </Button>
              
              <Button 
                onClick={() => handleAnswer(true)}
                variant="outline"
                size="sm"
                icon={<ThumbsUp size={16} />}
                className="text-emerald-400 hover:border-emerald-500"
                disabled={isLocked}
              >
                Знаю
              </Button>
            </div>
          )}
          
          {showControls && answered && (
            <div className="flex justify-center">
              <Button 
                onClick={handleFlip}
                variant="outline"
                size="sm"
                icon={<Rotate3D size={16} />}
                disabled={isLocked}
              >
                Перевернуть обратно
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;