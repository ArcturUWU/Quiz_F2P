import { Term, QuizQuestion, StudyMode, StudyStats, StudySession } from '../types';

// Перемешивание массива (алгоритм Фишера-Йейтса)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Генерация вопросов для теста
export const generateQuizQuestions = (terms: Term[], allDefinitions: string[]): QuizQuestion[] => {
  return terms.map(term => {
    // Получаем другие определения для вариантов ответов, исключая текущее
    const otherDefinitions = allDefinitions.filter(def => def !== term.definition);
    
    // Выбираем 3 случайных определения для вариантов
    const randomDefinitions = shuffleArray(otherDefinitions).slice(0, 3);
    
    // Добавляем правильный ответ и перемешиваем
    const options = shuffleArray([...randomDefinitions, term.definition]);
    
    // Находим индекс правильного ответа
    const correctIndex = options.indexOf(term.definition);
    
    return {
      termId: term.id,
      term: term.term,
      definition: term.definition,
      options,
      correctIndex
    };
  });
};

// Сохранение сессии обучения
export const createStudySession = (
  mode: StudyMode,
  score: number,
  timeSpent: number
): StudySession => {
  return {
    date: Date.now(),
    mode,
    score,
    timeSpent
  };
};

// Обновление статистики после сессии
export const updateStats = (
  stats: StudyStats,
  newSession: StudySession,
  learnedCount: number
): StudyStats => {
  return {
    ...stats,
    learned: learnedCount,
    lastScore: newSession.score,
    studyHistory: [...stats.studyHistory, newSession]
  };
};

// Расчет процента изученных терминов
export const calculateProgress = (stats: StudyStats): number => {
  if (stats.totalTerms === 0) return 0;
  return Math.round((stats.learned / stats.totalTerms) * 100);
};

// Функция для определения, был ли термин изучен
export const isTermLearned = (term: Term, threshold = 3): boolean => {
  // Здесь можно реализовать более сложную логику
  // Например, термин считается изученным, если он был правильно отвечен X раз подряд
  return term.learned;
};
