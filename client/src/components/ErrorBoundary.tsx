import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                        An unexpected error occurred while rendering this module. We apologize for the inconvenience.
                    </p>
                    <div className="flex gap-4 max-w-md mx-auto p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-left overflow-x-auto w-full mb-8 border border-gray-200 dark:border-gray-700">
                        <code className="text-sm text-red-600 dark:text-red-400 font-mono">
                            {this.state.error?.message}
                        </code>
                    </div>
                    <Button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Application
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
