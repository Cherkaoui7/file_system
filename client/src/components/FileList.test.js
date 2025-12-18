import { render, screen, fireEvent } from '@testing-library/react';
import FileList from './FileList';
import '@testing-library/jest-dom';

// Mocking axios to prevent actual API calls during testing
import axios from 'axios';
jest.mock('axios');

const mockFiles = [
    { _id: '1', originalName: 'vacation.jpg', mimetype: 'image/jpeg' },
    { _id: '2', originalName: 'project_demo.mp4', mimetype: 'video/mp4' }
];

test('renders FileList and filters by search term', async () => {
    // Setup mock response
    axios.get.mockResolvedValue({ data: mockFiles });

    render(<FileList token="mock_token" refreshTrigger={0} />);

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText(/Search assets/i);

    // Simulate typing "vacation"
    fireEvent.change(searchInput, { target: { value: 'vacation' } });

    // Verify the filtered file appears
    const imageFile = await screen.findByText(/vacation.jpg/i);
    expect(imageFile).toBeInTheDocument();

    // Verify the video file is filtered out
    const videoFile = screen.queryByText(/project_demo.mp4/i);
    expect(videoFile).not.toBeInTheDocument();
});