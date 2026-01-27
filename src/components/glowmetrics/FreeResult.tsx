import { Lock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnalysisResult } from '@/types/glowmetrics';

interface FreeResultProps {
  result: AnalysisResult;
  onUnlock: () => void;
}

export function FreeResult({ result, onUnlock }: FreeResultProps) {
  const priority1 = result.priorities[0];
  const potentialPercentage = ((result.potentialScore - result.globalScore) / result.globalScore) * 100;

  return (
    <div className="glass rounded-2xl p-6 md:p-8 max-w-lg mx-auto animate-fade-in-up glow-box">
      {/* Score Circle */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(result.globalScore / 100) * 283} 283`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold gradient-text">{result.globalScore}</span>
            <span className="text-sm text-muted-foreground">de 100</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center">Seu Score Global</h2>
      </div>

      {/* Priority #1 */}
      <div className="bg-glass-bg/50 rounded-xl p-5 mb-6 border border-glass-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Prioridade #1
          </span>
        </div>
        <h3 className="text-lg font-medium mb-2">{priority1?.name || 'Análise Geral'}</h3>
        <p className="text-sm text-muted-foreground">{priority1?.metric}</p>
      </div>

      {/* Potential Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Potencial de melhoria
          </span>
          <span className="text-sm text-primary font-medium">
            +{potentialPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="relative">
          <Progress value={result.globalScore} className="h-3 bg-muted" />
          <div
            className="absolute top-0 h-3 bg-gradient-to-r from-primary/30 to-accent/30 rounded-r-full"
            style={{
              left: `${result.globalScore}%`,
              width: `${result.potentialScore - result.globalScore}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Atual: {result.globalScore}</span>
          <span>Potencial: {result.potentialScore}</span>
        </div>
      </div>

      {/* Personalized Text */}
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        {result.personalizedText}
      </p>

      {/* Locked Content Preview */}
      <div className="relative rounded-xl bg-gradient-to-b from-glass-bg to-transparent p-6 mb-6 border border-glass-border overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/60 flex flex-col items-center justify-center z-10">
          <Lock className="w-8 h-8 text-primary mb-3" />
          <span className="font-medium">Análise completa bloqueada</span>
        </div>
        <div className="opacity-30 blur-[2px]">
          <div className="flex gap-4 mb-4">
            {['Mandíbula', 'Pele', 'Cabelo'].map((name) => (
              <div key={name} className="flex-1 p-3 rounded-lg bg-muted/20">
                <div className="h-2 w-16 bg-muted rounded mb-2" />
                <div className="h-3 w-8 bg-muted rounded" />
              </div>
            ))}
          </div>
          <div className="h-24 bg-muted/20 rounded-lg" />
        </div>
      </div>

      {/* Unlock Button */}
      <Button
        onClick={onUnlock}
        className="w-full h-14 text-base gradient-primary animate-pulse-glow"
      >
        <Lock className="mr-2 h-5 w-5" />
        Desbloquear análise completa
      </Button>
    </div>
  );
}
