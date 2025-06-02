import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyModule, Term, StudyStats } from '../types';
import { getModules, saveModule, deleteModule, getStats, saveStats, generateId } from '../utils/storage';

interface ModuleContextType {
  modules: StudyModule[];
  stats: StudyStats[];
  currentModule: StudyModule | null;
  setCurrentModule: (module: StudyModule | null) => void;
  addModule: (title: string, description: string) => StudyModule;
  updateModule: (module: StudyModule) => void;
  removeModule: (moduleId: string) => void;
  addTerm: (moduleId: string, term: string, definition: string) => void;
  updateTerm: (moduleId: string, termId: string, term: string, definition: string) => void;
  removeTerm: (moduleId: string, termId: string) => void;
  markTermAsLearned: (moduleId: string, termId: string, learned: boolean) => void;
  updateModuleStats: (moduleId: string, stats: Partial<StudyStats>) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [stats, setStats] = useState<StudyStats[]>([]);
  const [currentModule, setCurrentModule] = useState<StudyModule | null>(null);

  // Загрузка модулей при инициализации
  useEffect(() => {
    const loadedModules = getModules();
    const loadedStats = getStats();
    setModules(loadedModules);
    setStats(loadedStats);
  }, []);

  // Добавление нового модуля
  const addModule = (title: string, description: string): StudyModule => {
    const newModule: StudyModule = {
      id: generateId(),
      title,
      description,
      terms: [],
      createdAt: Date.now()
    };
    
    const updatedModules = [...modules, newModule];
    setModules(updatedModules);
    saveModule(newModule);
    
    // Создаем запись статистики для нового модуля
    const newStats: StudyStats = {
      moduleId: newModule.id,
      totalTerms: 0,
      learned: 0,
      studyHistory: []
    };
    
    const updatedStats = [...stats, newStats];
    setStats(updatedStats);
    saveStats(newStats);
    
    return newModule;
  };

  // Обновление существующего модуля
  const updateModule = (updatedModule: StudyModule) => {
    const newModules = modules.map(module => 
      module.id === updatedModule.id ? updatedModule : module
    );
    
    setModules(newModules);
    saveModule(updatedModule);
    
    if (currentModule?.id === updatedModule.id) {
      setCurrentModule(updatedModule);
    }
  };

  // Удаление модуля
  const removeModule = (moduleId: string) => {
    const newModules = modules.filter(module => module.id !== moduleId);
    const newStats = stats.filter(stat => stat.moduleId !== moduleId);
    
    setModules(newModules);
    setStats(newStats);
    
    if (currentModule?.id === moduleId) {
      setCurrentModule(null);
    }
    
    deleteModule(moduleId);
  };

  // Добавление термина в модуль
  const addTerm = (moduleId: string, term: string, definition: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const newTerm: Term = {
      id: generateId(),
      term,
      definition,
      learned: false
    };
    
    const updatedModule = {
      ...module,
      terms: [...module.terms, newTerm]
    };
    
    updateModule(updatedModule);
    
    // Обновляем статистику
    const moduleStats = stats.find(s => s.moduleId === moduleId);
    if (moduleStats) {
      const updatedStats = {
        ...moduleStats,
        totalTerms: moduleStats.totalTerms + 1
      };
      
      const newStats = stats.map(s => s.moduleId === moduleId ? updatedStats : s);
      setStats(newStats);
      saveStats(updatedStats);
    }
  };

  // Обновление термина
  const updateTerm = (moduleId: string, termId: string, term: string, definition: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const updatedTerms = module.terms.map(t => 
      t.id === termId ? { ...t, term, definition } : t
    );
    
    const updatedModule = {
      ...module,
      terms: updatedTerms
    };
    
    updateModule(updatedModule);
  };

  // Удаление термина
  const removeTerm = (moduleId: string, termId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const updatedTerms = module.terms.filter(t => t.id !== termId);
    const removedTerm = module.terms.find(t => t.id === termId);
    
    const updatedModule = {
      ...module,
      terms: updatedTerms
    };
    
    updateModule(updatedModule);
    
    // Обновляем статистику
    if (removedTerm) {
      const moduleStats = stats.find(s => s.moduleId === moduleId);
      if (moduleStats) {
        const updatedStats = {
          ...moduleStats,
          totalTerms: moduleStats.totalTerms - 1,
          learned: removedTerm.learned ? moduleStats.learned - 1 : moduleStats.learned
        };
        
        const newStats = stats.map(s => s.moduleId === moduleId ? updatedStats : s);
        setStats(newStats);
        saveStats(updatedStats);
      }
    }
  };

  // Отметка термина как изученного/неизученного
  const markTermAsLearned = (moduleId: string, termId: string, learned: boolean) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    // Проверяем, был ли термин уже отмечен так же
    const term = module.terms.find(t => t.id === termId);
    if (term && term.learned === learned) return; // Если статус не меняется, ничего не делаем
    
    const updatedTerms = module.terms.map(t => 
      t.id === termId ? { ...t, learned } : t
    );
    
    const updatedModule = {
      ...module,
      terms: updatedTerms,
      lastStudied: Date.now()
    };
    
    // Обновляем модуль
    const newModules = modules.map(m => m.id === moduleId ? updatedModule : m);
    setModules(newModules);
    saveModule(updatedModule);
    
    if (currentModule?.id === updatedModule.id) {
      setCurrentModule(updatedModule);
    }
    
    // Обновляем статистику изученных слов
    const moduleStats = stats.find(s => s.moduleId === moduleId);
    if (moduleStats) {
      const learnedCount = updatedTerms.filter(t => t.learned).length;
      const updatedStats = {
        ...moduleStats,
        learned: learnedCount
      };
      
      const newStats = stats.map(s => s.moduleId === moduleId ? updatedStats : s);
      setStats(newStats);
      saveStats(updatedStats);
    }
  };

  // Обновление статистики модуля
  const updateModuleStats = (moduleId: string, newStats: Partial<StudyStats>) => {
    const moduleStats = stats.find(s => s.moduleId === moduleId);
    if (!moduleStats) return;
    
    const updatedStats = {
      ...moduleStats,
      ...newStats
    };
    
    const newStatsArray = stats.map(s => s.moduleId === moduleId ? updatedStats : s);
    setStats(newStatsArray);
    saveStats(updatedStats);
    
    // Обновляем дату последнего изучения модуля
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      const updatedModule = {
        ...module,
        lastStudied: Date.now()
      };
      
      const newModules = modules.map(m => m.id === moduleId ? updatedModule : m);
      setModules(newModules);
      saveModule(updatedModule);
      
      if (currentModule?.id === updatedModule.id) {
        setCurrentModule(updatedModule);
      }
    }
  };

  const value = {
    modules,
    stats,
    currentModule,
    setCurrentModule,
    addModule,
    updateModule,
    removeModule,
    addTerm,
    updateTerm,
    removeTerm,
    markTermAsLearned,
    updateModuleStats
  };

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};
