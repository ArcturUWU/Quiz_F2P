import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import Layout from '../components/layout/Layout';
import ModuleForm from '../components/features/ModuleForm';
import Card from '../components/ui/Card';

const CreateModulePage: React.FC = () => {
  const { addModule } = useModules();
  const navigate = useNavigate();
  
  const handleCreateModule = (title: string, description: string, terms: any[]) => {
    const newModule = addModule(title, description);
    
    // Добавляем термины
    terms.forEach(term => {
      newModule.terms.push({
        id: term.id,
        term: term.term,
        definition: term.definition,
        learned: false
      });
    });
    
    navigate(`/modules/${newModule.id}`);
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Создание нового модуля</h1>
        
        <Card className="mb-6">
          <ModuleForm
            onSubmit={handleCreateModule}
            submitLabel="Создать модуль"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default CreateModulePage;
