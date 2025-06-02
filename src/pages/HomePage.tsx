import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { Brain, Book, ChevronRight, BarChart3 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ModuleCard from '../components/features/ModuleCard';
import Empty from '../components/ui/Empty';

const HomePage: React.FC = () => {
  const { modules, stats, setCurrentModule } = useModules();
  const navigate = useNavigate();
  
  // Получаем последние 3 модуля
  const recentModules = [...modules]
    .sort((a, b) => (b.lastStudied || b.createdAt) - (a.lastStudied || a.createdAt))
    .slice(0, 3);
  
  // Обработчик клика по карточке модуля
  const handleModuleClick = (module: any) => {
    setCurrentModule(module);
    navigate(`/modules/${module.id}`);
  };
  
  return (
    <Layout>
      {/* Hero секция */}
      <section className="mb-16 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[color:var(--text-color)]">
            Изучайте быстрее с <span className="text-[color:var(--primary-color)]">Neon Quizlet</span>
          </h1>
          <p className="text-lg text-[color:var(--text-color)]/70 mb-8">
            Создавайте модули, тренируйтесь с карточками, тестами или письменными ответами,
            и отслеживайте свой прогресс в стильном неоновом интерфейсе.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              as={Link}
              to="/modules/create"
              size="lg"
              icon={<Book size={20} />}
            >
              Создать модуль
            </Button>
            <Button
              as={Link}
              to="/modules"
              variant="outline"
              size="lg"
              icon={<ChevronRight size={20} />}
            >
              Все модули
            </Button>
          </div>
        </div>
      </section>
      
      {/* Последние модули */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-[color:var(--text-color)]">Недавние модули</h2>
          <Link to="/modules" className="text-sm text-[color:var(--primary-color)] hover:underline">
            Смотреть все
          </Link>
        </div>
        
        {recentModules.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentModules.map(module => {
              const moduleStats = stats.find(s => s.moduleId === module.id);
              return (
                <ModuleCard
                  key={module.id}
                  module={module}
                  stats={moduleStats}
                  onClick={() => handleModuleClick(module)}
                />
              );
            })}
          </div>
        ) : (
          <Empty
            title="Нет модулей"
            description="Создайте свой первый учебный модуль для начала занятий"
            icon={<Book size={32} />}
            action={
              <Button
                as={Link}
                to="/modules/create"
                variant="primary"
                icon={<Book size={18} />}
              >
                Создать модуль
              </Button>
            }
          />
        )}
      </section>
      
      {/* Информационные карточки */}
      <section>
        <h2 className="text-2xl font-medium text-[color:var(--text-color)] mb-6">Возможности Neon Quizlet</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="hover">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-[color:var(--bg-color)] flex items-center justify-center text-[color:var(--primary-color)] mb-4">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-2">Умное повторение</h3>
              <p className="text-[color:var(--text-color)]/70 text-sm mb-4">
                Используйте различные режимы обучения: карточки, тесты и письменные ответы для
                эффективного запоминания.
              </p>
              <div className="mt-auto">
                <Button
                  as={Link}
                  to="/modules"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Начать обучение
                </Button>
              </div>
            </div>
          </Card>
          
          <Card variant="hover">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-[color:var(--bg-color)] flex items-center justify-center text-[color:var(--primary-color)] mb-4">
                <Book size={24} />
              </div>
              <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-2">Модули обучения</h3>
              <p className="text-[color:var(--text-color)]/70 text-sm mb-4">
                Организуйте учебный материал в удобные модули с карточками.
                Добавляйте, редактируйте и организуйте свои знания.
              </p>
              <div className="mt-auto">
                <Button
                  as={Link}
                  to="/modules/create"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Создать модуль
                </Button>
              </div>
            </div>
          </Card>
          
          <Card variant="hover">
            <div className="flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-[color:var(--bg-color)] flex items-center justify-center text-[color:var(--primary-color)] mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-medium text-[color:var(--text-color)] mb-2">Статистика прогресса</h3>
              <p className="text-[color:var(--text-color)]/70 text-sm mb-4">
                Отслеживайте свой прогресс с подробной статистикой.
                Анализируйте результаты и улучшайте свои показатели.
              </p>
              <div className="mt-auto">
                <Button
                  as={Link}
                  to="/stats"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Посмотреть статистику
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;