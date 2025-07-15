// src/components/common/LoadingStates.js
import React from 'react';
import { Loader2 } from 'lucide-react';

// Main Loading Spinner
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

// Full Page Loading
export const PageLoader = ({ text = 'Loading page...' }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

// Skeleton Loading Components
export const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
    </div>
    <div className="mt-4 flex space-x-2">
      <div className="h-8 bg-gray-300 rounded w-20"></div>
      <div className="h-8 bg-gray-300 rounded w-24"></div>
    </div>
  </div>
);

// Skeleton for Seminar Cards
export const SkeletonSeminarCard = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300"></div>
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Skeleton for Coach Cards
export const SkeletonCoachCard = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div className="ml-4 flex-1">
        <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-4/5"></div>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="h-6 bg-gray-300 rounded w-8 mx-auto mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-12 mx-auto"></div>
      </div>
      <div className="text-center">
        <div className="h-6 bg-gray-300 rounded w-8 mx-auto mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-12 mx-auto"></div>
      </div>
      <div className="text-center">
        <div className="h-6 bg-gray-300 rounded w-8 mx-auto mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-12 mx-auto"></div>
      </div>
    </div>
    
    <div className="h-8 bg-gray-300 rounded w-full"></div>
  </div>
);

// Skeleton for Dashboard Stats
export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton for Table
export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="animate-pulse">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded w-20"></div>
          ))}
        </div>
      </div>
      
      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(cols)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-300 rounded w-24"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Button Loading State
export const LoadingButton = ({ 
  loading, 
  children, 
  className = '', 
  size = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <button 
      className={`${className} ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className={`${sizeClasses[size]} animate-spin`} />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Inline Loading for specific sections
export const InlineLoader = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      <span className="text-gray-600">{text}</span>
    </div>
  </div>
);

// Overlay Loading
export const OverlayLoader = ({ show, text = 'Processing...' }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 text-center">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

// Progress Bar
export const ProgressBar = ({ 
  progress, 
  showPercentage = true, 
  className = '',
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
    </div>
  );
};

// Pulsing Dot (for live indicators)
export const PulsingDot = ({ color = 'green', size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}></div>
  );
};

// Loading Grid (for grids of cards)
export const LoadingGrid = ({ 
  type = 'card', 
  count = 6, 
  cols = 3 
}) => {
  const SkeletonComponent = type === 'seminar' ? SkeletonSeminarCard : 
                           type === 'coach' ? SkeletonCoachCard : 
                           SkeletonCard;

  return (
    <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols}`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

export default {
  LoadingSpinner,
  PageLoader,
  SkeletonCard,
  SkeletonSeminarCard,
  SkeletonCoachCard,
  SkeletonStats,
  SkeletonTable,
  LoadingButton,
  InlineLoader,
  OverlayLoader,
  ProgressBar,
  PulsingDot,
  LoadingGrid
};