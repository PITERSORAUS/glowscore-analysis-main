import { QuizAnswers, AnalysisResult, Priority, FacialMetric, ChecklistDay } from '@/types/glowmetrics';

const usedScores = new Set<number>();

function generateUniqueScore(min: number, max: number): number {
  let score: number;
  let attempts = 0;
  do {
    score = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts++;
    if (attempts > 100) {
      usedScores.clear();
    }
  } while (usedScores.has(score));
  usedScores.add(score);
  return score;
}

function calculateBaseScore(answers: QuizAnswers): number {
  let baseModifier = 0;
  
  if (answers.age <= 25) baseModifier += 8;
  else if (answers.age <= 35) baseModifier += 5;
  else if (answers.age <= 45) baseModifier += 2;
  
  if (answers.selfPerception === 'Muito bem, me cuido bastante') baseModifier += 10;
  else if (answers.selfPerception === 'Bem, mas posso melhorar') baseModifier += 5;
  else if (answers.selfPerception === 'Normal, não penso muito nisso') baseModifier += 0;
  else baseModifier -= 3;
  
  return baseModifier;
}

export function generateAnalysis(answers: QuizAnswers, hasCompleteAnalysis: boolean): AnalysisResult {
  const baseModifier = calculateBaseScore(answers);
  const maxScore = hasCompleteAnalysis ? 100 : 78;
  const minScore = 42;
  
  const adjustedMax = Math.min(maxScore, 65 + baseModifier);
  const adjustedMin = Math.max(minScore, 48 + Math.floor(baseModifier / 2));
  
  const globalScore = generateUniqueScore(adjustedMin, adjustedMax);
  
  const priorityNames = ['Mandíbula', 'Pele', 'Cabelo', 'Barba', 'Sobrancelha'];
  const priorities: Priority[] = priorityNames.map((name, index) => {
    const priorityScore = generateUniqueScore(45, 95);
    return {
      id: index + 2,
      name,
      score: priorityScore,
      metric: getMetricForPriority(name, answers),
      action: getActionForPriority(name, priorityScore),
      product: getProductForPriority(name),
      coupon: `GLOW${name.toUpperCase().slice(0, 4)}${Math.floor(Math.random() * 30) + 10}`,
    };
  });
  
  const lowestPriority = priorities.reduce((min, p) => p.score < min.score ? p : min);
  
  const facialMetrics: FacialMetric[] = [
    { region: 'Proporção facial', metric: 'Simetria', result: `${(0.9 + Math.random() * 0.15).toFixed(2)}`, ideal: '1.00' },
    { region: 'Mandíbula', metric: 'Ângulo gonial', result: `${Math.floor(115 + Math.random() * 20)}°`, ideal: '120-130°' },
    { region: 'Terço superior', metric: 'Altura testa', result: `${(30 + Math.random() * 10).toFixed(1)}%`, ideal: '33%' },
    { region: 'Terço médio', metric: 'Projeção nasal', result: `${(0.6 + Math.random() * 0.2).toFixed(2)}`, ideal: '0.67' },
    { region: 'Terço inferior', metric: 'Proporção lábios', result: `${(0.4 + Math.random() * 0.3).toFixed(2)}`, ideal: '0.5-0.7' },
    { region: 'Olhos', metric: 'Distância intercantal', result: `${(30 + Math.random() * 8).toFixed(1)}mm`, ideal: '32-36mm' },
  ];
  
  const potentialScore = Math.min(100, globalScore + 15 + Math.floor(Math.random() * 10));
  
  const personalizedText = generatePersonalizedText(answers, globalScore, lowestPriority.name);
  
  return {
    globalScore,
    priorities,
    facialMetrics,
    personalizedText,
    potentialScore,
  };
}

function getMetricForPriority(name: string, answers: QuizAnswers): string {
  const metrics: Record<string, string[]> = {
    'Mandíbula': ['Definição angular', 'Projeção lateral', 'Simetria mandibular'],
    'Pele': ['Textura uniforme', 'Luminosidade', 'Hidratação profunda'],
    'Cabelo': ['Volume e densidade', 'Brilho natural', 'Saúde capilar'],
    'Barba': ['Densidade de cobertura', 'Uniformidade', 'Linha de contorno'],
    'Sobrancelha': ['Arqueamento ideal', 'Densidade', 'Simetria'],
  };
  const options = metrics[name] || ['Análise geral'];
  return options[Math.floor(Math.random() * options.length)];
}

function getActionForPriority(name: string, score: number): string {
  if (score >= 80) {
    return `Manter rotina atual para ${name.toLowerCase()}. Excelente condição.`;
  } else if (score >= 60) {
    return `Intensificar cuidados com ${name.toLowerCase()}. Pequenos ajustes trarão grandes resultados.`;
  } else {
    return `Priorizar tratamento de ${name.toLowerCase()}. Investir em produtos específicos.`;
  }
}

function getProductForPriority(name: string): string {
  const products: Record<string, string> = {
    'Mandíbula': 'Exercitador facial JawMax Pro',
    'Pele': 'Sérum Vitamina C 20% + Retinol',
    'Cabelo': 'Kit Crescimento Capilar Minoxidil 5%',
    'Barba': 'Óleo Crescimento Barba Premium',
    'Sobrancelha': 'Sérum Crescimento Sobrancelhas',
  };
  return products[name] || 'Consulte um especialista';
}

