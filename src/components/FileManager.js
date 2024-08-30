import React, { useState, useEffect } from 'react';
import './FileManager.css';
import Sidebar from './Sidebar';

const FileManager = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    const userToken = localStorage.getItem('userToken');

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/files/', {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      setFiles(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    const userToken = localStorage.getItem('userToken');

    try {
      const response = await fetch('http://localhost:5000/api/files/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        alert('File uploaded successfully');
        setFile(null);
        fetchFiles(); 
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="file-manager">
      <Sidebar/>
      <div className="upload-section">
        <h2>Upload File</h2>
        <input
          type="file"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} className="upload-btn">
          Upload
        </button>
      </div>

      <div className="files-list">
        <h2>Uploaded Files</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ul>
            {files.map(file => (
              <li key={file._id}>
                <img
                  src={file?.path}
                  alt={file.original_name}
                  className="file-thumbnail"
                />
                <div className="file-info">
                  <p><strong>Original Name:</strong> {file.original_name}</p>
                  <p><strong>Type:</strong> {file.type}</p>
                  <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileManager;
