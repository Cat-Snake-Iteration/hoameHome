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
  const [isUploaded, setIsUploaded] = useState(false); // to store file upload successful
  const [contentType, setContentType] = useState(''); // to store content type/headers

  // function for file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // get chosen file
  };

  // function for upload to server
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      // check file and title
      alert('Please select a file first!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    // send file to server (replace URL with the endpoint later)
    try {
      console.log('Ready to upload:', file, title);
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      // check response and reset
      if (response.ok) {
        setIsUploaded(false);
        alert('File uploaded successfully');
        setTitle(''); // reset title input
        setFile(null); // reset file input
        setSelectDoc(''); // reset to avoid old docs
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
      setDocuments(docs);
      // console.log('docs :>> ', docs);
    } catch (error) {
      console.error('error fetching documents', error);
    }
  };

  // function to open a documment in new tab
  // when the View Doc button is clicked
  const viewDocuments = async (filename) => {
    // console.log('CLICKED VIEW DOCS', filename);

    // window.open(`http://localhost:3000/upload/${encodeURIComponent(filename)}`, '_blank');
    const response = await fetch(`http://localhost:3000/api/file/${filename}`);
    const data = await response.json();
    console.log('sile data',data);
    setSelectDoc(data.dataUrl); // update state
    setContentType(data.content_type);
    // console.log('doc in documents ', doc);
  };

  // function to delet documents by id
  const deleteDocument = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/documents/${id}`, {
        method: 'DELETE',
      });
    
    if(response.ok) {
      setDocuments(documents.filter((doc) => doc.id !== id));
      alert('Documents delete successful');
    } else {
        console.error('failed to delete document');
      }
    } catch (error) {
      console.error('Error to delete document', error);
    }
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
          <label htmlFor="title">Title:</label>
          <input
            type='text'
            value={title}
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="file">Upload File:</label>
          <input
            type='file'
             id="file"
            onChange={handleFileChange}
            accept='application/*, image/*'
            required
          />
        </div>

        <button type='submit'>Submit Document</button>
      </form>

      {/* display upload success message */}
      {isUploaded && <p>Upload Success! Go to Documents to view downloads.</p>}

      {/* list of documents  with view/delete buttons*/}
      <div>
        <h3>Available Documents</h3>
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <div key={index} className='documentCard'>
              <p>File Name: {doc.filename}</p>
              <p>Type: {doc.content_type}</p>
              <button onClick={() => viewDocuments(doc.filename)} className='viewButton'> 
              View File
              </button>
              <button onClick={() => deleteDocument(doc.id)} className='deleteButton'> 
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No Documents Available</p>
        )}
        {/* rendering based on content type */}
        {selectDoc &&
          (contentType.startsWith('image/') ? (
            <img 
            src={selectDoc} 
            alt='Document'
            style = {{
              width :'100%',
              maxHeight : '80vh',
              objectFit : 'contain',
            }}
            />
          ) : (
            <iframe
              src={selectDoc.dataUrl}
              title = "Document Viewer"
              style = {{
              width :'100%',
              height :'80vh',
              border: 'none',
            }}
            />
          ))}
      </div>

      {/* viewer for selected document */}
      {selectDoc && (
        <div className='documentViewer'>
          <iframe
            src={selectDoc.dataUrl}
            title='Document Viewer'
            style={{ 
              width :'100%',
              height :'80vh',
              border: 'none',
             }}
          />
            Your browser does not support iframes.
        </div>
      )}
    </div>
  );
};

export default Documents;
