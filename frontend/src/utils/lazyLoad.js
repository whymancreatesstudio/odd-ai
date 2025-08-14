import React, { Suspense, lazy } from 'react';

// Utility for better lazy loading with error handling
export const lazyLoad = (importFunc, fallback = null) => {
    const LazyComponent = lazy(importFunc);

    return (props) => (
        <Suspense fallback={fallback || (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading...</h2>
                    <p className="text-slate-600">Please wait while we load the component</p>
                </div>
            </div>
        )}>
            <LazyComponent {...props} />
        </Suspense>
    );
};

// Preload components for better UX
export const preloadComponent = (importFunc) => {
    const Component = lazy(importFunc);
    // Trigger the import to start loading
    importFunc();
    return Component;
}; 