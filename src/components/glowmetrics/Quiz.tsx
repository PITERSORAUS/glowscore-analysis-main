import { useState } from 'react';
import { QuizCard } from './QuizCard';
import { QuizOption } from './QuizOption';
import { QuizAnswers } from '@/types/glowmetrics';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Sparkles } from 'lucide-react';

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
}

const selfPerceptionOptions = [
  'Muito bem, me cuido bastante',
  'Bem, mas posso melhorar',
  'Normal, não penso muito nisso',
  'Insatisfeito, quero mudar',
];

const concernOptions = [
  'Mandíbula pouco definida',
  'Pele com imperfeições',
  'Cabelo sem volume',
  'Barba irregular',
  'Sobrancelhas finas',
  'Assimetria facial',
];

const goalOptions = [
  'Melhorar definição facial',
  'Pele mais saudável e luminosa',
  'Visual mais harmonioso',
  'Aumentar autoconfiança',
  'Transformação completa',
];

export function Quiz({ onComplete }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({
    age: 25,
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (isStepComplete()) {
      onComplete(answers as QuizAnswers);
    }
  };

  const isStepComplete = (): boolean => {
    switch (step) {
      case 0:
        return answers.age !== undefined;
      case 1:
        return answers.sex !== undefined;
      case 2:
        return answers.selfPerception !== undefined;
      case 3:
        return answers.concern !== undefined;
      case 4:
        return answers.goal !== undefined;
      default:
        return false;
    }
  };

  return (
    <div className="relative min-h-[400px] flex items-center justify-center">
      {/* Step 0: Age */}
      <QuizCard
        title="Qual sua idade?"
        subtitle="Isso nos ajuda a personalizar sua análise"
        isActive={step === 0}
        step={step}
        totalSteps={5}
      >
        <div className="py-8">
          <div className="text-center mb-6">
            <span className="text-5xl font-bold gradient-text">{answers.age}</span>
            <span className="text-2xl text-muted-foreground ml-2">anos</span>
          </div>
          <Slider
            value={[answers.age || 25]}
            onValueChange={(value) => setAnswers({ ...answers, age: value[0] })}
            min={13}
            max={50}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>13</span>
            <span>50</span>
          </div>
        </div>
        <Button onClick={handleNext} className="w-full gradient-primary" disabled={!isStepComplete()}>
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </QuizCard>

      {/* Step 1: Sex */}
      <QuizCard
        title="Qual seu sexo?"
        isActive={step === 1}
        step={step}
        totalSteps={5}
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAnswers({ ...answers, sex: 'male' })}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              answers.sex === 'male'
                ? 'border-primary bg-primary/10 glow-box-sm'
                : 'border-glass-border bg-glass-bg/50 hover:border-primary/50'
            }`}
          >
            <span className="text-3xl mb-2 block">👨</span>
            <span className={answers.sex === 'male' ? 'text-primary font-medium' : ''}>
              Masculino
            </span>
          </button>
          <button
            onClick={() => setAnswers({ ...answers, sex: 'female' })}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              answers.sex === 'female'
                ? 'border-primary bg-primary/10 glow-box-sm'
                : 'border-glass-border bg-glass-bg/50 hover:border-primary/50'
            }`}
          >
            <span className="text-3xl mb-2 block">👩</span>
            <span className={answers.sex === 'female' ? 'text-primary font-medium' : ''}>
              Feminino
            </span>
          </button>
        </div>
        <Button onClick={handleNext} className="w-full gradient-primary mt-4" disabled={!isStepComplete()}>
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </QuizCard>

      {/* Step 2: Self Perception */}
      <QuizCard
        title="Como você se enxerga hoje?"
        isActive={step === 2}
        step={step}
        totalSteps={5}
      >
        {selfPerceptionOptions.map((option) => (
          <QuizOption
            key={option}
            label={option}
            selected={answers.selfPerception === option}
            onClick={() => setAnswers({ ...answers, selfPerception: option })}
          />
        ))}
        <Button onClick={handleNext} className="w-full gradient-primary mt-2" disabled={!isStepComplete()}>
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </QuizCard>

      {/* Step 3: Concern */}
      <QuizCard
        title="O que mais te incomoda no rosto?"
        isActive={step === 3}
        step={step}
        totalSteps={5}
      >
        {concernOptions.map((option) => (
          <QuizOption
            key={option}
            label={option}
            selected={answers.concern === option}
            onClick={() => setAnswers({ ...answers, concern: option })}
          />
        ))}
        <Button onClick={handleNext} className="w-full gradient-primary mt-2" disabled={!isStepComplete()}>
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </QuizCard>

      {/* Step 4: Goal */}
      <QuizCard
        title="Qual seu objetivo estético?"
        isActive={step === 4}
        step={step}
        totalSteps={5}
      >
        {goalOptions.map((option) => (
          <QuizOption
            key={option}
            label={option}
            selected={answers.goal === option}
            onClick={() => setAnswers({ ...answers, goal: option })}
          />
        ))}
        <Button onClick={handleNext} className="w-full gradient-primary mt-2" disabled={!isStepComplete()}>
          <Sparkles className="mr-2 h-4 w-4" />
          Continuar para selfie
        </Button>
      </QuizCard>
    </div>
  );
}
