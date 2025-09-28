<<<<<<< HEAD
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import '../styles/Auth.css';

const LoginPage = ({ setCurrentPage, handleLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <BookOpen size={40} color="#60a5fa" />
          <h2 className="authTitle">Welcome Back</h2>
          <p className="authSubtitle">Sign in to continue learning</p>
        </div>
        
        <div className="authForm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="authInput"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="authInput"
          />
          <button
            onClick={() => handleLogin(email, password)}
            className="authButton"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        
        <div className="authLinks">
          <button
            onClick={() => setCurrentPage('signup')}
            className="authLink"
          >
            Don't have an account? Sign up
          </button>
          <br />
          <button
            onClick={() => setCurrentPage('landing')}
            className="authLink"
            style={{color: '#9ca3af', marginTop: '0.5rem'}}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

=======
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import '../styles/Auth.css';

const LoginPage = ({ setCurrentPage, handleLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <BookOpen size={40} color="#60a5fa" />
          <h2 className="authTitle">Welcome Back</h2>
          <p className="authSubtitle">Sign in to continue learning</p>
        </div>
        
        <div className="authForm">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="authInput"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="authInput"
          />
          <button
            onClick={() => handleLogin(email, password)}
            className="authButton"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        
        <div className="authLinks">
          <button
            onClick={() => setCurrentPage('signup')}
            className="authLink"
          >
            Don't have an account? Sign up
          </button>
          <br />
          <button
            onClick={() => setCurrentPage('landing')}
            className="authLink"
            style={{color: '#9ca3af', marginTop: '0.5rem'}}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

>>>>>>> 29cf1f51f16e8c35beafbeb0622ca49f2f52ec05
export default LoginPage;