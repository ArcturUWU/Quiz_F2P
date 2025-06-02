// Типы для учебных модулей и карточек
export interface Term {
  id: string;
  term: string;
  definition: string;
  learned: boolean;
}

export interface StudyModule {
  id: string;
  title: string;
  description: string;
  terms: Term[];
  createdAt: number;
  lastStudied?: number;
}

// Типы для отслеживания прогресса
export interface StudyStats {
  moduleId: string;
  totalTerms: number;
  learned: number;
  lastScore?: number;
  studyHistory: StudySession[];
}

export interface StudySession {
  date: number;
  mode: StudyMode;
  score: number;
  timeSpent: number;
}

// Типы для различных режимов обучения
export type StudyMode = 'flashcards' | 'quiz' | 'writing';

export interface QuizQuestion {
  termId: string;
  term: string;
  definition: string;
  options: string[];
  correctIndex: number;
}

// Типы для настроек пользователя
export interface UserSettings {
  darkMode: boolean;
  primaryColor: string;
}

// Типы для аутентификации
export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  premiumExpiry?: number;
  createdAt: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  upgradeToPremium: () => void;
}

// Типы для подписок
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // в месяцах
  features: string[];
  isPopular?: boolean;
}
