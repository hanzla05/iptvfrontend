import React, { useState, useEffect } from 'react';
import './Series.css'; 
import Sidebar from './Sidebar';

const Series = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [series, setSeries] = useState([]);
  const [inputs, setInputs] = useState({
    name: '',
    description: '',
    trailer_id: '',
    thumbnail_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchThumbnails();
    fetchTrailers();
    fetchSeries()
  }, []);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/series/", {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Yzk4N2U0NTY2YzM5YjI4NTYwMzlkOSIsImlhdCI6MTcyNTAwMzAwMSwiZXhwIjoxNzI1MDA2NjAxfQ.xiHL5iEI4PQ5g7zx7bPWhLsMmRnSSMLzrp5WZpZfDsM"
        }),
        redirect: "follow"
      });
      const result = await response.json();
      setSeries(result);
     
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching series: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchThumbnails = async () => {
    setLoading(true);
    const userToken = localStorage.getItem('userToken');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${userToken}`);
    
    try {
      const response = await fetch('http://localhost:5000/api/files/', { headers: myHeaders });
      const result = await response.json();
      setThumbnails(result);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching thumbnails: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrailers = async () => {
    setLoading(true);
    const userToken = localStorage.getItem('userToken');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${userToken}`);

    try {
      const response = await fetch('http://localhost:5000/api/files/', { headers: myHeaders });
      const result = await response.json();
      setTrailers(result);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching trailers: ' + error.message);
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

  const handleAddSeries = async () => {
    setLoading(true);
    setAlertMessage(null);

    const userToken = localStorage.getItem('userToken');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${userToken}`);

    const raw = JSON.stringify({
      name: inputs.name,
      description: inputs.description,
      trailer_id: inputs.trailer_id,
      thumbnail_id: inputs.thumbnail_id
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch('https://iptv-backend-green.vercel.app/api/series/', requestOptions);
      const result = await response.json();

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Series added successfully!');
        setInputs({ name: '', description: '', trailer_id: '', thumbnail_id: '' });
        fetchSeries()
      } else {
        setAlertType('error');
        setAlertMessage(result.message || 'Failed to add series');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error adding series: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="series-page-container">
        <Sidebar/>
      {loading && <div className="loader">Loading...</div>} 

      {alertMessage && (
        <div className={`alert ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <div className="form-container">
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          placeholder="Series Name"
        />
        <textarea
          name="description"
          value={inputs.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <select
          name="trailer_id"
          value={inputs.trailer_id}
          onChange={handleChange}
        >
          <option value="">Select Trailer</option>
          {trailers.map(trailer => (
            <option key={trailer._id} value={trailer._id}>
              {trailer.original_name}
            </option>
          ))}
        </select>
        <select
          name="thumbnail_id"
          value={inputs.thumbnail_id}
          onChange={handleChange}
        >
          <option value="">Select Thumbnail</option>
          {thumbnails.map(thumbnail => (
            <option key={thumbnail._id} value={thumbnail._id}>
              {thumbnail.original_name}
            </option>
          ))}
        </select>
        <button onClick={handleAddSeries} disabled={loading}>
          {loading ? 'Adding...' : 'Add Series'}
        </button>
      </div>

      <div className="series-list">
      </div>

      <h2>Series</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Trailer</th>
            <th>Thumbnail</th>
          </tr>
        </thead>
        <tbody>
          {series.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                {item.trailer_id && trailers[item.trailer_id] ? (
                  <video width="320" height="240" controls>
                    <source src={trailers[item.trailer_id]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  'No trailer available'
                )}
              </td>
              <td>
                {item.thumbnail_id && thumbnails[item.thumbnail_id] ? (
                  <img src={thumbnails[item.thumbnail_id]} alt={item.name} style={{ width: '100px', height: 'auto' }} />
                ) : (
                  'No thumbnail available'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Series;