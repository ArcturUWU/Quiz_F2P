import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings } from '../types';
import { getSettings, saveSettings } from '../utils/storage';

// Доступные неоновые цвета
export const neonColors = {
  purple: '#8A2BE2',
  blue: '#00BFFF',
  pink: '#FF1493',
  green: '#00FF7F',
  orange: '#FF4500'
};

type NeonColorKey = keyof typeof neonColors;

interface ThemeContextType {
  darkMode: boolean;
  primaryColor: string;
  toggleDarkMode: () => void;
  setPrimaryColor: (color: string) => void;
  neonColors: typeof neonColors;
  applyNeonColorClass: (element: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>({ darkMode: true, primaryColor: neonColors.purple });

  // Загрузка настроек при инициализации
  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
    
    // Применяем темный режим к документу
    if (savedSettings.darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--bg-color', '#0F172A'); // темный фон
      document.documentElement.style.setProperty('--text-color', '#F8FAFC'); // светлый текст
      document.documentElement.style.setProperty('--card-bg', '#1E293B'); // темные карточки
      document.documentElement.style.setProperty('--border-color', '#334155'); // темные границы
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--bg-color', '#F8FAFC'); // светлый фон
      document.documentElement.style.setProperty('--text-color', '#1E293B'); // темный текст
      document.documentElement.style.setProperty('--card-bg', '#FFFFFF'); // светлые карточки
      document.documentElement.style.setProperty('--border-color', '#E2E8F0'); // светлые границы
    }
    
    // Устанавливаем CSS переменную для основного цвета
    document.documentElement.style.setProperty('--primary-color', savedSettings.primaryColor);
  }, []);

  // Переключение темного режима
  const toggleDarkMode = () => {
    const newSettings = { ...settings, darkMode: !settings.darkMode };
    setSettings(newSettings);
    saveSettings(newSettings);
    
    if (newSettings.darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--bg-color', '#0F172A');
      document.documentElement.style.setProperty('--text-color', '#F8FAFC');
      document.documentElement.style.setProperty('--card-bg', '#1E293B');
      document.documentElement.style.setProperty('--border-color', '#334155');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--bg-color', '#F8FAFC');
      document.documentElement.style.setProperty('--text-color', '#1E293B');
      document.documentElement.style.setProperty('--card-bg', '#FFFFFF');
      document.documentElement.style.setProperty('--border-color', '#E2E8F0');
    }
  };

  // Установка основного цвета
  const setPrimaryColor = (color: string) => {
    const newSettings = { ...settings, primaryColor: color };
    setSettings(newSettings);
    saveSettings(newSettings);
    
    document.documentElement.style.setProperty('--primary-color', color);
  };
  
  // Вспомогательная функция для применения неонового эффекта к классам
  const applyNeonColorClass = (element: string) => {
    const baseClasses = {
      button: "transition-all duration-300 rounded-full font-medium",
      text: "transition-colors duration-300",
      border: "transition-all duration-300",
      glow: "transition-all duration-300"
    };
    
    // Маппинг элементов на соответствующие классы
    const elementClasses: Record<string, Record<string, string>> = {
      button: {
        base: `${baseClasses.button} bg-[color:var(--card-bg)] border-2 px-4 py-2 shadow-md`,
        primary: `border-[color:var(--primary-color)] text-[color:var(--primary-color)] hover:bg-[color:var(--primary-color)] hover:text-[color:var(--bg-color)] hover:shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.7)]`,
        secondary: `border-[color:var(--border-color)] text-[color:var(--text-color)] hover:border-[color:var(--primary-color)] hover:text-[color:var(--primary-color)]`
      },
      text: {
        primary: `text-[color:var(--primary-color)]`,
        secondary: `text-[color:var(--text-color)] hover:text-[color:var(--primary-color)]`
      },
      border: {
        primary: `border-[color:var(--primary-color)]`,
        glow: `border-[color:var(--primary-color)] shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.5)]`
      },
      card: {
        base: `bg-[color:var(--card-bg)] border border-[color:var(--border-color)] rounded-xl p-6 transition-all duration-300`,
        hover: `hover:border-[color:var(--primary-color)] hover:shadow-[0_0_20px_rgba(var(--primary-color-rgb),0.3)]`
      }
    };
    
    return elementClasses[element]?.base 
      ? `${elementClasses[element].base} ${elementClasses[element].primary}`
      : elementClasses[element]?.primary || '';
  };

  const value = {
    darkMode: settings.darkMode,
    primaryColor: settings.primaryColor,
    toggleDarkMode,
    setPrimaryColor,
    neonColors,
    applyNeonColorClass
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
