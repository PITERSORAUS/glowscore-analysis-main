import { useState, useCallback } from 'react';
import { Upload, Camera, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SelfieUploadProps {
  onUpload: (file: File) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function SelfieUpload({ onUpload, onGenerate, isGenerating }: SelfieUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onUpload(file);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = () => setPreview(null);

  return (
    <div className="glass rounded-2xl p-6 md:p-8 max-w-md mx-auto animate-fade-in-up glow-box">
      <h2 className="text-xl md:text-2xl font-semibold mb-2 gradient-text text-center">
        Envie sua selfie
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        Tire uma foto frontal com boa iluminação
      </p>

      {!preview ? (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300',
            isDragging
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-glass-border bg-glass-bg/30 hover:border-primary/50 hover:bg-primary/5'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4 p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {isDragging ? (
                <Upload className="w-8 h-8 text-primary animate-bounce" />
              ) : (
                <Camera className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium mb-1">Arraste sua foto aqui</p>
              <p className="text-sm text-muted-foreground">ou clique para selecionar</p>
            </div>
          </div>
        </label>
      ) : (
        <div className="relative aspect-square rounded-xl overflow-hidden border border-glass-border">
          <img
            src={preview}
            alt="Preview da selfie"
            className="w-full h-full object-cover"
          />
          <button
            onClick={clearPreview}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Button
        onClick={onGenerate}
        disabled={!preview || isGenerating}
        className="w-full mt-6 gradient-primary h-12 text-base"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
            Analisando...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Gerar score
          </>
        )}
      </Button>
    </div>
  );
}
