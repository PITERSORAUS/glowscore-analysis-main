-- Create payments table for GlowMetrics
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert payments (no auth required for this simulated payment)
CREATE POLICY "Anyone can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read payments
CREATE POLICY "Anyone can read payments"
ON public.payments
FOR SELECT
USING (true);