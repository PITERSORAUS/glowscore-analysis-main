import type { AnalysisResult, FacialMetric, Priority, QuizAnswers } from '@/types/glowmetrics';

export interface FaceRatios {
  eyeDistanceRatio: number;
  jawWidthRatio: number;
  faceWidthRatio: number;
  faceHeightRatio: number;
  noseWidthRatio: number;
  lipWidthRatio: number;
  symmetryScore: number;
}

export function computeFacialRatios(
  landmarks: Array<{ x: number; y: number }> | null,
): FaceRatios | null {
  if (!landmarks || landmarks.length < 468) {
    return null;
  }

  const distance = (a: number, b: number) => {
    const dx = landmarks[a].x - landmarks[b].x;
    const dy = landmarks[a].y - landmarks[b].y;
    return Math.hypot(dx, dy);
  };

  const faceWidth = distance(234, 454);
  const faceHeight = distance(10, 152);
  const eyeDistance = distance(33, 263);
  const jawWidth = distance(172, 397);
  const noseWidth = distance(94, 331);
  const lipWidth = distance(61, 291);

  const leftEyeWidth = distance(33, 133);
  const rightEyeWidth = distance(362, 263);
  const leftBrowHeight = distance(159, 65);
  const rightBrowHeight = distance(386, 295);

  const symmetryPenalty =
    Math.abs(leftEyeWidth - rightEyeWidth) / Math.max(leftEyeWidth, rightEyeWidth) +
    Math.abs(leftBrowHeight - rightBrowHeight) / Math.max(leftBrowHeight, rightBrowHeight);

  const symmetryScore = Math.max(0.7, 1 - symmetryPenalty * 0.5);

  return {
    eyeDistanceRatio: eyeDistance / faceWidth,
    jawWidthRatio: jawWidth / faceWidth,
    faceWidthRatio: faceWidth / faceHeight,
    faceHeightRatio: faceHeight / faceWidth,
    noseWidthRatio: noseWidth / faceWidth,
    lipWidthRatio: lipWidth / faceWidth,
    symmetryScore,
  };
}

function clampScore(score: number): number {
  return Math.max(40, Math.min(98, Math.round(score)));
}

function ratioScore(ratio: number, ideal: number, tolerance = 0.12): number {
  const delta = Math.abs(ratio - ideal);
  const normalized = Math.min(1, delta / tolerance);
  return clampScore(95 - normalized * 45);
}

function derivePriorityScores(ratios: FaceRatios, answers: QuizAnswers) {
  const jawScore = ratioScore(ratios.jawWidthRatio, 0.54);
  const skinScore = clampScore(88 - Math.abs(answers.age - 28) * 0.6);
  const browScore = ratioScore(ratios.eyeDistanceRatio, 0.46);
  const noseScore = ratioScore(ratios.noseWidthRatio, 0.24);
  const lipScore = ratioScore(ratios.lipWidthRatio, 0.38);

  return {
    jawScore,
    skinScore,
    browScore,
    noseScore,
    lipScore,
  };
}

