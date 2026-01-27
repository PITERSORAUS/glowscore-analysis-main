import { useState, useEffect, useRef } from 'react';
import { Quiz } from './Quiz';
import { SelfieUpload } from './SelfieUpload';
import { FreeResult } from './FreeResult';
import { PaymentModal } from './PaymentModal';
import { PremiumContent } from './PremiumContent';
import { QuizAnswers, AnalysisResult, ChecklistDay } from '@/types/glowmetrics';
import { generateAnalysis, generateChecklist } from '@/lib/analysis-engine';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';

type AppStage = 'quiz' | 'upload' | 'result';

export function GlowMetricsApp() {
  const [stage, setStage] = useState<AppStage>('quiz');
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistDay[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // Load payment status from localStorage
  useEffect(() => {
    const savedPaid = localStorage.getItem('glowmetrics_paid');
    if (savedPaid === 'true') {
      setIsPaid(true);
    }
    
    const savedChecklist = localStorage.getItem('glowmetrics_checklist');
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
  }, []);

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setStage('upload');
  };

  const handleSelfieUpload = (file: File) => {
    setSelfieFile(file);
  };

  const handleGenerateScore = async () => {
    if (!quizAnswers || !selfieFile) return;

    setIsGenerating(true);
    
    // Simulate AI analysis time
    await new Promise((resolve) => setTimeout(resolve, 2500 + Math.random() * 1500));
    
    const result = generateAnalysis(quizAnswers, false);
    setAnalysisResult(result);
    
    const newChecklist = generateChecklist();
    setChecklist(newChecklist);
    
    setIsGenerating(false);
    setStage('result');
  };

  const handlePaymentSuccess = async () => {
    setIsPaid(true);
    localStorage.setItem('glowmetrics_paid', 'true');
    setShowPaymentModal(false);

    // Save to Supabase
    try {
      await supabase.from('payments').insert({
        status: 'completed',
      });
    } catch (error) {
      console.error('Error saving payment:', error);
    }

    // Regenerate analysis with full potential
    if (quizAnswers) {
      const fullResult = generateAnalysis(quizAnswers, true);
      setAnalysisResult(fullResult);
    }
  };

  const handleChecklistUpdate = (days: ChecklistDay[]) => {
    setChecklist(days);
    localStorage.setItem('glowmetrics_checklist', JSON.stringify(days));
  };

  const handleDownloadPDF = async () => {
    if (!analysisResult || !isPaid) return;

    setIsGeneratingPDF(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create PDF content
      const pdfContent = document.createElement('div');
      pdfContent.style.padding = '40px';
      pdfContent.style.fontFamily = 'system-ui, sans-serif';
      pdfContent.style.color = '#1a1a2e';
      pdfContent.style.backgroundColor = '#ffffff';
      
      pdfContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 28px; margin: 0; color: #8b5cf6;">GlowMetrics</h1>
          <p style="color: #666; margin-top: 8px;">Sua Análise Estética Personalizada</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 48px;">${analysisResult.globalScore}</h2>
          <p style="margin: 8px 0 0;">Score Global</p>
        </div>
        
        <h3 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px;">Suas Prioridades</h3>
        ${analysisResult.priorities.map(p => `
          <div style="background: #f8f7ff; padding: 16px; border-radius: 12px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong>Prioridade #${p.id}: ${p.name}</strong>
              <span style="color: #8b5cf6; font-weight: bold;">${p.score}</span>
            </div>
            <p style="color: #666; margin: 8px 0; font-size: 14px;">${p.metric}</p>
            <p style="font-size: 14px; margin: 8px 0;">${p.action}</p>
            <p style="color: #8b5cf6; font-size: 14px; margin: 8px 0;">Produto: ${p.product}</p>
            <p style="background: #8b5cf6; color: white; display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px;">Cupom: ${p.coupon}</p>
          </div>
        `).join('')}
        
        <h3 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; margin-top: 30px;">Tabela Facial</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f8f7ff;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Região</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Métrica</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Resultado</th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Ideal</th>
            </tr>
          </thead>
          <tbody>
            ${analysisResult.facialMetrics.map(m => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${m.region}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${m.metric}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; color: #8b5cf6; font-weight: bold;">${m.result}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${m.ideal}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h3 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px;">Checklist 30 Dias</h3>
        ${checklist.map(day => `
          <div style="display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eee;">
            <span style="background: ${day.completed ? '#8b5cf6' : '#ddd'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap;">Dia ${day.day}</span>
            <div>
              <strong style="font-size: 14px;">${day.title}</strong>
              <p style="color: #666; font-size: 12px; margin: 4px 0 0;">${day.task}</p>
            </div>
          </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">Gerado por GlowMetrics • ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: 'glowmetrics-analise-completa.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      };

      await html2pdf().set(opt).from(pdfContent).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Análise Estética com IA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text glow-text">GlowMetrics</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Descubra seu potencial estético com análise facial avançada e um plano personalizado de 30 dias
          </p>
        </header>

        {/* Main Content */}
        <main>
          {stage === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
          
          {stage === 'upload' && (
            <SelfieUpload
              onUpload={handleSelfieUpload}
              onGenerate={handleGenerateScore}
              isGenerating={isGenerating}
            />
          )}
          
          {stage === 'result' && analysisResult && (
            <div className="space-y-8">
              <FreeResult
                result={analysisResult}
                onUnlock={() => setShowPaymentModal(true)}
              />
              
              {isPaid && (
                <PremiumContent
                  result={analysisResult}
                  checklist={checklist}
                  onChecklistUpdate={handleChecklistUpdate}
                  onDownloadPDF={handleDownloadPDF}
                  isGeneratingPDF={isGeneratingPDF}
                />
              )}
            </div>
          )}
        </main>

        {/* Payment Modal */}
        <PaymentModal
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
}
