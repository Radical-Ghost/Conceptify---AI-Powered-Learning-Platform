import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import '../styles/Auth.css';


const SignupPage = ({ setCurrentPage, handleSignup, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <BookOpen size={40} color="#a78bfa" />
          <h2 className="authTitle">Join Conceptify</h2>
          <p className="authSubtitle">Start your AI-powered learning journey</p>
        </div>
        
        <div className="authForm">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="authInput"
          />
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
            onClick={() => handleSignup(name, email, password)}
            className="authButton"
            style={{backgroundColor: '#8b5cf6'}}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
        
        <div className="authLinks">
          <button
            onClick={() => setCurrentPage('login')}
            className="authLink"
            style={{color: '#a78bfa'}}
          >
            Already have an account? Sign in
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

export default SignupPage;