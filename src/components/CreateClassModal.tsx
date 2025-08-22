import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, BookOpen } from "lucide-react";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: {
    name: string;
    grade: string;
    studentsCount: number;
    color: string;
  }) => void;
}

const grades = [
  "1º Ano",
  "2º Ano", 
  "3º Ano",
  "4º Ano",
  "5º Ano",
  "6º Ano",
  "7º Ano",
  "8º Ano",
  "9º Ano"
];

const colors = [
  { name: "Azul", value: "bg-gradient-primary" },
  { name: "Verde", value: "bg-gradient-secondary" },
  { name: "Roxo", value: "bg-gradient-to-r from-purple-500 to-purple-600" },
  { name: "Laranja", value: "bg-gradient-to-r from-orange-500 to-orange-600" },
  { name: "Rosa", value: "bg-gradient-to-r from-pink-500 to-pink-600" },
  { name: "Índigo", value: "bg-gradient-to-r from-indigo-500 to-indigo-600" }
];

const CreateClassModal = ({ isOpen, onClose, onSubmit }: CreateClassModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    studentsCount: "",
    color: "bg-gradient-primary"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grade || !formData.studentsCount) {
      return;
    }

    onSubmit({
      name: formData.name,
      grade: formData.grade,
      studentsCount: parseInt(formData.studentsCount),
      color: formData.color
    });

    // Reset form
    setFormData({
      name: "",
      grade: "",
      studentsCount: "",
      color: "bg-gradient-primary"
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      grade: "",
      studentsCount: "",
      color: "bg-gradient-primary"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md gradient-card border-0 shadow-large">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Nova Turma
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Cadastre uma nova turma no sistema
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome da Turma
              </Label>
              <Input
                id="name"
                placeholder="Ex: 5º Ano A"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="transition-smooth focus:shadow-glow"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="text-sm font-medium">
                Série
              </Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                <SelectTrigger className="transition-smooth focus:shadow-glow">
                  <SelectValue placeholder="Selecione a série" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentsCount" className="text-sm font-medium">
              Número de Alunos
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="studentsCount"
                type="number"
                placeholder="0"
                min="1"
                max="50"
                value={formData.studentsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, studentsCount: e.target.value }))}
                className="pl-10 transition-smooth focus:shadow-glow"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Cor da Turma
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`
                    relative p-3 rounded-lg border-2 transition-smooth
                    ${formData.color === color.value 
                      ? 'border-primary shadow-glow' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className={`w-full h-6 rounded ${color.value} mb-2`}></div>
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </button>
              ))}
            </div>
          </div>

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
              className="bg-gradient-primary hover:shadow-glow transition-smooth"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Criar Turma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassModal;