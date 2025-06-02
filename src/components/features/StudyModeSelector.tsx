import React from 'react';
import Card from '../ui/Card';
import { Layers, CheckSquare, PencilLine } from 'lucide-react';
import { StudyMode } from '../../types';

interface StudyModeSelectorProps {
  onSelect: (mode: StudyMode) => void;
}

const StudyModeSelector: React.FC<StudyModeSelectorProps> = ({ onSelect }) => {
  const studyModes = [
    {
      id: 'flashcards' as StudyMode,
      name: 'Карточки',
      description: 'Изучайте термины с помощью интерактивных карточек',
      icon: <Layers size={24} />
    },
    {
      id: 'quiz' as StudyMode,
      name: 'Тест',
      description: 'Проверьте свои знания с помощью теста с вариантами ответов',
      icon: <CheckSquare size={24} />
    },
    {
      id: 'writing' as StudyMode,
      name: 'Письменный ответ',
      description: 'Тренируйте память, вводя определения своими словами',
      icon: <PencilLine size={24} />
    }
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {studyModes.map((mode) => (
        <Card
          key={mode.id}
          variant="hover"
          className="cursor-pointer transition-transform hover:scale-[1.02] flex flex-col"
          onClick={() => onSelect(mode.id)}
        >
          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center text-[color:var(--primary-color)] mb-4">
            {mode.icon}
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{mode.name}</h3>
          <p className="text-sm text-gray-400">{mode.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default StudyModeSelector;
