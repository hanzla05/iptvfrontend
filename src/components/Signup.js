import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setAlertMessage(null);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "password": password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://iptv-backend-green.vercel.app/api/auth/register", requestOptions);
      const result = await response.json();
      
      if (response.ok) {
        localStorage.setItem('userToken', result.token);
        setAlertType('success');
        setAlertMessage('Sign up successful! Redirecting...');
        setTimeout(() => {
          navigate('/genre');
        }, 2000);
      } else {
        setAlertType('error');
        setAlertMessage(result.error || 'Sign up failed');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error during sign up: ' + error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up for an Account</h2>
        {alertMessage && (
          <div className={`alert ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSignUp}>
          <div className="input-group">
            <FaUser className="icon" />
            <input 
              type="text" 
              placeholder="First name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <FaUser className="icon" />
            <input 
              type="text" 
              placeholder="Last name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required 
            />
          </div>

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
          <p className="password-info">Your password must have at least 8 characters</p>
          <div className="checkbox-group">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              By creating an account, you agree to the <a href="#">Terms & Conditions</a> and our <a href="#">Privacy Policy</a>.
            </label>
          </div>
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        {/* <div className="social-signup">
          <p>Or sign up with</p>
          <button className="social-button"><FaGoogle /> Google</button>
          <button className="social-button"><FaFacebook /> Facebook</button>
        </div> */}
        <p className="login-link">
          Already have an account? <Link to="/signin">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
