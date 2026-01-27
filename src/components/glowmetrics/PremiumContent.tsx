import { useState } from 'react';
import { AnalysisResult, ChecklistDay } from '@/types/glowmetrics';
import { PriorityCard } from './PriorityCard';
import { FacialTable } from './FacialTable';
import { Checklist } from './Checklist';
import { Button } from '@/components/ui/button';
import { Download, Crown, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PremiumContentProps {
  result: AnalysisResult;
  checklist: ChecklistDay[];
  onChecklistUpdate: (days: ChecklistDay[]) => void;
  onDownloadPDF: () => void;
  isGeneratingPDF: boolean;
}

export function PremiumContent({
  result,
  checklist,
  onChecklistUpdate,
  onDownloadPDF,
  isGeneratingPDF,
}: PremiumContentProps) {
  const potentialPercentage = ((result.potentialScore - result.globalScore) / result.globalScore) * 100;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Premium Badge */}
      <div className="flex items-center justify-center gap-2 text-primary">
        <Crown className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Análise Premium Desbloqueada
        </span>
        <Crown className="w-5 h-5" />
      </div>

      {/* Full Score Display */}
      <div className="glass rounded-2xl p-6 md:p-8 border border-glass-border glow-box">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative w-48 h-48 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#premiumGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(result.globalScore / 100) * 283} 283`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--glow-pink))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold gradient-text">{result.globalScore}</span>
              <span className="text-sm text-muted-foreground">Score Global</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-4">Análise Completa</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Potencial de evolução
                  </span>
                  <span className="text-sm text-primary font-semibold">
                    +{potentialPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="relative">
                  <Progress value={result.globalScore} className="h-3" />
                  <div
                    className="absolute top-0 h-3 bg-gradient-to-r from-primary/40 to-accent/40 rounded-r-full transition-all"
                    style={{
                      left: `${result.globalScore}%`,
                      width: `${result.potentialScore - result.globalScore}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Atual: {result.globalScore}</span>
                  <span>Meta: {result.potentialScore}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {result.personalizedText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Cards */}
      <div>
        <h3 className="text-xl font-semibold mb-4 gradient-text">Suas Prioridades</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.priorities.map((priority, index) => (
            <PriorityCard key={priority.id} priority={priority} index={index} />
          ))}
        </div>
      </div>

      {/* Facial Table */}
      <FacialTable metrics={result.facialMetrics} />

      {/* Checklist */}
      <Checklist days={checklist} onUpdate={onChecklistUpdate} />

      {/* Download PDF Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onDownloadPDF}
          disabled={isGeneratingPDF}
          size="lg"
          className="gradient-primary h-14 px-8 text-base glow-box"
        >
          {isGeneratingPDF ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Baixar PDF Completo
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
