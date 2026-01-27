import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isActive: boolean;
  step: number;
  totalSteps: number;
}

export function QuizCard({ title, subtitle, children, isActive, step, totalSteps }: QuizCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 md:p-8 transition-all duration-500 w-full max-w-md mx-auto',
        isActive
          ? 'opacity-100 translate-y-0 scale-100 glow-box'
          : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute'
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i < step ? 'w-6 bg-primary' : i === step ? 'w-6 bg-primary/50' : 'w-3 bg-muted'
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {step + 1}/{totalSteps}
        </span>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mb-2 gradient-text">{title}</h2>
      {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}
      
      <div className="space-y-4">{children}</div>
    </div>
  );
}
