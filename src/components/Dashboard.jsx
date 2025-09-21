import React from 'react';
import { BookOpen, MessageSquare, Camera } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = ({ user, handleLogout, setCurrentPage, isLoading }) => (
  <div className="dashboard">
    <nav className="navbar">
      <div className="navContainer">
        <div className="navBrand">
          <BookOpen size={32} color="#2563eb" />
          <span className="navTitle">Conceptify</span>
        </div>
        <div className="navUser">
          <span style={{color: '#374151'}}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="navButton" disabled={isLoading}>
            {isLoading ? 'Logging Out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
    
    <div className="dashboardContent">
      <h1 className="dashboardTitle">Learning Dashboard</h1>
      
      <div className="dashboardGrid">
        <div
          onClick={() => !isLoading && setCurrentPage('chatbot')}
          className={`dashboardCard dashboardCardBlue ${isLoading ? 'disabled' : ''}`}
        >
          <div className="cardHeader">
            <MessageSquare size={48} color="#3b82f6" className="cardIcon" />
            <div>
              <h3 className="cardTitle">AI Learning Chat</h3>
              <p className="cardSubtitle">Interactive conversations with your AI tutor</p>
            </div>
          </div>
          <p className="cardDescription">
            Start learning through natural conversations. Ask questions, explore concepts, and get personalized explanations.
          </p>
        </div>
        
        <div
          onClick={() => !isLoading && setCurrentPage('ocr')}
          className={`dashboardCard dashboardCardPurple ${isLoading ? 'disabled' : ''}`}
        >
          <div className="cardHeader">
            <Camera size={48} color="#8b5cf6" className="cardIcon" />
            <div>
              <h3 className="cardTitle">OCR Learning</h3>
              <p className="cardSubtitle">Extract and learn from documents and images</p>
            </div>
          </div>
          <p className="cardDescription">
            Upload images or documents to extract text and get AI-powered explanations and concept breakdowns.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;