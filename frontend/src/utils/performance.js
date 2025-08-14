// Performance monitoring utilities
export const performanceMetrics = {
    // Track component load times
    componentLoadTime: {},

    // Track bundle sizes
    bundleSizes: {},

    // Track user interactions
    userInteractions: [],
};

// Measure component load time
export const measureComponentLoad = (componentName) => {
    const startTime = performance.now();

    return () => {
        const loadTime = performance.now() - startTime;
        performanceMetrics.componentLoadTime[componentName] = loadTime;

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
        }

        return loadTime;
    };
};

// Measure bundle performance
export const measureBundlePerformance = () => {
    if ('performance' in window && 'getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation');
        const resourceEntries = performance.getEntriesByType('resource');

        // Calculate total bundle size
        const totalSize = resourceEntries.reduce((total, resource) => {
            if (resource.name.includes('assets/')) {
                return total + (resource.transferSize || 0);
            }
            return total;
        }, 0);

        performanceMetrics.bundleSizes.total = totalSize;
        performanceMetrics.bundleSizes.entries = resourceEntries.length;

        return {
            totalSize: (totalSize / 1024).toFixed(2) + ' KB',
            resourceCount: resourceEntries.length,
            loadTime: navigationEntries[0]?.loadEventEnd - navigationEntries[0]?.loadEventStart || 0
        };
    }

    return null;
};

// Track user interactions for performance insights
export const trackUserInteraction = (action, timestamp = Date.now()) => {
    performanceMetrics.userInteractions.push({
        action,
        timestamp,
        performance: measureBundlePerformance()
    });
}; 