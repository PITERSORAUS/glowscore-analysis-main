-- Create analysis_results table for storing analysis outputs and access codes
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_code TEXT NOT NULL UNIQUE,
  quiz_answers JSONB NOT NULL,
  analysis_result JSONB NOT NULL,
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analysis results"
ON public.analysis_results
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read analysis results"
ON public.analysis_results
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update analysis results"
ON public.analysis_results
FOR UPDATE
USING (true);
