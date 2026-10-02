import React from 'react';

export default function CropImage({ src, alt, className = '' }) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={`crop-image-wrapper ${className}`}>
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          className="crop-image"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="crop-image-fallback">
          <div className="fallback-icon">🌱</div>
          <div className="fallback-text">Image Coming Soon</div>
        </div>
      )}
    </div>
  );
}