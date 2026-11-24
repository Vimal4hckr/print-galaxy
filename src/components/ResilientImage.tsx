import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#131E36] to-[#060B18] p-6 text-center ${className}`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-orange-400">
          <Layers className="h-6 w-6" aria-hidden="true" />
        </div>
        <span className="font-display text-sm font-semibold text-slate-200">
          {fallbackTitle ?? alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
