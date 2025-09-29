import React from 'react';
import { MessageSquare, Clock, Trash2 } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = ({ user, handleLogout, setCurrentPage, chatMessages }) => {
  // Sample chat history data
  const chatHistory = [
    {
      id: 1,
      title: 'Machine Learning Concepts',
      lastMessage: 'Can you explain neural networks?',
      timestamp: '2 hours ago',
      messageCount: 12
    },
    {
      id: 2,
      title: 'Physics Discussion',
      lastMessage: 'What is quantum entanglement?',
      timestamp: '1 day ago',
      messageCount: 8
    },
    {
      id: 3,
      title: 'Math Help',
      lastMessage: 'Help with calculus problems',
      timestamp: '3 days ago',
      messageCount: 15
    }
  ];

  const recentChats = chatMessages.length > 0 ? [{
    id: 0,
    title: 'Current Session',
    lastMessage: chatMessages[chatMessages.length - 1]?.text || 'Start a new conversation',
    timestamp: 'Just now',
    messageCount: chatMessages.length
  }, ...chatHistory] : chatHistory;

  return (
    <div className="dashboardContent">
      <div className="dashboardHeader">
        <h1 className="dashboardTitle">Learning Dashboard</h1>
        <p className="dashboardSubtitle">Your recent learning activities and chat history</p>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statIcon" style={{ backgroundColor: '#eff6ff' }}>
            <MessageSquare size={24} color="#3b82f6" />
          </div>
          <div className="statInfo">
            <span className="statNumber">{recentChats.length}</span>
            <span className="statLabel">Total Chats</span>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon" style={{ backgroundColor: '#f0fdf4' }}>
            <Clock size={24} color="#10b981" />
          </div>
          <div className="statInfo">
            <span className="statNumber">
              {recentChats.reduce((total, chat) => total + chat.messageCount, 0)}
            </span>
            <span className="statLabel">Total Messages</span>
          </div>
        </div>
      </div>

      <div className="chatHistorySection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Recent Chats</h2>
          <button className="clearHistoryButton">
            <Trash2 size={16} />
            Clear History
          </button>
        </div>

        <div className="chatHistoryGrid">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              className="chatHistoryCard"
              onClick={() => chat.id === 0 ? setCurrentPage('chatbot') : null}
            >
              <div className="chatHeader">
                <h3 className="chatTitle">{chat.title}</h3>
                <span className="chatTimestamp">{chat.timestamp}</span>
              </div>
              <p className="chatLastMessage">{chat.lastMessage}</p>
              <div className="chatFooter">
                <span className="messageCount">{chat.messageCount} messages</span>
                <button className="continueChatButton">
                  Continue Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {recentChats.length === 0 && (
        <div className="emptyState">
          <MessageSquare size={64} color="#cbd5e1" />
          <h3>No chat history yet</h3>
          <p>Start a conversation with the AI to see your history here</p>
          <button
            onClick={() => setCurrentPage('chatbot')}
            className="startChatButton"
          >
            Start Your First Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;