import React from 'react';
import { FaExclamationTriangle, FaRefresh } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Sector Failure Logged:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-900/10 border border-red-500/50 rounded-2xl text-center">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Component Sector Failure</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        An error occurred while rendering this module. Other sectors remain operational.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 mx-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        REBOOT MODULE
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;