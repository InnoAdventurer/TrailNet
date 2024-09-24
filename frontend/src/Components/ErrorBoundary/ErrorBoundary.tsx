// frontend/src/Components/ErrorBoundary/ErrorBoundary.tsx

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { ErrorContext, ErrorContextType } from '../../contexts/ErrorContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = ErrorContext; // Attach context type

  declare context: ErrorContextType; // Properly declare context as ErrorContextType

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  // This lifecycle method will catch errors thrown by children components
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { setError } = this.context; // Now, `setError` is typed correctly
    setError(error.message); // Pass the error to the ErrorProvider
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  // Optionally reset error state if needed
  handleRetry = () => {
    this.setState({ hasError: false });
    this.context.setError(null); // Reset the error in ErrorProvider
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={this.handleRetry}>Try again</button>
        </div>
      );
    }

    // Render child components when there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;