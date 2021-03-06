import React, { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = Readonly<{
  hasError: boolean;
}>;

export default class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error) {
    console.log(error)
    return { hasError: true };
  }

  readonly state: State = {
    hasError: false,
  };

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? (
      <div className="error-boundary-screen">
        <div>
          <h1>Unexpected Error</h1>
          <p>This is a problem.</p>
          <p>
            <button onClick={() => window.location.reload()}>Reload</button>
          </p>
        </div>
      </div>
    ) : (
      children
    );
  }
}
