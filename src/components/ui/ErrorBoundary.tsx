import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Track error for analytics
    if (typeof window !== 'undefined') {
      try {
        (window as any).analytics?.track('error_boundary_triggered', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
      } catch (e) {
        console.error('Failed to track error:', e);
      }
    }
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleWhatsAppSupport = () => {
    const supportMessage = encodeURIComponent(
      "Hi! I encountered an error on the LexiPay AI website. Can you help me?"
    );
    window.open(
      `https://wa.me/2348105786326?text=${supportMessage}`,
      '_blank'
    );
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full glass rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-destructive/20">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <h2 className="text-xl font-semibold mb-3">
              Something went wrong
            </h2>
            
            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact our support team on WhatsApp.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleRefresh}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleWhatsAppSupport}
                variant="outline"
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support on WhatsApp
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development)
                </summary>
                <pre className="text-xs mt-2 p-3 bg-muted rounded overflow-auto">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to report errors
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    
    // Track error
    if (typeof window !== 'undefined') {
      try {
        (window as any).analytics?.track('manual_error_reported', {
          error: error.message,
          context,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error('Failed to track error:', e);
      }
    }
  };

  return { handleError };
};