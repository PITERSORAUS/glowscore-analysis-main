import { Priority } from '@/types/glowmetrics';
import { Progress } from '@/components/ui/progress';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PriorityCardProps {
  priority: Priority;
  index: number;
}

export function PriorityCard({ priority, index }: PriorityCardProps) {
  const copyCoupon = () => {
    navigator.clipboard.writeText(priority.coupon);
    toast({
      title: 'Cupom copiado!',
      description: priority.coupon,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div
      className="glass rounded-xl p-5 animate-fade-in-up border border-glass-border"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Prioridade #{priority.id}
          </span>
          <h3 className="text-lg font-semibold mt-1">{priority.name}</h3>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(priority.score)}`}>
          {priority.score}
        </div>
      </div>

      <Progress value={priority.score} className="h-2 mb-4" />

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-muted-foreground">Métrica: </span>
          <span className="font-medium">{priority.metric}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Ação: </span>
          <span>{priority.action}</span>
        </div>
        <div className="pt-2 border-t border-glass-border">
          <span className="text-muted-foreground">Produto sugerido: </span>
          <span className="font-medium text-primary">{priority.product}</span>
        </div>
        <button
          onClick={copyCoupon}
          className="flex items-center gap-2 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg transition-colors w-full justify-center"
        >
          <Copy className="w-3 h-3" />
          Cupom: {priority.coupon}
        </button>
      </div>
    </div>
  );
}
