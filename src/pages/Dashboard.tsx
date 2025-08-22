import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, BookOpen, Calendar, LogOut, School } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateClassModal from "@/components/CreateClassModal";
import CreateActivityModal from "@/components/CreateActivityModal";

interface ClassData {
  id: string;
  name: string;
  grade: string;
  studentsCount: number;
  activitiesCount: number;
  color: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  classId: string;
}

const Dashboard = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Dados iniciais mockados
    const initialClasses: ClassData[] = [
      {
        id: "1",
        name: "5º Ano A",
        grade: "5º Ano",
        studentsCount: 25,
        activitiesCount: 8,
        color: "bg-gradient-primary"
      },
      {
        id: "2", 
        name: "4º Ano B",
        grade: "4º Ano",
        studentsCount: 22,
        activitiesCount: 5,
        color: "bg-gradient-secondary"
      }
    ];

    const initialActivities: Activity[] = [
      {
        id: "1",
        title: "Prova de Matemática",
        description: "Avaliação sobre frações e números decimais",
        date: "2024-01-15",
        classId: "1"
      },
      {
        id: "2",
        title: "Leitura em Grupo",
        description: "Atividade de interpretação de texto",
        date: "2024-01-18",
        classId: "2"
      }
    ];

    setClasses(initialClasses);
    setActivities(initialActivities);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/");
  };

  const handleCreateClass = (classData: Omit<ClassData, "id" | "activitiesCount">) => {
    const newClass: ClassData = {
      ...classData,
      id: Date.now().toString(),
      activitiesCount: 0,
    };
    setClasses(prev => [...prev, newClass]);
    setIsCreateClassOpen(false);
    toast({
      title: "Turma criada!",
      description: `A turma ${newClass.name} foi criada com sucesso.`,
    });
  };

  const handleCreateActivity = (activityData: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
    };
    setActivities(prev => [...prev, newActivity]);
    
    // Atualizar contador de atividades da turma
    setClasses(prev => prev.map(cls => 
      cls.id === newActivity.classId 
        ? { ...cls, activitiesCount: cls.activitiesCount + 1 }
        : cls
    ));
    
    setIsCreateActivityOpen(false);
    toast({
      title: "Atividade criada!",
      description: `A atividade "${newActivity.title}" foi criada com sucesso.`,
    });
  };

  const recentActivities = activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-medium border-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total de Alunos</p>
                  <p className="text-3xl font-bold text-foreground">
                    {classes.reduce((sum, cls) => sum + cls.studentsCount, 0)}
                  </p>
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
                  <p className="text-3xl font-bold text-foreground">{activities.length}</p>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Classes Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Minhas Turmas</h2>
            {classes.length === 0 ? (
              <Card className="gradient-card shadow-medium border-0 text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma turma cadastrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comece criando sua primeira turma
                  </p>
                  <Button onClick={() => setIsCreateClassOpen(true)} className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Turma
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {classes.map((cls, index) => (
                  <Card 
                    key={cls.id} 
                    className="gradient-card shadow-medium border-0 hover:shadow-large transition-smooth cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedClass(cls)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {cls.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {cls.grade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-muted-foreground">
                            <Users className="h-4 w-4 inline mr-1" />
                            {cls.studentsCount} alunos
                          </span>
                          <span className="text-muted-foreground">
                            <BookOpen className="h-4 w-4 inline mr-1" />
                            {cls.activitiesCount} atividades
                          </span>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${cls.color}`}></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Atividades Recentes</h2>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <Card className="gradient-card shadow-medium border-0 text-center py-8">
                  <CardContent>
                    <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Nenhuma atividade cadastrada
                    </p>
                  </CardContent>
                </Card>
              ) : (
                recentActivities.map((activity, index) => {
                  const activityClass = classes.find(cls => cls.id === activity.classId);
                  return (
                    <Card 
                      key={activity.id} 
                      className="gradient-card shadow-medium border-0 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-1">
                              {activity.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {activity.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {activityClass?.name}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateClassModal 
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
        onSubmit={handleCreateClass}
      />

      <CreateActivityModal 
        isOpen={isCreateActivityOpen}
        onClose={() => setIsCreateActivityOpen(false)}
        onSubmit={handleCreateActivity}
        classes={classes}
      />
    </div>
  );
};

export default Dashboard;