function buildPriorities(scores: ReturnType<typeof derivePriorityScores>): Priority[] {
  const priorities: Array<Priority> = [
    {
      id: 1,
      name: 'Mandíbula',
      score: scores.jawScore,
      metric: 'Largura mandibular',
      action: scores.jawScore >= 75
        ? 'Manter definição com rotina de postura e hidratação.'
        : 'Fortalecer contorno mandibular com exercícios e redução de edema.',
      product: 'Exercitador facial + rotina de massagem',
      coupon: 'GLOWJAW15',
    },
    {
      id: 2,
      name: 'Pele',
      score: scores.skinScore,
      metric: 'Textura e uniformidade',
      action: scores.skinScore >= 75
        ? 'Manter protocolo com vitamina C e proteção solar.'
        : 'Intensificar rotina com limpeza, esfoliação e sérum noturno.',
      product: 'Sérum Vitamina C + Retinol',
      coupon: 'GLOWSKIN20',
    },
    {
      id: 3,
      name: 'Sobrancelha',
      score: scores.browScore,
      metric: 'Distância e simetria ocular',
      action: scores.browScore >= 75
        ? 'Manter desenho atual com alinhamento natural.'
        : 'Ajustar formato para abrir o olhar e melhorar simetria.',
      product: 'Sérum Crescimento Sobrancelhas',
      coupon: 'GLOWBROW10',
    },
    {
      id: 4,
      name: 'Nariz',
      score: scores.noseScore,
      metric: 'Proporção nasal',
      action: scores.noseScore >= 75
        ? 'Manter proporções com foco em harmonia geral.'
        : 'Trabalhar ângulo de perfil com maquiagem e styling.',
      product: 'Contorno facial premium',
      coupon: 'GLOWNOSE10',
    },
    {
      id: 5,
      name: 'Lábios',
      score: scores.lipScore,
      metric: 'Largura e proporção labial',
      action: scores.lipScore >= 75
        ? 'Manter hidratação para evidenciar volume.'
        : 'Investir em hidratação profunda e definição de contorno.',
      product: 'Ácido hialurônico labial',
      coupon: 'GLOWLIPS12',
    },
  ];

  return priorities;
}

function buildFacialMetrics(ratios: FaceRatios): FacialMetric[] {
  return [
    {
      region: 'Proporção facial',
      metric: 'Largura x altura',
      result: ratios.faceWidthRatio.toFixed(2),
      ideal: '0.70 - 0.78',
    },
    {
      region: 'Simetria',
      metric: 'Score de equilíbrio',
      result: ratios.symmetryScore.toFixed(2),
      ideal: '0.95',
    },
    {
      region: 'Olhos',
      metric: 'Distância intercantal',
      result: ratios.eyeDistanceRatio.toFixed(2),
      ideal: '0.45 - 0.49',
    },
    {
      region: 'Mandíbula',
      metric: 'Largura mandibular',
      result: ratios.jawWidthRatio.toFixed(2),
      ideal: '0.52 - 0.58',
    },
    {
      region: 'Nariz',
      metric: 'Largura nasal',
      result: ratios.noseWidthRatio.toFixed(2),
      ideal: '0.22 - 0.26',
    },
    {
      region: 'Lábios',
      metric: 'Largura labial',
      result: ratios.lipWidthRatio.toFixed(2),
      ideal: '0.36 - 0.42',
    },
  ];
}

function buildPersonalizedText(
  answers: QuizAnswers,
  globalScore: number,
  topPriority: string,
): string {
  const ageGroup = answers.age <= 25 ? 'jovem' : answers.age <= 40 ? 'adulto' : 'maduro';
  if (globalScore >= 80) {
    return `Seu perfil ${ageGroup} apresenta ótima harmonia facial. O ponto principal para elevar ainda mais sua estética é ${topPriority.toLowerCase()}.`;
  }
  if (globalScore >= 60) {
    return `Seu perfil ${ageGroup} tem bom potencial. Focando em ${topPriority.toLowerCase()} você alcança uma evolução visível nas próximas semanas.`;
  }
  return `Há espaço relevante para evolução no perfil ${ageGroup}. Reforçar ${topPriority.toLowerCase()} traz o maior ganho visual agora.`;
}

export function buildAnalysisFromRatios(answers: QuizAnswers, ratios: FaceRatios): AnalysisResult {
  const priorityScores = derivePriorityScores(ratios, answers);
  const priorities = buildPriorities(priorityScores);
  const facialMetrics = buildFacialMetrics(ratios);
  const globalScore = clampScore(
    (priorityScores.jawScore + priorityScores.skinScore + priorityScores.browScore +
      priorityScores.noseScore + priorityScores.lipScore) / 5 +
      (ratios.symmetryScore - 0.85) * 40,
  );
  const potentialScore = clampScore(globalScore + 10);
  const topPriority = [...priorities].sort((a, b) => a.score - b.score)[0];

  return {
    globalScore,
    priorities,
    facialMetrics,
    personalizedText: buildPersonalizedText(answers, globalScore, topPriority.name),
    potentialScore,
  };
}
