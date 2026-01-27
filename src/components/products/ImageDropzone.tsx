import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageDropzoneProps {
  onFileSelect: (file: File | undefined) => void;
  preview?: string | null;
  disabled?: boolean;
  accept?: string;
}

export const ImageDropzone = ({
  onFileSelect,
  preview,
  disabled = false,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
}: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [onFileSelect]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(undefined);
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-lg transition-colors',
        isDragging && 'border-primary bg-primary/5',
        !isDragging && !preview && 'border-muted-foreground/25 hover:border-muted-foreground/50',
        preview && 'border-muted-foreground/25',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer'
      )}
    >
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg group">
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
          {/* Overlay con indicador de que puede arrastrar/click para cambiar */}
          <div className={cn(
            "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
            isDragging && "opacity-100"
          )}>
            <div className="text-center text-white">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">
                {isDragging ? 'Suelta la nueva imagen' : 'Click o arrastra para cambiar'}
              </p>
            </div>
          </div>
          {/* Botón X para eliminar */}
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-background transition-colors z-10"
              aria-label="Eliminar imagen"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {/* Input file oculto pero activo */}
          <label className="absolute inset-0 cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              disabled={disabled}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-muted">
              {isDragging ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG o WEBP (máx. 20MB)
              </p>
            </div>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
