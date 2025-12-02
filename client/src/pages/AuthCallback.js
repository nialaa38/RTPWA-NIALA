import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AuthCallback.css';

function AuthCallback({ setAuth }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.id,
          username: payload.username,
          email: payload.email
        };
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      setAuth(true);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [searchParams, setAuth, navigate]);

  return (
    <div className="auth-callback-page">
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="callback-content">
        <div className="loader-ring"></div>
        <h2>Authenticating...</h2>
        <p>Please wait while we sign you in</p>
      </div>
    </div>
  );
}

export default AuthCallback;
