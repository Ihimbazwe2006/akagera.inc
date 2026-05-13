import React, { useState, useEffect } from 'react';

export default function ServiceImage({ src, alt, fallback, maxRetries = 3, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [retries, setRetries] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setRetries(0);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (retries < maxRetries) {
      setRetries(r => r + 1);
      setTimeout(() => setImgSrc(src + '?retry=' + (retries + 1)), 500);
    } else {
      setError(true);
    }
  };

  if (error) return fallback;
  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
}
