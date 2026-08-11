import React from 'react';
import { Button, Card } from './UI';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Something Went Wrong</h2>
            <p className="text-sm text-slate-600">
              An unexpected application error occurred. Click reload to refresh your workspace session.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="w-full space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
