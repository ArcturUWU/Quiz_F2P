import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import Layout from '../components/layout/Layout';
import ModuleForm from '../components/features/ModuleForm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const EditModulePage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { modules, updateModule } = useModules();
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(modules.find(m => m.id === moduleId));
  
  useEffect(() => {
    // Если модуль не найден, перенаправляем на страницу модулей
    if (!moduleId || !modules.find(m => m.id === moduleId)) {
      navigate('/modules');
    } else {
      setCurrentModule(modules.find(m => m.id === moduleId));
    }
  }, [moduleId, modules, navigate]);
  
  if (!currentModule) {
    return null;
  }
  
  const handleUpdateModule = (title: string, description: string, terms: any[]) => {
    const updatedModule = {
      ...currentModule,
      title,
      description,
      terms: terms.map(term => ({
        id: term.id,
        term: term.term,
        definition: term.definition,
        learned: term.learned || false
      }))
    };
    
    updateModule(updatedModule);
    navigate(`/modules/${currentModule.id}`);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(`/modules/${currentModule.id}`)}
            className="mr-4"
          >
            Назад
          </Button>
          <h1 className="text-3xl font-bold text-white">Редактирование модуля</h1>
        </div>
        
        <Card className="mb-6">
          <ModuleForm
            initialTitle={currentModule.title}
            initialDescription={currentModule.description}
            initialTerms={currentModule.terms}
            onSubmit={handleUpdateModule}
            submitLabel="Сохранить изменения"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default EditModulePage;
