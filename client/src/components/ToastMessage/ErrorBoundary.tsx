// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600">
          <h2>Something went wrong 😢</h2>
          <p>Please refresh the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
