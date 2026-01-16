import React from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
    srcSet?: string;
    sizes?: string;
}

/**
 * Componente LazyImage optimizado para performance
 * - Lazy loading por defecto
 * - Decoding asincrónico
 * - Soporte para imágenes críticas con priority
 * - Responsive images con srcSet y sizes
 */
export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
    srcSet,
    sizes
}) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            srcSet={srcSet}
            sizes={sizes}
            style={{ contentVisibility: 'auto' }}
        />
    );
};

export default LazyImage;
