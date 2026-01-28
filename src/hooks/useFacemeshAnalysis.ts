import { useCallback, useMemo, useState } from 'react';
import {
  FilesetResolver,
  FaceLandmarker,
  type FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';
import type { QuizAnswers } from '@/types/glowmetrics';
import { buildAnalysisFromRatios, computeFacialRatios } from '@/lib/facemesh-analysis';

let cachedLandmarker: FaceLandmarker | null = null;

async function getLandmarker() {
  if (cachedLandmarker) return cachedLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm',
  );
  cachedLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
    },
    runningMode: 'IMAGE',
    numFaces: 1,
  });

  return cachedLandmarker;
}

interface FacemeshState {
  isLoading: boolean;
  error: string | null;
}

export function useFacemeshAnalysis() {
  const [state, setState] = useState<FacemeshState>({ isLoading: false, error: null });

  const analyze = useCallback(async (file: File, answers: QuizAnswers) => {
    setState({ isLoading: true, error: null });
    try {
      const landmarker = await getLandmarker();
      const bitmap = await createImageBitmap(file);
      const result = landmarker.detect(bitmap) as FaceLandmarkerResult;
      bitmap.close();

      const landmarks = result.faceLandmarks?.[0] ?? null;
      const ratios = computeFacialRatios(landmarks);
      if (!ratios) {
        setState({ isLoading: false, error: 'Não foi possível identificar um rosto. Tente outra foto.' });
        return null;
      }

      const analysis = buildAnalysisFromRatios(answers, ratios);
      setState({ isLoading: false, error: null });
      return analysis;
    } catch (error) {
      console.error('Error running facemesh analysis', error);
      setState({ isLoading: false, error: 'Não foi possível analisar a selfie. Tente novamente.' });
      return null;
    }
  }, []);

  return useMemo(
    () => ({
      analyze,
      isLoading: state.isLoading,
      error: state.error,
    }),
    [analyze, state.error, state.isLoading],
  );
}
