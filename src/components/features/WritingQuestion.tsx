import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Term } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface WritingQuestionProps {
  term: Term;
  onAnswer: (correct: boolean, answer: string) => void;
}

const WritingQuestion: React.FC<WritingQuestionProps> = ({ term, onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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
  
  // Сброс состояния при изменении термина
  useEffect(() => {
    setAnswer('');
    setSubmitted(false);
    setIsCorrect(false);
    setIsLocked(false);
    lastActionTime.current = 0;
  }, [term.id]);
  
  // Проверка ответа
  const checkAnswer = useCallback(() => {
    // Проверяем, не заблокирован ли интерфейс, не пустой ли ответ и не отвечен ли уже вопрос
    if (!answer.trim() || submitted || isLocked) return;
    
    // Защита от быстрых множественных нажатий
    const now = Date.now();
    if (now - lastActionTime.current < 180) return;
    
    lastActionTime.current = now;
    setIsLocked(true);
    
    // Проверка ответа
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedDefinition = term.definition.toLowerCase();
    
    // Считаем ответ правильным, если он совпадает с определением
    const isAnswerCorrect = normalizedAnswer === normalizedDefinition;
    
    setIsCorrect(isAnswerCorrect);
    setSubmitted(true);
    
    // Вызываем родительский обработчик с небольшой задержкой
    answerTimeoutRef.current = setTimeout(() => {
      if (isComponentMounted.current) {
        onAnswer(isAnswerCorrect, answer);
        
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
  }, [answer, submitted, isLocked, term.definition, onAnswer]);
  
  // Обработчик нажатия Enter для отправки ответа
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer.trim() && !submitted && !isLocked) {
      checkAnswer();
    }
  }, [answer, submitted, isLocked, checkAnswer]);
  
  // Обработчик изменения текста в поле ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  }, []);
  
  return (
    <Card className="w-full">
      <h3 className="text-xl text-[color:var(--text-color)] mb-6">
        Напишите определение для: <span className="font-semibold text-[color:var(--primary-color)]">{term.term}</span>
      </h3>
      
      <div className="mb-6">
        <Input
          fullWidth
          placeholder="Введите определение..."
          value={answer}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={submitted || isLocked}
          data-testid="writing-input"
        />
      </div>
      
      {!submitted ? (
        <Button 
          onClick={checkAnswer}
          disabled={!answer.trim() || isLocked}
          className="w-full"
          data-testid="check-answer-button"
        >
          Проверить
        </Button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${
          isCorrect
            ? "bg-emerald-950/30 border border-emerald-500"
            : "bg-rose-950/30 border border-rose-500"
        }`}>
          <p className={`text-sm mb-2 ${
            isCorrect ? "text-emerald-400" : "text-rose-400"
          }`}>
            {isCorrect ? "Правильно! 👍" : "Не совсем верно."}
          </p>
          <div className="mt-2">
            <p className="text-xs text-[color:var(--text-color)]/70 mb-1">Правильное определение:</p>
            <p className="text-sm text-[color:var(--text-color)]">{term.definition}</p>
          </div>
          {!isCorrect && (
            <div className="mt-3">
              <p className="text-xs text-[color:var(--text-color)]/70 mb-1">Ваш ответ:</p>
              <p className="text-sm text-[color:var(--text-color)]/70">{answer}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default WritingQuestion;