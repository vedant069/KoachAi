// Configuration helper for environment variables

export const config = {
  // Backend API configuration
  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
    timeout: 30000, // 30 seconds
  },
  
  // Development mode check
  isDevelopment: import.meta.env.DEV,
  
  // Get full API endpoint
  getApiUrl: (endpoint: string) => {
    const baseUrl = config.api.baseUrl;
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
};

// Log configuration in development
if (config.isDevelopment) {
  console.log('🔧 Frontend Config:', {
    backendUrl: config.api.baseUrl,
    isDev: config.isDevelopment
  });
}
