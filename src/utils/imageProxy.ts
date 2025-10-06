/**
 * @file Image Proxy Utilities
 * Centralized utilities for handling CORS-blocked images and fallbacks
 */

// Centralized list of problematic domains
const PROBLEMATIC_DOMAINS = [
  'images-na.ssl-images-amazon.com',
  'images.gr-assets.com', 
  's.gr-assets.com',
  'books.google.com/books/content' // Only block the specific Google Books API endpoint that causes CORS
];

// Centralized list of allowed proxy domains for security
const ALLOWED_PROXY_DOMAINS = [
  'books.google.com',
  'images-na.ssl-images-amazon.com', 
  'images.gr-assets.com',
  's.gr-assets.com',
  'lh3.googleusercontent.com',
  'books.googleusercontent.com'
];

const BACKEND_URL = 'http://localhost:8000'; // FastAPI default port

/**
 * Check if an image URL is from an external domain that commonly blocks CORS
 */
export function isProblematicImageUrl(url: string): boolean {
  if (!url || !url.startsWith('http')) return false;
  
  // Check for exact domain matches or specific problematic paths
  return PROBLEMATIC_DOMAINS.some(domain => {
    if (domain.includes('/')) {
      // For paths like 'books.google.com/books/content', check if URL contains the full path
      return url.includes(domain);
    } else {
      // For domain-only entries, check if the domain appears in the URL
      return url.includes(domain);
    }
  });
}

/**
 * Check if a domain is allowed for proxying (security check)
 */
export function isAllowedProxyDomain(url: string): boolean {
  if (!url || !url.startsWith('http')) return false;
  return ALLOWED_PROXY_DOMAINS.some(domain => url.includes(domain));
}

/**
 * Get the best image source to use, applying proxy logic when needed
 */
export function getBestImageSrc(originalSrc: string, fallbackSrc?: string): string {
  const defaultFallback = `${import.meta.env.BASE_URL}static/images/default-cover.svg`;
  const finalFallbackSrc = fallbackSrc || defaultFallback;
  
  if (!originalSrc || !originalSrc.startsWith('http')) {
    return originalSrc || finalFallbackSrc;
  }

  // If this is a known problematic domain, use proxy
  if (isProblematicImageUrl(originalSrc)) {
    return getProxyImageUrl(originalSrc);
  }

  return originalSrc;
}

/**
 * Generate a proxy URL for images that might be blocked by CORS
 * Uses the backend proxy endpoint
 */
export function getProxyImageUrl(originalUrl: string): string {
  if (!originalUrl || !originalUrl.startsWith('http')) {
    return originalUrl;
  }
  
  return `${BACKEND_URL}/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

/**
 * Test if an image URL can be loaded
 */
export function testImageLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.referrerPolicy = 'no-referrer';
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}