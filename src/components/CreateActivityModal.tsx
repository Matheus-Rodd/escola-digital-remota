import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateActivity: (activityData: {
    title: string;
    description: string;
    due_date: string;
    status: string;
  }) => void;
  selectedClass?: {
    id: string;
    name: string;
  } | null;
}

export function CreateActivityModal({ isOpen, onClose, onCreateActivity, selectedClass }: CreateActivityModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Por favor, informe o título da atividade');
      return;
    }

    if (!selectedClass) {
      toast.error('Nenhuma turma selecionada');
      return;
    }

    onCreateActivity({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      status: 'pending'
    });

    // Limpar formulário
    setTitle('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    onClose();
  };

  // Data mínima é hoje
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md gradient-card border-0 shadow-large">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 gradient-secondary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Nova Atividade
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {selectedClass ? `Criar atividade para ${selectedClass.name}` : 'Selecione uma turma primeiro'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!selectedClass ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Por favor, selecione uma turma antes de criar uma atividade.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Título da Atividade *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="transition-smooth focus:shadow-glow"
                placeholder="Ex: Prova de Matemática"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] transition-smooth focus:shadow-glow resize-none"
                placeholder="Descreva os detalhes da atividade..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Data de Entrega
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={today}
                  className="pl-10 transition-smooth focus:shadow-glow"
                />
              </div>
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
                className="gradient-secondary text-white transition-smooth hover:shadow-glow"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Criar Atividade
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};