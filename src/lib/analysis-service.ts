import { AnalysisResult, QuizAnswers } from '@/types/glowmetrics';

const ANALYSIS_API_URL = import.meta.env.VITE_ANALYSIS_API_URL;

export const isRealAnalysisConfigured = () => Boolean(ANALYSIS_API_URL);

export async function requestRealAnalysis(answers: QuizAnswers, selfieFile: File): Promise<AnalysisResult> {
  if (!ANALYSIS_API_URL) {
    throw new Error('VITE_ANALYSIS_API_URL não configurado.');
  }

  const payload = new FormData();
  payload.append('selfie', selfieFile);
  payload.append('answers', JSON.stringify(answers));

  const response = await fetch(ANALYSIS_API_URL, {
    method: 'POST',
    body: payload,
  });

  if (!response.ok) {
    throw new Error('Falha ao gerar análise.');
  }

  const data = await response.json();
  if (!data?.analysis) {
    throw new Error('Resposta inválida da análise.');
  }

  return data.analysis as AnalysisResult;
}
