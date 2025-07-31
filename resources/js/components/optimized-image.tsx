import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    fallback?: string;
}

export default function OptimizedImage({ src, alt, className = '', fallback = '/placeholder.jpg' }: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Loading Placeholder */}
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            )}
            
            {/* Actual Image */}
            <img
                src={hasError ? fallback : src}
                alt={alt}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
} 