// src/utils/accessibility.js - Accessibility helpers
export const a11y = {
  // Screen reader announcements
  announce(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Focus management
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === 'Escape') {
        element.dispatchEvent(new CustomEvent('escape'));
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Generate unique IDs for form associations
  generateId(prefix = 'element') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Keyboard navigation helpers
  handleArrowNavigation(items, currentIndex, direction) {
    let nextIndex = currentIndex;
    
    switch (direction) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
    }
    
    return nextIndex;
  }
};

// src/components/common/AccessibleModal.js
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { a11y } from '../../utils/accessibility';

export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  closeOnEscape = true,
  closeOnOverlay = true
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement;
      
      // Trap focus in modal
      const cleanup = a11y.trapFocus(modalRef.current);
      
      // Announce modal opening
      a11y.announce(`${title} dialog opened`);
      
      // Handle escape key
      const handleEscape = () => {
        if (closeOnEscape) onClose();
      };
      
      modalRef.current?.addEventListener('escape', handleEscape);
      
      return () => {
        cleanup();
        modalRef.current?.removeEventListener('escape', handleEscape);
        
        // Restore focus
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
        
        // Announce modal closing
        a11y.announce(`${title} dialog closed`);
      };
    }
  }, [isOpen, title, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-lg ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// src/hooks/usePerformance.js - Performance monitoring
import { useEffect, useRef } from 'react';

export const usePerformance = (componentName) => {
  const renderStart = useRef(performance.now());
  
  useEffect(() => {
    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStart.current;
    
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
    
    renderStart.current = performance.now();
  });
};

// Image lazy loading with intersection observer
export const useLazyImage = (src, threshold = 0.1) => {
  const [loaded, setLoaded] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const imgSrc = inView ? src : undefined;

  return {
    ref: imgRef,
    src: imgSrc,
    loaded,
    onLoad: () => setLoaded(true)
  };
};

// src/components/common/LazyImage.js
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  ...props 
}) => {
  const { ref, src: lazySrc, loaded, onLoad } = useLazyImage(src);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Placeholder */}
      {!loaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          {placeholder}
        </div>
      )}
      
      {/* Actual image */}
      {lazySrc && (
        <img
          src={lazySrc}
          alt={alt}
          onLoad={onLoad}
          className={`transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

// src/utils/performance.js - Performance utilities
export const performance = {
  // Debounce function for search inputs
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Measure component render time
  measureRender(componentName, renderFn) {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    console.log(`🎯 ${componentName} render time: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  // Bundle size analyzer helper
  analyzeBundle() {
    if (process.env.NODE_ENV === 'development') {
      import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
        console.log('📦 Bundle analysis available');
      });
    }
  },

  // Memory usage monitor
  monitorMemory() {
    if ('memory' in performance) {
      const memory = performance.memory;
      console.log('💾 Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
      });
    }
  }
};

// src/components/common/VirtualizedList.js - For large lists
import React, { useState, useEffect, useMemo } from 'react';

export const VirtualizedList = ({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    return { start: Math.max(0, start - overscan), end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// src/utils/seo.js - SEO helpers
export const seo = {
  updateTitle(title) {
    document.title = title ? `${title} | Learno` : 'Learno - Learn from Expert Coaches';
  },

  updateMetaDescription(description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  },

  updateOgTags(data) {
    const { title, description, image, url } = data;
    
    this.updateOrCreateMeta('property', 'og:title', title);
    this.updateOrCreateMeta('property', 'og:description', description);
    this.updateOrCreateMeta('property', 'og:image', image);
    this.updateOrCreateMeta('property', 'og:url', url);
  },

  updateOrCreateMeta(attribute, value, content) {
    let meta = document.querySelector(`meta[${attribute}="${value}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, value);
      document.head.appendChild(meta);
    }
    meta.content = content;
  },

  addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
};

// Export all utilities
export default {
  a11y,
  performance,
  seo,
  AccessibleModal,
  LazyImage,
  VirtualizedList,
  usePerformance,
  useLazyImage
};