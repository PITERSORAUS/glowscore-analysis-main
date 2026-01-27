import { FacialMetric } from '@/types/glowmetrics';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FacialTableProps {
  metrics: FacialMetric[];
}

export function FacialTable({ metrics }: FacialTableProps) {
  return (
    <div className="glass rounded-xl overflow-hidden animate-fade-in-up border border-glass-border">
      <div className="p-5 border-b border-glass-border">
        <h3 className="text-lg font-semibold gradient-text">Tabela Facial</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Métricas detalhadas da sua estrutura facial
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-glass-border">
              <TableHead className="text-muted-foreground">Região</TableHead>
              <TableHead className="text-muted-foreground">Métrica</TableHead>
              <TableHead className="text-muted-foreground">Resultado</TableHead>
              <TableHead className="text-muted-foreground">Ideal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric, index) => (
              <TableRow key={index} className="border-glass-border">
                <TableCell className="font-medium">{metric.region}</TableCell>
                <TableCell className="text-muted-foreground">{metric.metric}</TableCell>
                <TableCell>
                  <span className="text-primary font-medium">{metric.result}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{metric.ideal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
