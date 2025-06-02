import React, { useEffect, useState, useCallback, useMemo, useRef, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { ArrowLeft, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import FlashCard from '../components/features/FlashCard';
import QuizQuestion from '../components/features/QuizQuestion';
import WritingQuestion from '../components/features/WritingQuestion';
import StudyResults from '../components/features/StudyResults';
import Card from '../components/ui/Card';
import { StudyMode, Term, QuizQuestion as QuizQuestionType } from '../types';
import { shuffleArray, generateQuizQuestions, createStudySession, updateStats } from '../utils/studyHelpers';

// Типы для reducer
type StudyState = {
  currentIndex: number;
  correctAnswers: number;
  showNextButton: boolean;
  currentItemLearned: boolean;
  isTransitioning: boolean;
  sessionRecorded: boolean;
  showResults: boolean;
  timeSpent: number;
  componentKey: string;
};

type StudyAction =
  | { type: 'ANSWER', payload: { isCorrect: boolean, termId: string } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_STUDY' }
  | { type: 'RESET_STUDY' }
  | { type: 'SET_TIME_SPENT', payload: number }
  | { type: 'TRANSITION_END' };

// Reducer для управления состоянием изучения
const studyReducer = (state: StudyState, action: StudyAction): StudyState => {
  switch (action.type) {
    case 'ANSWER':
      return {
        ...state,
        correctAnswers: action.payload.isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
        currentItemLearned: action.payload.isCorrect,
        showNextButton: true
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        isTransitioning: true,
        showNextButton: false
      };
    case 'TRANSITION_END':
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        currentItemLearned: false,
        isTransitioning: false,
        componentKey: `${Date.now()}-${state.currentIndex + 1}`
      };
    case 'COMPLETE_STUDY':
      return {
        ...state,
        sessionRecorded: true,
        showResults: true
      };
    case 'SET_TIME_SPENT':
      return {
        ...state,
        timeSpent: action.payload
      };
    case 'RESET_STUDY':
      return {
        currentIndex: 0,
        correctAnswers: 0,
        showNextButton: false,
        currentItemLearned: false,
        isTransitioning: false,
        sessionRecorded: false,
        showResults: false,
        timeSpent: 0,
        componentKey: `${Date.now()}-reset`
      };
    default:
      return state;
  }
};

const StudyPage: React.FC = () => {
  const { moduleId, mode } = useParams<{ moduleId: string; mode: StudyMode }>();
  const { modules, stats, updateModuleStats, markTermAsLearned } = useModules();
  const navigate = useNavigate();
  
  // Основные состояния
  const [module, setModule] = useState<any>(null);
  const [moduleStats, setModuleStats] = useState<any>(null);
  const [studyData, setStudyData] = useState<Term[] | QuizQuestionType[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Состояние для изучения через reducer
  const [state, dispatch] = useReducer(studyReducer, {
    currentIndex: 0,
    correctAnswers: 0,
    showNextButton: false,
    currentItemLearned: false,
    isTransitioning: false,
    sessionRecorded: false,
    showResults: false,
    timeSpent: 0,
    componentKey: `${Date.now()}-0`
  });
  
  // Refs для контроля состояния
  const initializedRef = useRef(false);
  const dataReadyRef = useRef(false);
  const resultsShownRef = useRef(false);
  const currentModuleIdRef = useRef<string | null>(null);
  const processingActionRef = useRef(false);
  const lastActionTimeRef = useRef(0);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Проверяем валидность режима обучения
  const validMode = useMemo(() => 
    ['flashcards', 'quiz', 'writing'].includes(mode || ''), 
  [mode]);
  
  // Определяем, является ли текущий элемент последним
  const isLastItem = state.currentIndex === studyData.length - 1;
  
  // Текущий элемент для изучения
  const currentItem = state.currentIndex < studyData.length 
    ? studyData[state.currentIndex] 
    : null;
  
  // Инициализация модуля и статистики - выполняется только один раз при монтировании
  useEffect(() => {
    // Проверяем наличие модуля и режима
    if (!moduleId || !modules.find(m => m.id === moduleId) || !validMode) {
      navigate('/modules');
      return;
    }
    
    // Если это другой модуль или режим - сбрасываем состояние результатов
    if (currentModuleIdRef.current !== moduleId) {
      resultsShownRef.current = false;
      dispatch({ type: 'RESET_STUDY' });
    }
    
    currentModuleIdRef.current = moduleId;
    
    // Находим модуль и статистику
    const foundModule = modules.find(m => m.id === moduleId);
    const foundStats = stats.find(s => s.moduleId === moduleId);
    
    setModule(foundModule);
    setModuleStats(foundStats);
    
    // Инициализируем данные только если еще не показаны результаты
    if (!resultsShownRef.current) {
      // Сбрасываем все значения при первой загрузке
      setStartTime(Date.now());
      processingActionRef.current = false;
      lastActionTimeRef.current = 0;
      initializedRef.current = true;
    }
    
    // Очистка таймаутов при размонтировании
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [moduleId, modules, stats, validMode, navigate, mode]);
  
  // Подготовка данных для обучения - выполняется только после инициализации модуля
  const prepareStudyData = useCallback(() => {
    // Не подготавливаем данные повторно если:
    // 1. Нет модуля или режима
    // 2. Уже показаны результаты
    // 3. Данные уже были подготовлены
    if (!module || !validMode || !mode) return;
    if (resultsShownRef.current || state.showResults) return;
    if (dataReadyRef.current && studyData.length > 0) return;
    
    // Перемешиваем термины
    const shuffledTerms = shuffleArray([...module.terms]);
    
    if (mode === 'quiz') {
      // Для режима теста создаем вопросы с вариантами ответов
      const allDefinitions = module.terms.map(t => t.definition);
      const questions = generateQuizQuestions(shuffledTerms, allDefinitions);
      setStudyData(questions);
    } else {
      // Для карточек и письменных ответов используем термины напрямую
      setStudyData(shuffledTerms);
    }
    
    dataReadyRef.current = true;
    
  }, [module, validMode, mode, state.showResults, studyData.length]);
  
  // Запускаем подготовку данных только после установки модуля
  useEffect(() => {
    // Подготавливаем данные только если:
    // 1. Модуль и статистика загружены
    // 2. Режим валидный
    // 3. Данные еще не подготовлены
    // 4. Результаты не показаны
    if (module && moduleStats && validMode && !dataReadyRef.current && !resultsShownRef.current) {
      prepareStudyData();
    }
  }, [module, moduleStats, validMode, prepareStudyData]);
  
  // Сохраняем состояние showResults в ref
  useEffect(() => {
    resultsShownRef.current = state.showResults;
  }, [state.showResults]);
  
  // Функция для проверки возможности действия (защита от быстрых нажатий)
  const canPerformAction = useCallback(() => {
    // Проверяем, не обрабатывается ли уже какое-то действие
    if (processingActionRef.current || state.isTransitioning) return false;
    
    // Проверяем, не слишком ли быстро пользователь нажимает
    const now = Date.now();
    if (now - lastActionTimeRef.current < 150) return false;
    
    // Обновляем время последнего действия и устанавливаем флаг обработки
    lastActionTimeRef.current = now;
    processingActionRef.current = true;
    
    return true;
  }, [state.isTransitioning]);
  
  // Обработка ответа для карточек
  const handleCardAnswer = useCallback((learned: boolean) => {
    if (state.showNextButton || !currentItem || state.showResults) return;
    if (!canPerformAction()) return;
    
    try {
      // Отмечаем термин как изученный/неизученный
      const term = currentItem as Term;
      markTermAsLearned(module.id, term.id, learned);
      
      // Обновляем состояние через reducer
      dispatch({ 
        type: 'ANSWER', 
        payload: { 
          isCorrect: learned, 
          termId: term.id 
        } 
      });
      
      // Если это последний элемент, автоматически показываем результаты
      if (isLastItem) {
        setTimeout(() => {
          completeStudy();
          processingActionRef.current = false;
        }, 300);
      } else {
        // Разблокируем интерфейс
        setTimeout(() => {
          processingActionRef.current = false;
        }, 100);
      }
    } catch (error) {
      console.error("Error in handleCardAnswer:", error);
      processingActionRef.current = false;
    }
  }, [state.showNextButton, state.showResults, currentItem, isLastItem, module?.id, canPerformAction, markTermAsLearned]);
  
  // Обработка ответа для теста
  const handleQuizAnswer = useCallback((correct: boolean) => {
    if (state.showNextButton || !currentItem || state.showResults) return;
    if (!canPerformAction()) return;
    
    try {
      // Фиксируем результат ответа
      if (correct) {
        // Для режима теста отмечаем термин как изученный, если ответ правильный
        const question = currentItem as QuizQuestionType;
        markTermAsLearned(module.id, question.termId, true);
      }
      
      // Обновляем состояние через reducer
      dispatch({ 
        type: 'ANSWER', 
        payload: { 
          isCorrect: correct, 
          termId: (currentItem as QuizQuestionType).termId 
        } 
      });
      
      // Если это последний элемент, автоматически показываем результаты
      if (isLastItem) {
        setTimeout(() => {
          completeStudy();
          processingActionRef.current = false;
        }, 300);
      } else {
        // Разблокируем интерфейс
        setTimeout(() => {
          processingActionRef.current = false;
        }, 100);
      }
    } catch (error) {
      console.error("Error in handleQuizAnswer:", error);
      processingActionRef.current = false;
    }
  }, [state.showNextButton, state.showResults, currentItem, isLastItem, module?.id, canPerformAction, markTermAsLearned]);
  
  // Обработка ответа для письменного режима
  const handleWritingAnswer = useCallback((correct: boolean, answer: string) => {
    if (state.showNextButton || !currentItem || state.showResults) return;
    if (!canPerformAction()) return;
    
    try {
      if (correct) {
        // Отмечаем термин как изученный
        const term = currentItem as Term;
        markTermAsLearned(module.id, term.id, true);
      }
      
      // Обновляем состояние через reducer
      dispatch({ 
        type: 'ANSWER', 
        payload: { 
          isCorrect: correct, 
          termId: (currentItem as Term).id 
        } 
      });
      
      // Если это последний элемент, автоматически показываем результаты
      if (isLastItem) {
        setTimeout(() => {
          completeStudy();
          processingActionRef.current = false;
        }, 300);
      } else {
        // Разблокируем интерфейс
        setTimeout(() => {
          processingActionRef.current = false;
        }, 100);
      }
    } catch (error) {
      console.error("Error in handleWritingAnswer:", error);
      processingActionRef.current = false;
    }
  }, [state.showNextButton, state.showResults, currentItem, isLastItem, module?.id, canPerformAction, markTermAsLearned]);
  
  // Переход к следующему элементу
  const goToNext = useCallback(() => {
    if (state.showResults) return;
    if (!canPerformAction()) return;
    
    try {
      // Сначала устанавливаем состояние перехода
      dispatch({ type: 'NEXT_QUESTION' });
      
      // Используем setTimeout для анимации перехода
      transitionTimeoutRef.current = setTimeout(() => {
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
          transitionTimeoutRef.current = null;
        }
        
        // Обновляем индекс и сбрасываем флаги
        dispatch({ type: 'TRANSITION_END' });
        
        // Разблокируем интерфейс
        processingActionRef.current = false;
      }, 150);
    } catch (error) {
      console.error("Error in goToNext:", error);
      dispatch({ type: 'TRANSITION_END' });
      processingActionRef.current = false;
    }
  }, [state.showResults, canPerformAction]);
  
  // Завершение сессии обучения
  const completeStudy = useCallback(() => {
    // Предотвращаем повторное завершение
    if (state.sessionRecorded || state.showResults || resultsShownRef.current) return;
    
    try {
      // Вычисляем затраченное время
      const endTime = Date.now();
      const sessionTimeSpent = Math.floor((endTime - startTime) / 1000);
      
      // Устанавливаем время
      dispatch({ type: 'SET_TIME_SPENT', payload: sessionTimeSpent });
      
      // Вычисляем финальный счет
      const score = Math.round((state.correctAnswers / studyData.length) * 100);
      
      // Создаем запись о сессии
      const session = createStudySession(mode as StudyMode, score, sessionTimeSpent);
      
      // Обновляем статистику
      const learnedCount = module.terms.filter(t => t.learned).length;
      const updatedStats = updateStats(moduleStats, session, learnedCount);
      
      updateModuleStats(module.id, updatedStats);
      
      // Отмечаем, что сессия записана и показываем результаты
      dispatch({ type: 'COMPLETE_STUDY' });
      resultsShownRef.current = true;
    } catch (error) {
      console.error("Error in completeStudy:", error);
    }
  }, [
    state.sessionRecorded, 
    state.showResults, 
    state.correctAnswers, 
    studyData.length, 
    module, 
    moduleStats, 
    mode, 
    startTime, 
    updateModuleStats
  ]);
  
  // Перезапуск обучения
  const restartStudy = useCallback(() => {
    // Проверяем возможность действия
    if (!canPerformAction()) return;
    
    try {
      // Устанавливаем состояние перехода
      dispatch({ type: 'RESET_STUDY' });
      
      // Обновляем стартовое время и флаги
      setStartTime(Date.now());
      resultsShownRef.current = false;
      dataReadyRef.current = false;
      
      // Перемешиваем данные заново
      prepareStudyData();
      
      // Разблокируем интерфейс
      processingActionRef.current = false;
    } catch (error) {
      console.error("Error in restartStudy:", error);
      processingActionRef.current = false;
    }
  }, [canPerformAction, prepareStudyData]);
  
  // Завершение обучения и возврат к модулю
  const finishStudy = useCallback(() => {
    // Проверяем возможность действия
    if (!canPerformAction()) return;
    
    navigate(`/modules/${module.id}`);
  }, [canPerformAction, navigate, module?.id]);
  
  // Название режима для заголовка
  const getModeTitle = useCallback(() => {
    switch (mode) {
      case 'flashcards': return 'Карточки';
      case 'quiz': return 'Тест';
      case 'writing': return 'Письменный ответ';
      default: return '';
    }
  }, [mode]);
  
  // Если модуль не найден или режим недействителен - ничего не рендерим
  if (!module || !validMode || !moduleStats || !mode) {
    return null;
  }
  
  // Если данные еще не готовы и результаты не показаны
  if (studyData.length === 0 && !state.showResults) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-[color:var(--text-color)]">Загрузка данных...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Заголовок и кнопка назад */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate(`/modules/${module.id}`)}
              className="mr-4"
              disabled={state.isTransitioning}
            >
              Вернуться
            </Button>
            <h1 className="text-2xl font-bold text-[color:var(--text-color)]">{module.title} - {getModeTitle()}</h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            icon={<X size={16} />}
            onClick={() => navigate(`/modules/${module.id}`)}
            className="text-[color:var(--text-color)]/70"
            aria-label="Закрыть"
            disabled={state.isTransitioning}
          >
            Закрыть
          </Button>
        </div>
        
        {/* Прогресс - показываем только если не отображаются результаты */}
        {!state.showResults && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[color:var(--text-color)]/70">Прогресс</span>
              <span className="text-[color:var(--text-color)]">{state.currentIndex + 1} из {studyData.length}</span>
            </div>
            <div className="w-full bg-[color:var(--bg-color)] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[color:var(--primary-color)] h-full rounded-full transition-all duration-500"
                style={{ width: `${((state.currentIndex + 1) / studyData.length) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Контент для режима обучения */}
        <div className="flex flex-col items-center">
          {/* Контейнер с анимацией перехода */}
          <div 
            className={`w-full mb-6 transition-opacity duration-300 ${
              state.isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {/* Компоненты для разных режимов обучения - показываем только если не отображаются результаты */}
            {!state.showResults && (
              <div>
                {mode === 'flashcards' && currentItem && (
                  <div key={state.componentKey}>
                    <FlashCard
                      term={currentItem as Term}
                      onMarkLearned={handleCardAnswer}
                      currentIndex={state.currentIndex}
                      totalCards={studyData.length}
                    />
                  </div>
                )}
                
                {mode === 'quiz' && currentItem && (
                  <div key={state.componentKey}>
                    <QuizQuestion
                      question={currentItem as QuizQuestionType}
                      onAnswer={handleQuizAnswer}
                    />
                  </div>
                )}
                
                {mode === 'writing' && currentItem && (
                  <div key={state.componentKey}>
                    <WritingQuestion
                      term={currentItem as Term}
                      onAnswer={handleWritingAnswer}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Кнопка "Далее" - показываем только если это не последний элемент и не показаны результаты */}
            {state.showNextButton && !isLastItem && !state.showResults && (
              <div className="mt-4 w-full max-w-md mx-auto">
                <Button 
                  onClick={goToNext} 
                  className="w-full"
                  variant={state.currentItemLearned ? "primary" : "outline"}
                  disabled={state.isTransitioning}
                >
                  Далее
                </Button>
              </div>
            )}
            
            {/* Результаты - показываем под контентом, когда showResults === true */}
            {state.showResults && (
              <div className="w-full">
                <StudyResults
                  mode={mode as StudyMode}
                  totalQuestions={studyData.length}
                  correctAnswers={state.correctAnswers}
                  timeSpent={state.timeSpent}
                  onRestart={restartStudy}
                  onFinish={finishStudy}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudyPage;