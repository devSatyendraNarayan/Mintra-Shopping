import React from 'react';
import ErrorPage from '../components/ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track whether an error has occurred
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service or console
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render the custom fallback UI if an error has been caught
      return <ErrorPage />;
    }

    // Render the children components if no error has been caught
    return this.props.children;
  }
}

export default ErrorBoundary;
