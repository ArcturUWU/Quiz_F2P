import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType } from '../../types';
import Card from '../ui/Card';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (correct: boolean) => void;
  showResult?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  showResult = true
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const lastActionTime = useRef<number>(0);
  const isComponentMounted = useRef(true);
  const answerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Управление монтированием компонента и очистка таймаутов
  useEffect(() => {
    isComponentMounted.current = true;
    
    return () => {
      isComponentMounted.current = false;
      
      if (answerTimeoutRef.current) {
        clearTimeout(answerTimeoutRef.current);
        answerTimeoutRef.current = null;
      }
      
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
        lockTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Сброс состояния при изменении вопроса
  useEffect(() => {
    setSelectedIndex(null);
    setAnswered(false);
    setIsLocked(false);
    lastActionTime.current = 0;
  }, [question.termId]);
  
  // Обработка выбора варианта ответа
  const handleOptionClick = useCallback((index: number) => {
    // Проверяем, не заблокирован ли интерфейс и не отвечен ли уже вопрос
    if (answered || isLocked) return;
    
    // Защита от быстрых множественных нажатий
    const now = Date.now();
    if (now - lastActionTime.current < 180) return;
    
    lastActionTime.current = now;
    setIsLocked(true);
    
    // Выбираем ответ
    setSelectedIndex(index);
    setAnswered(true);
    
    // Проверяем, правильный ли ответ выбран
    const isCorrect = index === question.correctIndex;
    
    // Вызываем обработчик ответа с небольшой задержкой
    answerTimeoutRef.current = setTimeout(() => {
      if (isComponentMounted.current) {
        onAnswer(isCorrect);
        
        // Разблокируем интерфейс через небольшое время
        lockTimeoutRef.current = setTimeout(() => {
          if (isComponentMounted.current) {
            setIsLocked(false);
          }
          lockTimeoutRef.current = null;
        }, 100);
      }
      answerTimeoutRef.current = null;
    }, 150);
  }, [answered, isLocked, question.correctIndex, onAnswer]);
  
  // Определяем классы для опций
  const getOptionClasses = useCallback((index: number) => {
    const baseClasses = "border border-[color:var(--border-color)] p-4 rounded-lg transition-all";
    const cursorClasses = isLocked ? "cursor-not-allowed" : "cursor-pointer";
    
    if (!answered || !showResult) {
      return `${baseClasses} ${cursorClasses} ${
        selectedIndex === index 
          ? "border-[color:var(--primary-color)] bg-[color:var(--bg-color)]" 
          : "hover:border-[color:var(--border-color)]"
      }`;
    }
    
    if (index === question.correctIndex) {
      return `${baseClasses} ${cursorClasses} border-emerald-500 bg-emerald-950/30`;
    }
    
    if (selectedIndex === index) {
      return `${baseClasses} ${cursorClasses} border-rose-500 bg-rose-950/30`;
    }
    
    return `${baseClasses} ${cursorClasses} opacity-50`;
  }, [answered, isLocked, selectedIndex, showResult, question.correctIndex]);
  
  return (
    <Card className="w-full">
      <h3 className="text-xl text-[color:var(--text-color)] mb-6">{question.term}</h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <div
            key={`option-${index}-${question.termId}`}
            className={getOptionClasses(index)}
            onClick={() => handleOptionClick(index)}
            data-testid={`quiz-option-${index}`}
          >
            <p className="text-[color:var(--text-color)]">{option}</p>
          </div>
        ))}
      </div>
      
      {answered && showResult && (
        <div className={`mt-4 p-3 rounded-lg ${
          selectedIndex === question.correctIndex
            ? "bg-emerald-950/30 border border-emerald-500"
            : "bg-rose-950/30 border border-rose-500"
        }`}>
          <p className={`text-sm ${
            selectedIndex === question.correctIndex
              ? "text-emerald-400"
              : "text-rose-400"
          }`}>
            {selectedIndex === question.correctIndex
              ? "Правильно! 👍"
              : `Неправильно. Правильный ответ: ${question.options[question.correctIndex]}`
            }
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuizQuestion;