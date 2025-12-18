import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ProblemComponent = () => {
    throw new Error("Simulated Crash");
};

test('renders fallback UI when a child component crashes', () => {
    // Suppress console.error for this test to keep the output clean
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
        <ErrorBoundary>
            <ProblemComponent />
        </ErrorBoundary>
    );

    expect(screen.getByText(/Component Sector Failure/i)).toBeInTheDocument();
    spy.mockRestore();
});