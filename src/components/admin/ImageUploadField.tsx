import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage } from '../../services/polls';
import { useToast } from '../ui/Toast';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      showToast('Image upload failed. Try a smaller file.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Product image</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-paper-dim dark:bg-white/5 max-w-xs">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-xs aspect-[4/3] rounded-xl border-2 border-dashed border-line dark:border-white/15 flex flex-col items-center justify-center gap-2 text-ink-soft dark:text-paper/50 hover:border-made hover:text-made transition-colors"
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="size-6" />
              <span className="text-sm font-medium">Upload image</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
