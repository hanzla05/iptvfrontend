import React, { useState, useEffect } from 'react';
import './Series.css';
import Sidebar from './Sidebar';

const Seasons = () => {
  const [seasonsData, setSeasonsData] = useState([]);
  const [series, setSeries] = useState([]);
  const [inputs, setInputs] = useState({
    series_id: '',
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchSeries();
    fetchSeasons();
  }, []);

  const fetchSeries = async () => {
    const userToken = localStorage.getItem('userToken');

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/series/", {
        method: "GET",
        headers: new Headers({
          "Authorization": `Bearer ${userToken}` 
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
      setSeasonsData(result);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching seasons: ' + error.message);
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

  const handleAddSeason = async () => {
    setLoading(true);
    setAlertMessage(null);

    const userToken = localStorage.getItem('userToken');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${userToken}`);

    const raw = JSON.stringify({
      series_id: inputs.series_id,
      name: inputs.name,
      description: inputs.description
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch('http://localhost:5000/api/seasons/', requestOptions);
      const result = await response.json();

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Season added successfully!');
        setInputs({ series_id: '', name: '', description: '' });
        fetchSeasons();
      } else {
        setAlertType('error');
        setAlertMessage(result.message || 'Failed to add season');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error adding season: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seasons-page-container">
      <Sidebar />
      {loading && <div className="loader">Loading...</div>}

      {alertMessage && (
        <div className={`alert ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <div className="form-container">
        <select
          name="series_id"
          value={inputs.series_id}
          onChange={handleChange}
        >
          <option value="">Select Series</option>
          {series.map(serie => (
            <option key={serie._id} value={serie._id}>
              {serie.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          placeholder="Season Name"
        />
        <textarea
          name="description"
          value={inputs.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button onClick={handleAddSeason} disabled={loading}>
          {loading ? 'Adding...' : 'Add Season'}
        </button>
      </div>

      <h2>Seasons</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Series Name</th>
            <th>Season Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {seasonsData.map((item) => (
            <tr key={item._id}>
              <td>{series.find(s => s._id === item.series_id)?.name || 'Unknown Series'}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Seasons;
