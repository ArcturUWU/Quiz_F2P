import { StudyModule, StudyStats, UserSettings } from '../types';

// Ключи для локального хранилища
const MODULES_KEY = 'neon-quizlet-modules';
const STATS_KEY = 'neon-quizlet-stats';
const SETTINGS_KEY = 'neon-quizlet-settings';

// Управление учебными модулями
export const getModules = (): StudyModule[] => {
  const data = localStorage.getItem(MODULES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveModule = (module: StudyModule): void => {
  const modules = getModules();
  const existingIndex = modules.findIndex(m => m.id === module.id);
  
  if (existingIndex >= 0) {
    modules[existingIndex] = module;
  } else {
    modules.push(module);
  }
  
  localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
};

export const deleteModule = (moduleId: string): void => {
  const modules = getModules().filter(m => m.id !== moduleId);
  localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
  
  // Также удаляем связанную статистику
  const stats = getStats().filter(s => s.moduleId !== moduleId);
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// Управление статистикой
export const getStats = (): StudyStats[] => {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStats = (stat: StudyStats): void => {
  const stats = getStats();
  const existingIndex = stats.findIndex(s => s.moduleId === stat.moduleId);
  
  if (existingIndex >= 0) {
    stats[existingIndex] = stat;
  } else {
    stats.push(stat);
  }
  
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// Управление настройками пользователя
export const getSettings = (): UserSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data 
    ? JSON.parse(data) 
    : { darkMode: true, primaryColor: '#8A2BE2' }; // Purple по умолчанию
};

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Утилиты для генерации уникальных ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
