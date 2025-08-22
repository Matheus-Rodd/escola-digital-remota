import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Users } from 'lucide-react';
import { toast } from 'sonner';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClass: (classData: {
    name: string;
    description: string;
    students_count: number;
    subject: string;
    grade: string;
  }) => void;
}

export function CreateClassModal({ isOpen, onClose, onCreateClass }: CreateClassModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [students, setStudents] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !subject.trim() || !students.trim() || !grade.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onCreateClass({
      name: name.trim(),
      description: description.trim(),
      students_count: parseInt(students),
      subject: subject.trim(),
      grade: grade.trim()
    });

    // Limpar formulário
    setName('');
    setDescription('');
    setStudents('');
    setSubject('');
    setGrade('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setStudents('');
    setSubject('');
    setGrade('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md gradient-card border-0 shadow-large">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome da Turma *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="transition-smooth focus:shadow-glow"
                placeholder="Ex: 5º Ano A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Matéria *
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="transition-smooth focus:shadow-glow"
                placeholder="Ex: Matemática"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="students" className="text-sm font-medium">
                Nº de Alunos *
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="students"
                  type="number"
                  value={students}
                  onChange={(e) => setStudents(e.target.value)}
                  required
                  min="1"
                  max="50"
                  className="pl-10 transition-smooth focus:shadow-glow"
                  placeholder="25"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-sm font-medium">
                Série/Ano *
              </Label>
              <Input
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                className="transition-smooth focus:shadow-glow"
                placeholder="Ex: 5º Ano, 1ª Série"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] transition-smooth focus:shadow-glow"
              placeholder="Descrição da turma (opcional)"
            />
          </div>

          <DialogFooter className="flex gap-2">
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
              className="gradient-primary text-white transition-smooth hover:shadow-glow"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Criar Turma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};