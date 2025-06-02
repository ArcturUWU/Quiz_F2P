import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { Plus, Search, Book, MoreVertical, Edit, Trash2, Copy } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ModuleCard from '../components/features/ModuleCard';
import Empty from '../components/ui/Empty';
import Modal from '../components/ui/Modal';

const ModulesPage: React.FC = () => {
  const { modules, stats, removeModule, addModule, setCurrentModule } = useModules();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [moduleMenuOpen, setModuleMenuOpen] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  
  // Фильтрация модулей по поисковому запросу
  const filteredModules = modules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Обработчик для кнопки опций модуля
  const handleModuleOptions = (e: React.MouseEvent, moduleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPosition({ 
      x: window.innerWidth - rect.right > 200 ? rect.left : rect.right - 200,
      y: rect.bottom
    });
    
    setModuleMenuOpen(moduleId === moduleMenuOpen ? null : moduleId);
  };
  
  // Дублирование модуля
  const handleDuplicateModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const newTitle = `${module.title} (копия)`;
    const newModule = addModule(newTitle, module.description);
    
    // Копируем термины
    module.terms.forEach(term => {
      const { term: termText, definition } = term;
      const moduleStats = stats.find(s => s.moduleId === newModule.id);
      
      if (moduleStats) {
        moduleStats.totalTerms += 1;
      }
      
      newModule.terms.push({
        id: `term_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        term: termText,
        definition,
        learned: false
      });
    });
    
    setModuleMenuOpen(null);
  };
  
  // Закрытие меню при клике в любое место страницы
  React.useEffect(() => {
    const handleClickOutside = () => {
      setModuleMenuOpen(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Обработчик клика по карточке модуля
  const handleModuleClick = (module: any) => {
    setCurrentModule(module);
    navigate(`/modules/${module.id}`);
  };
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Мои модули</h1>
        <p className="text-gray-400">
          Управляйте своими учебными модулями и начните обучение
        </p>
      </div>
      
      {/* Панель инструментов */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="w-full md:w-auto flex-1 max-w-md">
          <Input
            placeholder="Поиск модулей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            icon={<Search size={18} className="text-gray-500" />}
          />
        </div>
        <Button
          as={Link}
          to="/modules/create"
          icon={<Plus size={18} />}
        >
          Создать модуль
        </Button>
      </div>
      
      {/* Список модулей */}
      {filteredModules.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map(module => {
            const moduleStats = stats.find(s => s.moduleId === module.id);
            return (
              <div key={module.id} className="relative">
                <ModuleCard
                  module={module}
                  stats={moduleStats}
                  onClick={() => handleModuleClick(module)}
                  onOptionsClick={(e) => handleModuleOptions(e, module.id)}
                />
                
                {/* Всплывающее меню для модуля */}
                {moduleMenuOpen === module.id && (
                  <div 
                    className="absolute z-10 right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-1"
                    style={{ top: menuPosition.y - 60, left: menuPosition.x }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link 
                      to={`/modules/${module.id}/edit`}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setModuleMenuOpen(null)}
                    >
                      <Edit size={16} className="mr-2" /> Редактировать
                    </Link>
                    <button 
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => {
                        handleDuplicateModule(module.id);
                        setModuleMenuOpen(null);
                      }}
                    >
                      <Copy size={16} className="mr-2" /> Дублировать
                    </button>
                    <button 
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-gray-800"
                      onClick={() => {
                        setConfirmDelete(module.id);
                        setModuleMenuOpen(null);
                      }}
                    >
                      <Trash2 size={16} className="mr-2" /> Удалить
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          title={
            searchQuery 
              ? "Ничего не найдено" 
              : "У вас пока нет модулей"
          }
          description={
            searchQuery 
              ? "Попробуйте изменить запрос или создайте новый модуль" 
              : "Создайте свой первый учебный модуль для начала занятий"
          }
          icon={<Book size={32} />}
          action={
            <Button
              as={Link}
              to="/modules/create"
              icon={<Plus size={18} />}
            >
              Создать модуль
            </Button>
          }
        />
      )}
      
      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Удалить модуль?"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (confirmDelete) {
                  removeModule(confirmDelete);
                  setConfirmDelete(null);
                }
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
            >
              Удалить
            </Button>
          </div>
        }
      >
        <p className="text-gray-300 mb-2">
          Вы уверены, что хотите удалить этот модуль? Это действие невозможно отменить.
        </p>
        <p className="text-gray-400 text-sm">
          Вся связанная статистика и прогресс обучения будут потеряны.
        </p>
      </Modal>
    </Layout>
  );
};

export default ModulesPage;