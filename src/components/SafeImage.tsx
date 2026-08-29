import React, { useState, useEffect } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackText = 'Photo Unavailable',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  if (!src || src.trim() === '' || hasError) {
    return (
      <div
        className={`bg-[#f0eff5] border border-black/5 flex flex-col items-center justify-center text-[#717786] p-2 text-center select-none ${containerClassName}`}
        title={`${alt} (${fallbackText})`}
      >
        <span className="material-symbols-outlined text-xl text-[#a0a5b5] mb-0.5">
          photo_camera
        </span>
        <span className="text-[10px] font-bold text-[#717786] uppercase tracking-wider">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#e9e8f0] ${containerClassName}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#e3e2eb] animate-pulse flex items-center justify-center">
          <span className="material-symbols-outlined text-lg text-[#a0a5b5]">image</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
};
