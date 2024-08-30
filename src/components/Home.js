import React, { useState, useEffect } from 'react';
import './Home.css';
import Sidebar from './Sidebar';

const Home = () => {
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({
    name: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://iptv-backend-green.vercel.app/api/genres");
      const result = await response.json();
      setData(result);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching genres: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenreById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://iptv-backend-green.vercel.app/api/genres/${id}`);
      const result = await response.json();
      setInputs({ name: result.name });
      setEditingId(id);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error fetching genre details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteGenre = async (id) => {
    const userToken = localStorage.getItem('userToken');

    // setLoading(true);
    setAlertMessage(null);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://iptv-backend-green.vercel.app/api/genres/${id}`, requestOptions);

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Genre deleted successfully!');
        setData(data.filter((item) => item._id !== id)); // Update local state
      } else {
        const result = await response.json();
        setAlertType('error');
        setAlertMessage(result.message || 'Failed to delete genre');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error deleting genre: ' + error.message);
    } finally {
      // setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleAddGenre = async () => {
    setLoading(true);
    setAlertMessage(null);
        
    const userToken = localStorage.getItem('userToken');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    const raw = JSON.stringify({
      name: inputs.name
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://iptv-backend-green.vercel.app/api/genres", requestOptions);
      const result = await response.json();
console.log(result,'------')
      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Genre added successfully!');
        setInputs({ name: '' }); // Clear input field
        fetchGenres(); // Refresh genre list
      } else {
        setAlertType('error');
        setAlertMessage(result.message || 'Failed to add genre');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error adding genre: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGenre = async () => {
    setLoading(true);
    setAlertMessage(null);
    const userToken = localStorage.getItem('userToken');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userToken}`);

    const raw = JSON.stringify({
      name: inputs.name
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://iptv-backend-green.vercel.app/api/genres/${editingId}`, requestOptions);
      const result = await response.json();

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Genre updated successfully!');
        setInputs({ name: '' });
        setEditingId(null); 
        fetchGenres(); 
      } else {
        setAlertType('error');
        setAlertMessage(result.message || 'Failed to update genre');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error updating genre: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <Sidebar />

      {/* <button className="view-genre-btn" onClick={fetchGenres}>
        View Genre Weights
      </button> */}

      {loading && <div className="loader">Loading...</div>} {/* Show loader */}

      {alertMessage && (
        <div className={`alert ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Add Genre</th>
          </tr>
          <tr>
            <th>
            <input
  type="text"
  name="name"
  value={inputs.name}

  onChange={handleChange}
  placeholder="Enter Genre"
  style={{ borderWidth: '0', backgroundColor: 'transparent',height:30,paddingLeft:10 }}
/>

            </th>
            <th>
              {editingId ? (
            

<button
onClick={handleUpdateGenre}
disabled={loading}
style={{
  height: '40px',          
  width: '120px',         
  backgroundColor: '#003b72', 
  color: 'white',         
  border: 'none',          
  borderRadius: '4px',     
  cursor: loading ? 'not-allowed' : 'pointer', 
  fontSize: '16px',         
  fontWeight: 'bold',   
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s',
  
}}
>
{loading ? 'Updating...' : 'Update'}

</button>
              ) : (
                <button
                onClick={handleAddGenre}
                disabled={loading}
                style={{
                  height: '40px',          
                  width: '120px',          
                  backgroundColor: '#003b72', 
                  color: 'white',       
                  border: 'none',        
                  borderRadius: '4px',  
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  fontSize: '16px',     
                  fontWeight: 'bold',     
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.3s',
                  
                }}
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
              
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
  <span className="action-button edit-button" onClick={() => fetchGenreById(item._id)}>
    Edit
  </span>
  <span className="action-button delete-button" onClick={() => handleDeleteGenre(item._id)}>
    Delete
  </span>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
