// Nigerian network-optimized API client with bulletproof error handling
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  retryAfter?: number;
}

interface RequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout = 10000; // 10 seconds for Nigerian networks
  private defaultRetries = 3;
  private defaultRetryDelay = 1000;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      ...fetchOptions
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle specific HTTP status codes
          if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
            return {
              success: false,
              error: 'Too many requests. Please try again in a moment.',
              retryAfter
            };
          }

          if (response.status >= 500) {
            throw new Error('Server error. Please try again.');
          }

          if (response.status === 404) {
            return {
              success: false,
              error: 'Service not found. Please check your connection.'
            };
          }

          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          data
        };

      } catch (error) {
        clearTimeout(timeoutId);

        // Check if it's a network error (common in Nigeria)
        const isNetworkError = error instanceof TypeError && 
          error.message.includes('fetch');
        
        const isTimeoutError = error instanceof DOMException && 
          error.name === 'AbortError';

        // Don't retry on the last attempt
        if (attempt === retries) {
          if (isTimeoutError) {
            return {
              success: false,
              error: 'Request timed out. Please check your internet connection and try again.'
            };
          }

          if (isNetworkError) {
            return {
              success: false,
              error: 'Network error. Please check your internet connection.'
            };
          }

          return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred.'
          };
        }

        // Wait before retrying (exponential backoff)
        await this.delay(retryDelay * Math.pow(2, attempt));
      }
    }

    return {
      success: false,
      error: 'Request failed after multiple attempts.'
    };
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string, 
    data?: any, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string, 
    data?: any, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Nigerian-specific network utilities
export const NetworkUtils = {
  // Detect connection speed for adaptive loading
  async detectNetworkSpeed(): Promise<'fast' | 'medium' | 'slow' | 'offline'> {
    if (!navigator.onLine) return 'offline';

    try {
      const startTime = Date.now();
      const response = await fetch('/favicon.ico?' + Math.random(), {
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (duration < 500) return 'fast';
      if (duration < 1500) return 'medium';
      return 'slow';
    } catch {
      return 'offline';
    }
  },

  // Store network status in localStorage
  storeNetworkStatus(status: string) {
    try {
      localStorage.setItem('lexipay_network_status', status);
      localStorage.setItem('lexipay_network_timestamp', Date.now().toString());
    } catch (error) {
      console.warn('Failed to store network status:', error);
    }
  },

  // Get cached network status (if recent)
  getCachedNetworkStatus(): string | null {
    try {
      const status = localStorage.getItem('lexipay_network_status');
      const timestamp = localStorage.getItem('lexipay_network_timestamp');
      
      if (!status || !timestamp) return null;

      // Cache is valid for 5 minutes
      const age = Date.now() - parseInt(timestamp);
      if (age > 5 * 60 * 1000) return null;

      return status;
    } catch {
      return null;
    }
  }
};