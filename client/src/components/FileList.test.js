import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileList from './FileList';
import '@testing-library/jest-dom';
import axios from 'axios';

// 1. Mock Axios
jest.mock('axios');

// 2. Mock Framer Motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        img: ({ ...props }) => <img {...props} />,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// 3. Mock React Icons
jest.mock('react-icons/fa', () => ({
    FaTrash: () => <span>Trash</span>,
    FaDownload: () => <span>Download</span>,
    FaFileAlt: () => <span>File</span>,
    FaVideo: () => <span>Video</span>,
    FaFilePdf: () => <span>PDF</span>,
    FaSearch: () => <span>Search</span>,
    FaTimesCircle: () => <span>Clear</span>,
    FaPlayCircle: () => <span>Play</span>,
    FaTimes: () => <span>Close</span>,
    FaLayerGroup: () => <span>All</span>,
    FaBoxOpen: () => <span>Empty</span>,
    FaImages: () => <span>Images</span>
}));

const mockData = [
    { _id: '1', originalName: 'super_fast_image.jpg', mimetype: 'image/jpeg' },
    { _id: '2', originalName: 'video_file.mp4', mimetype: 'video/mp4' }
];

test('Search bar filters the file list correctly', async () => {
    // Tell axios to return our mock data
    axios.get.mockResolvedValue({ data: mockData });

    render(<FileList token="fake_token" refreshTrigger={0} />);

    // 👇 FIX: Use findByPlaceholderText to wait for the loading skeleton to disappear
    const searchInput = await screen.findByPlaceholderText(/Search assets/i);

    // Type "super"
    fireEvent.change(searchInput, { target: { value: 'super' } });

    // "super_fast_image.jpg" should be visible
    expect(await screen.findByText(/super_fast_image.jpg/i)).toBeInTheDocument();

    // "video_file.mp4" should NOT be visible
    expect(screen.queryByText(/video_file.mp4/i)).not.toBeInTheDocument();
});
test('Calls delete API when trash icon is clicked', async () => {
    // 1. Mock the initial load and the delete response
    axios.get.mockResolvedValue({ data: mockData });
    axios.delete.mockResolvedValue({ status: 200 });

    // 2. Mock window.confirm (since the app asks "Delete asset permanently?")
    window.confirm = jest.fn(() => true);

    render(<FileList token="fake_token" refreshTrigger={0} />);

    // 3. Wait for the list to appear
    const fileName = await screen.findByText(/super_fast_image.jpg/i);

    // 4. Find and click the trash button (using the text we mocked earlier)
    const deleteButtons = screen.getAllByText(/Trash/i);
    fireEvent.click(deleteButtons[0]);

    // 5. Verify the API was called with the correct ID
    expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/files/1'),
        expect.any(Object)
    );

    // 6. Verify the file is removed from the UI
    await waitFor(() => {
        expect(screen.queryByText(/super_fast_image.jpg/i)).not.toBeInTheDocument();
    });
});
test('Handles unknown file types as "Other"', async () => {
    const edgeCaseData = [
        { _id: '3', originalName: 'unknown_file_no_ext', mimetype: 'application/octet-stream' }
    ];

    axios.get.mockResolvedValue({ data: edgeCaseData });

    render(<FileList token="fake_token" refreshTrigger={0} />);

    // Wait for file to render
    const unknownFile = await screen.findByText(/unknown_file_no_ext/i);
    expect(unknownFile).toBeInTheDocument();

    // Click the "Other" filter tab
    const otherTab = screen.getByRole('button', { name: /OTHER/i });
    fireEvent.click(otherTab);

    // File should still be there because it's categorized as "other"
    expect(screen.getByText(/unknown_file_no_ext/i)).toBeInTheDocument();
});