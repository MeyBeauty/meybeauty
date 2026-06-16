// LazyImage Component - Skeleton loader pendant le chargement
import { useState, useEffect } from 'react';
import { SkeletonImage } from './SkeletonLoader.jsx';
import '../styles.css';

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = '16/9',
  onLoad,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
    
    if (!src) {
      setHasError(true);
      return;
    }

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoaded(true);
      if (onLoad) onLoad();
    };
    
    img.onerror = () => {
      setHasError(true);
    };
  }, [src, onLoad]);

  // Show skeleton while loading
  if (!isLoaded && !hasError) {
    return <SkeletonImage aspectRatio={aspectRatio} className={className} />;
  }

  // Show skeleton on error (plus élégant que l'alt text cassé)
  if (hasError) {
    return (
      <div 
        className={`skeleton-error ${className}`}
        style={{ 
          aspectRatio,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f0eb',
          borderRadius: '12px',
          color: '#8A6E5A'
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`lazy-image ${className}`}
      loading="lazy"
      {...props}
    />
  );
}
