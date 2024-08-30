import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import './Auth.css'; 
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setAlertMessage(null);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email,
      password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://iptv-backend-green.vercel.app/api/auth/login", requestOptions);
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', result.token);
        setAlertType('success');
        setAlertMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/genre'); 
        }, 2000);
      } else {
        setAlertType('error');
        setAlertMessage(result.error || 'Login failed');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error during login: ' + error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In to your Account</h2>
        <p>Welcome back! Please enter your details.</p>
        {alertMessage && (
          <div className={`alert ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSignIn}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
            {/* <a href="#" className="forgot-password">Forgot Password?</a> */}
          </div>
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
  
        <p className="login-link">
          Don't have an account? <Link to="/">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
