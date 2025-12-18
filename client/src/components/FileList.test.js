import { render, screen, fireEvent } from '@testing-library/react';
import FileList from './FileList';

test('filters files when search term is typed', async () => {
    render(<FileList token="mock_token" refreshTrigger={0} />);

    const searchInput = screen.getByPlaceholderText(/Search assets/i);
    fireEvent.change(searchInput, { target: { value: 'test-image' } });

    // Verify that the filtered results appear
    const fileItem = await screen.findByText(/test-image/i);
    expect(fileItem).toBeInTheDocument();
});