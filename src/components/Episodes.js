import React, { useState, useEffect } from 'react';
import './Series.css'; // Add your CSS styles here
import Sidebar from './Sidebar';

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [files, setFiles] = useState([]);
  const [inputs, setInputs] = useState({
    season_id: '',
    name: '',
    description: '',
    thumbnail_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchEpisodes();
    fetchSeasons();
    fetchFiles();
  }, []);

  const fetchEpisodes = async () => {
    const userToken = localStorage.getItem('userToken');

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/episodes/", {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${userToken}` 

        }),
        redirect: "follow"
      });
      const result = await response.json();
      setEpisodes(result);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching episodes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasons = async () => {
    const userToken = localStorage.getItem('userToken');

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/seasons/", {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${userToken}` 

        }),
        redirect: "follow"
      });
      const result = await response.json();
      setSeasons(result);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching seasons: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    const userToken = localStorage.getItem('userToken');

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/files/", {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${userToken}` 

        }),
        redirect: "follow"
      });
      const result = await response.json();
      setFiles(result);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleAddEpisode = async () => {
    setLoading(true);
    setAlertMessage(null);

    const userToken = localStorage.getItem('userToken');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${userToken}`);

    const raw = JSON.stringify({
      season_id: inputs.season_id,
      name: inputs.name,
      description: inputs.description,
      thumbnail_id: inputs.thumbnail_id
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch('http://localhost:5000/api/episodes/', requestOptions);
      const result = await response.json();

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Episode added successfully!');
        setInputs({ season_id: '', name: '', description: '', thumbnail_id: '' });
        fetchEpisodes(); 
      } else {
        setAlertType('error');
        setAlertMessage(result.message || 'Failed to add episode');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error adding episode: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="episodes-page-container">
      <Sidebar />
      {loading && <div className="loader">Loading...</div>}

      {alertMessage && (
        <div className={`alert ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <div className="form-container">
        <select
          name="season_id"
          value={inputs.season_id}
          onChange={handleChange}
        >
          <option value="">Select Season</option>
          {seasons.map(season => (
            <option key={season._id} value={season._id}>
              {season.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          placeholder="Episode Name"
        />
        <textarea
          name="description"
          value={inputs.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <select
          name="thumbnail_id"
          value={inputs.thumbnail_id}
          onChange={handleChange}
        >
          <option value="">Select Thumbnail</option>
          {files.map(file => (
            <option key={file._id} value={file._id}>
              {file.original_name}
            </option>
          ))}
        </select>
        <button onClick={handleAddEpisode} disabled={loading}>
          {loading ? 'Adding...' : 'Add Episode'}
        </button>
      </div>

      <div className="episodes-list">
        <h2>Episodes</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Season</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map(episode => (
              <tr key={episode._id}>
                <td>{episode.name}</td>
                <td>{episode.description}</td>
                <td>{seasons.find(season => season._id === episode.season_id)?.name || 'No season available'}</td>
                <td>
                  {episode.thumbnail_id && files.find(file => file._id === episode.thumbnail_id) ? (
                    <img src={files.find(file => file._id === episode.thumbnail_id).url} alt={episode.name} style={{ width: '100px', height: 'auto' }} />
                  ) : (
                    'No thumbnail available'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Episodes;
