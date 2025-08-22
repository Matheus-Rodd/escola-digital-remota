import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, BookOpen, Users } from "lucide-react";

interface Activity {
  title: string;
  description: string;
  date: string;
  classId: string;
}

interface ClassData {
  id: string;
  name: string;
  grade: string;
  studentsCount: number;
  activitiesCount: number;
  color: string;
}

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activityData: Activity) => void;
  classes: ClassData[];
}

const CreateActivityModal = ({ isOpen, onClose, onSubmit, classes }: CreateActivityModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    classId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.classId) {
      return;
    }

    onSubmit({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      classId: formData.classId
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      classId: ""
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      classId: ""
    });
    onClose();
  };

  // Definir data mínima como hoje
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg gradient-card border-0 shadow-large">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Nova Atividade
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Cadastre uma nova atividade para suas turmas
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título da Atividade
            </Label>
            <Input
              id="title"
              placeholder="Ex: Prova de Matemática"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="transition-smooth focus:shadow-glow"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes da atividade..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px] transition-smooth focus:shadow-glow resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Data
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="pl-10 transition-smooth focus:shadow-glow"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId" className="text-sm font-medium">
                Turma
              </Label>
              <Select value={formData.classId} onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}>
                <SelectTrigger className="transition-smooth focus:shadow-glow">
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${cls.color}`}></div>
                        <span>{cls.name}</span>
                        <span className="text-muted-foreground text-xs">
                          ({cls.studentsCount} alunos)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {classes.length === 0 && (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <p className="text-sm">
                  Você precisa criar pelo menos uma turma antes de adicionar atividades.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="transition-smooth"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-secondary hover:shadow-glow transition-smooth"
              disabled={classes.length === 0}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Criar Atividade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivityModal;