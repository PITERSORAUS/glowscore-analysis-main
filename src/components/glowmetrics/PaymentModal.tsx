import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield, Check, Sparkles } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ open, onClose, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing (3-5 seconds)
    const delay = 3000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    setIsProcessing(false);
    setIsComplete(true);
    
    // Auto close after success
    setTimeout(() => {
      setIsComplete(false);
      onSuccess();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-glass-border max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center gradient-text text-xl">
            {isComplete ? 'Pagamento Confirmado!' : 'Confirmar Pagamento'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {isComplete ? (
            <div className="flex flex-col items-center gap-4 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <p className="text-center text-muted-foreground">
                Sua análise completa está sendo liberada...
              </p>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
              <p className="text-center text-muted-foreground">
                Processando pagamento...
              </p>
            </div>
          ) : (
            <>
              {/* Product Info */}
              <div className="bg-glass-bg/50 rounded-xl p-5 mb-6 border border-glass-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Análise Completa</h3>
                    <p className="text-sm text-muted-foreground">
                      Score + 5 prioridades + checklist 30 dias + PDF
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-sm text-muted-foreground line-through">R$ 97,00</div>
                <div className="text-3xl font-bold gradient-text">R$ 19,90</div>
                <div className="text-xs text-primary">Oferta por tempo limitado</div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                <Shield className="w-4 h-4" />
                <span>Pagamento 100% seguro</span>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                className="w-full h-14 text-base gradient-primary"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Confirmar pagamento
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
