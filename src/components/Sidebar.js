// Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    navigate('/signin');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img 
          style={{ borderRadius: 10, marginRight: 70, height: 120, width: 120 }} 
          src="https://static.vecteezy.com/system/resources/previews/008/714/280/non_2x/cartoon-rabbit-holding-carrot-mascot-logo-design-vector.jpg" 
          alt="Logo" 
        />
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/genre" activeClassName="active">
            Genre
          </NavLink>
        </li>
        <li>
          <NavLink to="/series" activeClassName="active">
            Series
          </NavLink>
        </li>
        <li>
          <NavLink to="/seasons" activeClassName="active">
            Seasons
          </NavLink>
        </li>
        <li>
          <NavLink to="/episodes" activeClassName="active">
            Episodes
          </NavLink>
        </li>
        <li>
          <NavLink to="/thumnails" activeClassName="active">
            Upload thumnails
          </NavLink>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
