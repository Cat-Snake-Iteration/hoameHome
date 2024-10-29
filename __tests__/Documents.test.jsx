import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Documents from '../client/components/Documents.jsx';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetchMock.resetMocks();
});

jest.mock('../client/components/Documents', () => ({
  __esModule: true,
  loadDocuments: jest.fn(), // Mock loadDocuments
  default: () => <div>Mocked Documents Component</div>, // Simple mock for the default export
}));

// failing test
// it('renders the document filename', async () => {
//   render(<Documents />); // Render your component

//   // This assertion will fail because no documents are fetched yet
//   expect(screen.getByText('File Name: TestDocument1.pdf')).toBeInTheDocument();
// });

// working test 1

it('renders the View and Delete buttons for each document', async () => {
  // Mock data to simulate documents from the server
  const mockDocuments = [
    { id: 1, filename: 'TestDocument1.pdf', type: 'application/pdf' },
    { id: 2, filename: 'TestImage.jpg', type: 'image/jpeg' },
  ];

  // Mock the fetch response to set initial state
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    json: async () => mockDocuments,
  });

  render(<Documents />);

  // Wait for the documents to be rendered
  await waitFor(() => {
    mockDocuments.forEach((doc) => {
      // Check if filename is in the document list
      expect(
        screen.getByText(`File Name: ${doc.filename}`)
      ).toBeInTheDocument();
      // Check if 'View File' and 'Delete' buttons are displayed for each document
      expect(screen.getAllByText('View File')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Delete')[0]).toBeInTheDocument();
    });
  });

  // Clean up mock fetch
  global.fetch.mockRestore();
});

// working test 2
it('submits the file and title when the form is filled and submitted', async () => {
  render(<Documents />);

  // Simulate filling out the title input
  fireEvent.change(screen.getByLabelText(/Title:/i), {
    target: { value: 'My Document' },
  });

  // Simulate filling out the file input (using a dummy file)
  const file = new File(['dummy content'], 'example.pdf', {
    type: 'application/pdf',
  });
  fireEvent.change(screen.getByLabelText(/Upload File:/i), {
    target: { files: [file] },
  });

  // Mock fetch responses
  fetch.mockResolvedValueOnce({ ok: true, json: async () => [] }); // Mock response for getDocs
  fetch.mockResolvedValueOnce({ ok: true }); // Mock successful upload response

  // Submit the form
  fireEvent.click(screen.getByText(/Submit Document/i));

  // Assert that fetch was called for upload
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/upload',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );

    // Check that the FormData contains the file and title
    const formData = fetch.mock.calls[1][1].body; // Get the FormData sent
    expect(formData.get('file')).toBeInstanceOf(File);
    expect(formData.get('title')).toBe('My Document'); // Check that the title is correct
  });

  // Assert success alert
  await waitFor(() => {
    expect(screen.getByText(/File uploaded successfully/i)).toBeInTheDocument();
  });

  // Assert that loadDocuments is called after upload
  await waitFor(() => {
    expect(loadDocuments).toHaveBeenCalled(); // Check if loadDocuments was called
  });
});

// working test 3 (WIP)

// it('views the document when the View File button is clicked', async () => {
//   // Arrange: Mock the fetch response for loading documents
//   const mockDocuments = [
//     { id: 1, filename: 'TestDocument1.pdf', content_type: 'application/pdf' },
//     { id: 2, filename: 'TestImage.jpg', content_type: 'image/jpeg' },
//   ];
//   fetch.mockResolvedValueOnce({
//     ok: true,
//     json: async () => mockDocuments,
//   });

//   // Mock the fetch response for viewing a document
//   fetch.mockResolvedValueOnce({
//     ok: true,
//     json: async () => ({
//       dataUrl: 'http://localhost:3000/upload/TestDocument1.pdf',
//       content_type: 'application/pdf',
//     }),
//   });

//   render(<Documents />);

//   // Act: Wait for documents to load
//   await waitFor(() => {
//     expect(screen.getByText(/Available Documents/i)).toBeInTheDocument();
//   });

//   // Simulate clicking the View File button for the first document
//   fireEvent.click(screen.getAllByText(/View File/i)[0]);

//   // Assert: Check if the document viewer is displaying the correct document
//   await waitFor(() => {
//     expect(screen.getByTitle('Document Viewer')).toHaveAttribute(
//       'src',
//       'http://localhost:3000/upload/TestDocument1.pdf'
//     );
//   });
// });

// it('simple test', () => {
//   expect(true).toBe(true);
// });
