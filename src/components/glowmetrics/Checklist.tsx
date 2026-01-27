import { useState, useEffect } from 'react';
import { ChecklistDay } from '@/types/glowmetrics';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface ChecklistProps {
  days: ChecklistDay[];
  onUpdate: (days: ChecklistDay[]) => void;
}

export function Checklist({ days, onUpdate }: ChecklistProps) {
  const [expanded, setExpanded] = useState(false);
  const [localDays, setLocalDays] = useState(days);

  useEffect(() => {
    setLocalDays(days);
  }, [days]);

  const toggleDay = (dayIndex: number) => {
    const updated = localDays.map((day, i) =>
      i === dayIndex ? { ...day, completed: !day.completed } : day
    );
    setLocalDays(updated);
    onUpdate(updated);
  };

  const completedCount = localDays.filter((d) => d.completed).length;
  const displayDays = expanded ? localDays : localDays.slice(0, 7);

  return (
    <div className="glass rounded-xl overflow-hidden animate-fade-in-up border border-glass-border">
      <div className="p-5 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold gradient-text">Checklist 30 Dias</h3>
              <p className="text-sm text-muted-foreground">
                {completedCount}/30 dias concluídos
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {Math.round((completedCount / 30) * 100)}%
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-500"
            style={{ width: `${(completedCount / 30) * 100}%` }}
          />
        </div>
      </div>

      <ScrollArea className={expanded ? 'h-[400px]' : 'h-auto'}>
        <div className="p-4 space-y-2">
          {displayDays.map((day, index) => (
            <label
              key={day.day}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                day.completed
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-glass-bg/30 border border-transparent hover:border-glass-border'
              }`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <Checkbox
                checked={day.completed}
                onCheckedChange={() => toggleDay(day.day - 1)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary">Dia {day.day}</span>
                  <span className="text-sm font-medium">{day.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {day.task}
                </p>
              </div>
            </label>
          ))}
        </div>
      </ScrollArea>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-center gap-2 text-sm text-primary hover:bg-primary/5 transition-colors border-t border-glass-border"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Ver menos
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Ver todos os 30 dias
          </>
        )}
      </button>
    </div>
  );
}
