import { cn } from '@/lib/utils';

interface QuizOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function QuizOption({ label, selected, onClick }: QuizOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border transition-all duration-300 text-left',
        selected
          ? 'border-primary bg-primary/10 glow-box-sm'
          : 'border-glass-border bg-glass-bg/50 hover:border-primary/50 hover:bg-primary/5'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
            selected ? 'border-primary bg-primary' : 'border-muted-foreground'
          )}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
        </div>
        <span className={cn('text-sm md:text-base', selected && 'text-primary font-medium')}>
          {label}
        </span>
      </div>
    </button>
  );
}