function generatePersonalizedText(answers: QuizAnswers, score: number, mainConcern: string): string {
  const ageGroup = answers.age <= 25 ? 'jovem' : answers.age <= 40 ? 'adulto' : 'maduro';
  
  if (score >= 80) {
    return `Sua análise revela um perfil ${ageGroup} com excelente harmonia facial. Seu principal ponto de atenção é ${mainConcern.toLowerCase()}, mas no geral você está acima da média.`;
  } else if (score >= 60) {
    return `Você possui bom potencial estético para um perfil ${ageGroup}. Focando em ${mainConcern.toLowerCase()} e seguindo nosso protocolo de 30 dias, você pode alcançar resultados visíveis.`;
  } else {
    return `Identificamos oportunidades significativas de melhoria para seu perfil ${ageGroup}. ${mainConcern} é sua prioridade #1. O protocolo completo vai transformar sua aparência.`;
  }
}

export function generateChecklist(): ChecklistDay[] {
  const checklistData = [
    { day: 1, title: 'Avaliação inicial', task: 'Tire fotos de referência em boa iluminação. Comece a rotina básica de limpeza facial.' },
    { day: 2, title: 'Hidratação e limpeza', task: 'Estabeleça rotina de limpeza manhã/noite. Use hidratante adequado ao seu tipo de pele.' },
    { day: 3, title: 'Postura e mandíbula', task: 'Pratique exercícios de postura cervical. Inicie mewing por 20 minutos.' },
    { day: 4, title: 'Cuidados com a pele', task: 'Aplique protetor solar FPS 50. Evite tocar o rosto durante o dia.' },
    { day: 5, title: 'Cabelo', task: 'Lave com shampoo adequado. Aplique tratamento leave-in nas pontas.' },
    { day: 6, title: 'Hidratação interna', task: 'Beba 3 litros de água. Observe a qualidade do sono.' },
    { day: 7, title: 'Revisão semanal', task: 'Compare fotos do dia 1. Ajuste rotina conforme necessário.' },
    { day: 8, title: 'Esfoliação', task: 'Faça esfoliação suave no rosto. Aplique máscara hidratante após.' },
    { day: 9, title: 'Barba/pelos faciais', task: 'Apare barba ou pelos com precisão. Use óleo hidratante.' },
    { day: 10, title: 'Sobrancelhas', task: 'Modele sobrancelhas respeitando formato natural. Aplique sérum de crescimento.' },
    { day: 11, title: 'Sono reparador', task: 'Durma 8 horas mínimas. Use travesseiro adequado para postura.' },
    { day: 12, title: 'Nutrição', task: 'Aumente consumo de proteínas e vitaminas A, C, E. Reduza açúcar.' },
    { day: 13, title: 'Exercícios faciais', task: 'Pratique 15 minutos de exercícios para definição mandibular.' },
    { day: 14, title: 'Revisão quinzenal', task: 'Tire novas fotos. Compare evolução e documente mudanças.' },
    { day: 15, title: 'Intensificação pele', task: 'Adicione sérum de vitamina C pela manhã. Retinol à noite.' },
    { day: 16, title: 'Massagem facial', task: 'Faça massagem com gua sha ou jade roller por 10 minutos.' },
    { day: 17, title: 'Contorno', task: 'Aprenda técnicas básicas de contorno para sua estrutura facial.' },
    { day: 18, title: 'Cabelo volume', task: 'Aplique tratamento de volumização. Considere corte que valorize o rosto.' },
    { day: 19, title: 'Olheiras', task: 'Use patches ou cremes específicos para região dos olhos.' },
    { day: 20, title: 'Lábios', task: 'Esfolie e hidrate lábios. Use produtos com ácido hialurônico.' },
    { day: 21, title: 'Revisão 3 semanas', task: 'Avalie progresso geral. Ajuste produtos que não funcionaram.' },
    { day: 22, title: 'Postura avançada', task: 'Aumente tempo de mewing para 1 hora. Exercícios cervicais.' },
    { day: 23, title: 'Iluminação natural', task: 'Passe 30 min ao sol (com proteção). Vitamina D é essencial.' },
    { day: 24, title: 'Detox', task: 'Evite álcool e alimentos ultraprocessados por 48 horas.' },
    { day: 25, title: 'Tratamento intensivo', task: 'Aplique máscara facial profunda. Descanse adequadamente.' },
    { day: 26, title: 'Estilo pessoal', task: 'Escolha roupas que complementem sua estrutura facial.' },
    { day: 27, title: 'Expressão', task: 'Pratique expressões faciais que realcem seus melhores traços.' },
    { day: 28, title: 'Preparação final', task: 'Organize todos os produtos da rotina definitiva.' },
    { day: 29, title: 'Ajustes finais', task: 'Faça últimos ajustes na rotina. Prepare-se para comparação.' },
    { day: 30, title: 'Reavaliação completa', task: 'Tire fotos finais. Compare com dia 1. Celebre sua evolução!' },
  ];
  
  return checklistData.map(item => ({ ...item, completed: false }));
}
