import { use } from 'bcrypt/promises';
import React, { useState, useEffect } from 'react';

/*
  Allow users to upload, view , and list documents in db
*/
const Documents = () => {
  // state variables
  const [documents, setDocuments] = useState([]); // state for documents from SQL
  const [file, setFile] = useState(null); // state for file
  const [selectDoc, setSelectDoc] = useState(null); // state for selected document
  const [title, setTitle] = useState(''); // to store title of the bid (ex: pothole)
  const [isUploaded, setIsUploaded] = useState(false);  // to store file upload successful


  // function for file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // get chosen file
  };

  // function for upload to server
  const handleUpload = async () => {
    if (!file || !title) { // check file and title
      alert('Please select a file first!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    // send file to server (replace URL with the endpoint later)
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      // check resonse
      if (response.ok) {
        setIsUploaded(true);
        alert('File uploaded successfully');
        setTitle(''); // reset title input
        setFile(null); // reset file input
        loadDocuments(); // refresh document list after upload
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('error uploading files', error);
      alert('Error uploading file');
    }
  };
  
  // function to load documents from the db
  const loadDocuments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/getDocs');
      const docs = await response.json();
      setDocuments(docs); // update state
    } catch (error) {
      console.error('error fetching documents', error);
    }
  };

  // function to open a documment in new tab
  // when the View Doc button is clicked
  const viewDocuments = async (filename) => {
    console.log('CLICKED VIEW DOCS', filename);
    
    // window.open(`http://localhost:3000/upload/${encodeURIComponent(filename)}`, '_blank');
    setSelectDoc(`http://localhost:3000/file/${filename}`);
  };

  // useEffect hook to load documents when first rneder
  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div>
      <h2>Documents</h2>

      {/* form to upload a document */}
      <form onSubmit={handleUpload}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Upload File:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/*, image/*"
            required
          />
        </div>

        <button type="submit">Submit Document</button>
      </form>

      {/* display upload success message */}
      {isUploaded && <p>Upload Success! Go to Documents to view downloads.</p>}

      {/* list of documents */}
      <div>
        <h3>Available Documents</h3>
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <div key={index} className="documentCard">
              <p>File Name: {doc.filename}</p>
              <p>Type: {doc.type}</p>
              <button
                onClick={() => viewDocument(doc.filename)}
                className="viewButton"
              >
                View File
              </button>
            </div>
          ))
        ) : (
          <p>No Documents Available</p>
        )}
      </div>

      {/* viewer for selected document */}
      {selectDoc && (
        <div className="documentViewer">
          <iframe
            src={selectDoc}
            title="Document Viewer"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          >
            Your browser does not support iframes.
          </iframe>
        </div>
      )}
    </div>
  );
};

export default Documents;
