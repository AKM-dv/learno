// src/components/common/ErrorBoundary.js
import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Generate unique error ID for reporting
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // You can log error to reporting service here
    // logErrorToService(error, errorInfo, errorId);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Determine error type and show appropriate fallback
      const isNetworkError = this.state.error?.message?.includes('fetch') || 
                            this.state.error?.message?.includes('network');
      
      const isChunkError = this.state.error?.message?.includes('ChunkLoadError') ||
                          this.state.error?.message?.includes('Loading chunk');

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {isChunkError ? 'Update Available' : 
                 isNetworkError ? 'Connection Problem' : 
                 'Something went wrong'}
              </h1>
              
              <p className="text-gray-600 mb-4">
                {isChunkError ? 
                  'A new version of the app is available. Please refresh to get the latest updates.' :
                 isNetworkError ? 
                  'Unable to connect to the server. Please check your internet connection.' :
                  'An unexpected error occurred. Our team has been notified.'}
              </p>

              {/* Error ID for support */}
              {this.state.errorId && (
                <div className="bg-gray-100 rounded-md p-3 mb-4">
                  <p className="text-xs text-gray-600">
                    Error ID: <code className="bg-gray-200 px-1 rounded">{this.state.errorId}</code>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* Retry button */}
              <button
                onClick={isChunkError ? () => window.location.reload() : this.handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{isChunkError ? 'Refresh Page' : 'Try Again'}</span>
              </button>

              {/* Navigation options */}
              <div className="flex space-x-2">
                <button
                  onClick={this.handleGoBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Go Back</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
              </div>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Show Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-xs">
                  <div className="font-mono text-red-800 mb-2">
                    {this.state.error.toString()}
                  </div>
                  <div className="text-red-600">
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export const withErrorBoundary = (WrappedComponent, fallbackComponent = null) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary fallback={fallbackComponent}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

// Async error boundary for route-level errors
export class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Page Not Available</h2>
            <p className="text-gray-600 mb-4">
              This page encountered an error and couldn't load properly.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Network error handler component
export const NetworkErrorBoundary = ({ children }) => {
  const [hasNetworkError, setHasNetworkError] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setHasNetworkError(false);
    const handleOffline = () => setHasNetworkError(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial network status
    setHasNetworkError(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (hasNetworkError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Internet Connection</h3>
          <p className="text-gray-600 mb-4">
            Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;