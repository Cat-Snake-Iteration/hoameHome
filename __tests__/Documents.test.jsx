import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Documents from '../client/components/Documents.jsx';
import '@testing-library/jest-dom';
// import { jest } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';

global.fetch = jest.fn();

beforeEach(() => {
  fetchMock.resetMocks();
});


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
it('submits file and title, then displays the document', async () => {
  
  // Mock response for fetching documents after upload
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        id: 1,
        filename: 'testfile.pdf',
        content_type: 'application/pdf',
      },
    ],
  });

  render(<Documents />);

  // Mock file input
  const file = new File(['dummy content'], 'testfile.pdf', { type: 'application/pdf' });
  const fileInput = screen.getByLabelText(/upload file/i);
  const titleInput = screen.getByLabelText(/title/i);
  const submitButton = screen.getByRole('button', { name: /submit document/i });

  // Simulate filling out the form
  fireEvent.change(titleInput, { target: { value: 'Test Title' } });
  fireEvent.change(fileInput, { target: { files: [file] } });
  fireEvent.click(submitButton);

  // Assert that fetch was called with the correct URL for loading documents
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/getDocs');
  });

  // expect(screen.getByText(/Upload Success! Go to Documents to view downloads./i)).toBeInTheDocument();

});

  // Assert that loadDocuments is called after upload
  
// working test 3 (WIP)

it('views the document when the View File button is clicked', async () => {
  // Arrange: Mock the fetch response for loading documents
  const mockDocuments = [
    { id: 1, filename: 'TestDocument1.pdf', content_type: 'application/pdf' },
    { id: 2, filename: 'TestImage.jpg', content_type: 'image/jpeg' },
  ];

  // Mock fetch response for loading documents
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockDocuments,
  });

  // Mock fetch response for viewing a document
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      dataUrl: 'http://localhost:3000/upload/TestDocument1.pdf',
      content_type: 'application/pdf',
    }),
  });

  render(<Documents />);

  // Act: Wait for documents to load
  await waitFor(() => {
    expect(screen.getByText(/Available Documents/i)).toBeInTheDocument();
  });

  // Simulate clicking the View File button for the first document
  fireEvent.click(screen.getAllByText(/View File/i)[0]);

  // Assert: Check if the correct iframe is displaying the document
  await waitFor(() => {
    const iframes = screen.getAllByTitle('Document Viewer'); // Get all iframes with the title
    expect(iframes).toHaveLength(2); // Ensure there are two iframes
    expect(iframes[0]).toHaveAttribute('src', 'http://localhost:3000/upload/TestDocument1.pdf'); // Check the src attribute of the first iframe
  });
});

it('simple test', () => {
  expect(true).toBe(true);
});
