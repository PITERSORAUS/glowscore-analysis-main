import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, QuizAnswers } from '@/types/glowmetrics';

const ACCESS_CODE_LENGTH = 8;
const ACCESS_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateAccessCode = (): string => {
  const values = new Uint32Array(ACCESS_CODE_LENGTH);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(values);
  } else {
    for (let i = 0; i < values.length; i += 1) {
      values[i] = Math.floor(Math.random() * ACCESS_CODE_CHARS.length);
    }
  }

  return Array.from(values)
    .map((value) => ACCESS_CODE_CHARS[value % ACCESS_CODE_CHARS.length])
    .join('');
};

interface CreateAnalysisRecordInput {
  quizAnswers: QuizAnswers;
  analysisResult: AnalysisResult;
}

export async function createAnalysisRecord({ quizAnswers, analysisResult }: CreateAnalysisRecordInput) {
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const accessCode = generateAccessCode();
    const { data, error } = await supabase
      .from('analysis_results')
      .insert({
        access_code: accessCode,
        quiz_answers: quizAnswers,
        analysis_result: analysisResult,
        paid: false,
      })
      .select('id, access_code')
      .single();

    if (error) {
      if (error.code === '23505') {
        continue;
      }
      throw error;
    }

    return {
      id: data.id,
      accessCode: data.access_code,
    };
  }

  throw new Error('Não foi possível gerar uma chave única. Tente novamente.');
}

export async function fetchAnalysisByAccessCode(accessCode: string) {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('id, access_code, analysis_result, paid')
    .eq('access_code', accessCode)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function markAnalysisPaid(analysisId: string) {
  const { error } = await supabase
    .from('analysis_results')
    .update({ paid: true })
    .eq('id', analysisId);

  if (error) {
    throw error;
  }
}
