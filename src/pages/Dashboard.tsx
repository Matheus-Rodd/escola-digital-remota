import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, Users2, Calendar, BookOpen, Activity, School } from 'lucide-react';
import { CreateClassModal } from '@/components/CreateClassModal';
import { CreateActivityModal } from '@/components/CreateActivityModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Class {
  id: string;
  name: string;
  description: string | null;
  students_count: number;
  subject: string;
  grade: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string | null;
  class_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchClasses();
  }, [user, navigate]);

  const fetchClasses = async () => {
    try {
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (classesError) throw classesError;

      const classesWithActivities = await Promise.all(
        (classesData || []).map(async (classItem) => {
          const { data: activities, error: activitiesError } = await supabase
            .from('activities')
            .select('*')
            .eq('class_id', classItem.id)
            .order('created_at', { ascending: false });

          if (activitiesError) {
            console.error('Error fetching activities:', activitiesError);
            return { ...classItem, activities: [] };
          }

          return { ...classItem, activities: activities || [] };
        })
      );

      setClasses(classesWithActivities);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (newClass: Omit<Class, 'id' | 'activities'>) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([{
          name: newClass.name,
          description: newClass.description,
          grade: newClass.grade,
          subject: newClass.subject,
          students_count: newClass.students_count,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      const classWithActivities = { ...data, activities: [] };
      setClasses([classWithActivities, ...classes]);
      setIsCreateClassOpen(false);
      toast.success('Turma criada com sucesso!');
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Erro ao criar turma');
    }
  };

  const handleCreateActivity = async (newActivity: { title: string; description: string; due_date: string; status: string }) => {
    if (!selectedClass) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          title: newActivity.title,
          description: newActivity.description,
          due_date: newActivity.due_date,
          status: newActivity.status,
          class_id: selectedClass.id,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      const updatedClasses = classes.map(cls => 
        cls.id === selectedClass.id 
          ? { ...cls, activities: [data, ...cls.activities] }
          : cls
      );

      setClasses(updatedClasses);
      setSelectedClass(prev => prev ? { ...prev, activities: [data, ...prev.activities] } : null);
      setIsCreateActivityOpen(false);
      toast.success('Atividade criada com sucesso!');
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Erro ao criar atividade');
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  const totalStudents = classes.reduce((sum, cls) => sum + cls.students_count, 0);
  const totalActivities = classes.reduce((sum, cls) => sum + cls.activities.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <School className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Sistema Escolar</h1>
                <p className="text-sm text-muted-foreground">Painel Principal</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-destructive hover:text-destructive-foreground transition-smooth"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card shadow-medium border-0 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total de Turmas</p>
                  <p className="text-3xl font-bold text-foreground">{classes.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-medium border-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total de Alunos</p>
                  <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <School className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-medium border-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Atividades</p>
                  <p className="text-3xl font-bold text-foreground">{totalActivities}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => setIsCreateClassOpen(true)}
            className="bg-gradient-primary hover:shadow-glow transition-smooth"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
          <Button 
            onClick={() => setIsCreateActivityOpen(true)}
            variant="outline" 
            className="hover:bg-secondary hover:text-secondary-foreground transition-smooth"
            disabled={classes.length === 0}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Classes Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Minhas Turmas</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Carregando turmas...</p>
                </div>
              ) : classes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma turma encontrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Crie sua primeira turma para começar a organizar suas atividades
                  </p>
                  <Button
                    onClick={() => setIsCreateClassOpen(true)}
                    className="gradient-primary text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Turma
                  </Button>
                </div>
              ) : (
                classes.map((classItem) => (
                  <Card key={classItem.id} className="gradient-card border-0 shadow-medium hover:shadow-large transition-smooth cursor-pointer animate-fade-in">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground">
                              {classItem.name}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                              {classItem.subject} - {classItem.grade}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                          {classItem.students_count} alunos
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        {classItem.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>{classItem.activities.length} atividades</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedClass(classItem)}
                          className="text-primary hover:text-primary-foreground hover:bg-primary transition-smooth"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Class Details / Activities */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                {selectedClass ? `Atividades - ${selectedClass.name}` : 'Selecione uma Turma'}
              </h2>
              {selectedClass && (
                <Button
                  size="sm"
                  onClick={() => setIsCreateActivityOpen(true)}
                  className="gradient-secondary text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Atividade
                </Button>
              )}
            </div>

            {selectedClass ? (
              <div className="space-y-4">
                {selectedClass.activities.length === 0 ? (
                  <Card className="gradient-card border-0 shadow-medium text-center py-8">
                    <CardContent>
                      <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">
                        Nenhuma atividade cadastrada para esta turma
                      </p>
                      <Button
                        onClick={() => setIsCreateActivityOpen(true)}
                        className="gradient-secondary text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeira Atividade
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  selectedClass.activities.map((activity) => (
                    <Card key={activity.id} className="gradient-card border-0 shadow-medium animate-fade-in">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-foreground">{activity.title}</h4>
                          <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                            {activity.status === 'pending' ? 'Pendente' : 
                             activity.status === 'completed' ? 'Concluída' : 
                             activity.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Prazo: {activity.due_date ? new Date(activity.due_date).toLocaleDateString('pt-BR') : 'Sem prazo'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <Card className="gradient-card border-0 shadow-medium text-center py-12">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Selecione uma turma para visualizar suas atividades
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateClassModal 
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
        onCreateClass={handleCreateClass}
      />

      <CreateActivityModal 
        isOpen={isCreateActivityOpen}
        onClose={() => setIsCreateActivityOpen(false)}
        onCreateActivity={handleCreateActivity}
        selectedClass={selectedClass}
      />
    </div>
  );
};