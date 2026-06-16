// Skeleton Loader Component - Style YouTube/Mey Beauty
import '../styles.css';

export function SkeletonPage() {
  return (
    <div className="skeleton-page">
      {/* Hero Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-shimmer skeleton-title" style={{ width: '60%', height: '48px', marginBottom: '16px' }}></div>
        <div className="skeleton-shimmer skeleton-breadcrumb" style={{ width: '200px', height: '16px' }}></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="skeleton-content">
        <div className="skeleton-shimmer skeleton-paragraph" style={{ width: '100%', height: '16px', marginBottom: '12px' }}></div>
        <div className="skeleton-shimmer skeleton-paragraph" style={{ width: '90%', height: '16px', marginBottom: '12px' }}></div>
        <div className="skeleton-shimmer skeleton-paragraph" style={{ width: '95%', height: '16px', marginBottom: '24px' }}></div>
        
        {/* Image Grid Skeleton */}
        <div className="skeleton-grid">
          <div className="skeleton-shimmer skeleton-card" style={{ height: '280px' }}></div>
          <div className="skeleton-shimmer skeleton-card" style={{ height: '280px' }}></div>
          <div className="skeleton-shimmer skeleton-card" style={{ height: '280px' }}></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard({ height = '200px' }) {
  return (
    <div className="skeleton-shimmer skeleton-card" style={{ height }}></div>
  );
}

export function SkeletonImage({ aspectRatio = '16/9', className = '' }) {
  return (
    <div 
      className={`skeleton-shimmer skeleton-image ${className}`}
      style={{ aspectRatio }}
    ></div>
  );
}

export function SkeletonText({ width = '100%', height = '16px', className = '' }) {
  return (
    <div 
      className={`skeleton-shimmer skeleton-text ${className}`}
      style={{ width, height }}
    ></div>
  );
}

export default SkeletonPage;
