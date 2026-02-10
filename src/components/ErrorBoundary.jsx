
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#fff',
                    background: '#0a0a0a',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ color: '#e74c3c' }}>Something went wrong.</h1>
                    <p style={{ color: '#aaa', maxWidth: '600px' }}>
                        The application has encountered an unexpected error.
                        Please try refreshing the page or contact support if the problem persists.
                    </p>
                    <pre style={{
                        background: '#111',
                        padding: '1rem',
                        borderRadius: '8px',
                        color: '#666',
                        fontSize: '0.8rem',
                        marginTop: '2rem',
                        overflowX: 'auto',
                        maxWidth: '90%'
                    }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '0.8rem 1.5rem',
                            background: '#ff6b00',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
