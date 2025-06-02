import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { generateId } from '../utils/storage';

// Создаем контекст для аутентификации
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Получение пользователя из localStorage
const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('neon-quizlet-user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Получение пользователей из localStorage
const getStoredUsers = (): Record<string, { password: string; user: User }> => {
  const storedUsers = localStorage.getItem('neon-quizlet-users');
  return storedUsers ? JSON.parse(storedUsers) : {};
};

// Сохранение пользователей в localStorage
const saveUsers = (users: Record<string, { password: string; user: User }>) => {
  localStorage.setItem('neon-quizlet-users', JSON.stringify(users));
};

// Сохранение текущего пользователя
const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('neon-quizlet-user', JSON.stringify(user));
  } else {
    localStorage.removeItem('neon-quizlet-user');
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());

  // Эффект для проверки истечения срока подписки
  useEffect(() => {
    if (user && user.isPremium && user.premiumExpiry && user.premiumExpiry < Date.now()) {
      const updatedUser = {
        ...user,
        isPremium: false,
        premiumExpiry: undefined
      };
      setUser(updatedUser);
      saveCurrentUser(updatedUser);
      
      // Обновляем пользователя в хранилище
      const users = getStoredUsers();
      if (users[user.email]) {
        users[user.email].user = updatedUser;
        saveUsers(users);
      }
    }
  }, [user]);

  // Регистрация нового пользователя
  const register = async (name: string, email: string, password: string): Promise<User> => {
    const users = getStoredUsers();
    
    // Проверяем, существует ли пользователь с таким email
    if (users[email]) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    // Создаем нового пользователя
    const newUser: User = {
      id: generateId(),
      name,
      email,
      isPremium: false,
      createdAt: Date.now()
    };
    
    // Сохраняем пользователя
    users[email] = {
      password,
      user: newUser
    };
    
    saveUsers(users);
    
    // Устанавливаем текущего пользователя
    setUser(newUser);
    saveCurrentUser(newUser);
    
    return newUser;
  };

  // Вход пользователя
  const login = async (email: string, password: string): Promise<User> => {
    const users = getStoredUsers();
    
    // Проверяем, существует ли пользователь
    if (!users[email]) {
      throw new Error('Пользователь с таким email не найден');
    }
    
    // Проверяем пароль
    if (users[email].password !== password) {
      throw new Error('Неверный пароль');
    }
    
    // Устанавливаем текущего пользователя
    const currentUser = users[email].user;
    setUser(currentUser);
    saveCurrentUser(currentUser);
    
    return currentUser;
  };

  // Выход пользователя
  const logout = () => {
    setUser(null);
    saveCurrentUser(null);
  };

  // Обновление данных пользователя
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    saveCurrentUser(updatedUser);
    
    // Обновляем пользователя в хранилище
    const users = getStoredUsers();
    if (users[user.email]) {
      users[user.email].user = updatedUser;
      saveUsers(users);
    }
  };

  // Улучшение до премиум-аккаунта
  const upgradeToPremium = () => {
    if (!user) return;
    
    // Устанавливаем срок действия подписки (1 месяц от текущей даты)
    const premiumExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    
    const updatedUser = {
      ...user,
      isPremium: true,
      premiumExpiry
    };
    
    setUser(updatedUser);
    saveCurrentUser(updatedUser);
    
    // Обновляем пользователя в хранилище
    const users = getStoredUsers();
    if (users[user.email]) {
      users[user.email].user = updatedUser;
      saveUsers(users);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    upgradeToPremium
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};