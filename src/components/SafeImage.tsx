/**
 * @file Safe Image Component
 * Handles CORS errors and provides fallback for external images
 */

import { Box, BoxProps } from '@mui/material';
import * as React from 'react';
import { getBestImageSrc } from '../utils/imageProxy';

interface SafeImageProps extends Omit<BoxProps, 'component' | 'src' | 'alt' | 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  onLoad, 
  onError, 
  fallbackSrc,
  ...boxProps 
}: SafeImageProps) {
  const defaultFallback = `${import.meta.env.BASE_URL}static/images/default-cover.svg`;
  const finalFallbackSrc = fallbackSrc || defaultFallback;
  
  // Use centralized image source logic
  const [imgSrc, setImgSrc] = React.useState(() => getBestImageSrc(src, finalFallbackSrc));
  const [hasError, setHasError] = React.useState(false);

  // Reset when src changes
  React.useEffect(() => {
    setImgSrc(getBestImageSrc(src, finalFallbackSrc));
    setHasError(false);
  }, [src, finalFallbackSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(false);
    onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!hasError && imgSrc !== finalFallbackSrc) {
      // On error, use fallback
      setHasError(true);
      setImgSrc(finalFallbackSrc);
    }
    onError?.(e);
  };

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      onLoad={handleImageLoad}
      onError={handleImageError}
      referrerPolicy="no-referrer"
      loading="lazy"
      {...boxProps}
    />
  );
}