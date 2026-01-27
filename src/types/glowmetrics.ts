export interface QuizAnswers {
  age: number;
  sex: 'male' | 'female';
  selfPerception: string;
  concern: string;
  goal: string;
}

export interface AnalysisResult {
  globalScore: number;
  priorities: Priority[];
  facialMetrics: FacialMetric[];
  personalizedText: string;
  potentialScore: number;
}

export interface Priority {
  id: number;
  name: string;
  score: number;
  metric: string;
  action: string;
  product: string;
  coupon: string;
}

export interface FacialMetric {
  region: string;
  metric: string;
  result: string;
  ideal: string;
}

export interface ChecklistDay {
  day: number;
  title: string;
  task: string;
  completed: boolean;
}
