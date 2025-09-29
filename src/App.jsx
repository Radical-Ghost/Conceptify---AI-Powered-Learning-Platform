import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ChatbotPage from './components/ChatbotPage';
import OcrPage from './components/OcrPage';
import OCRResultPage from './components/OcrResultPage';
import Sidebar from './components/SideBar';
import Navbar from './components/Navbar';
import { styles } from './styles/styles';
import './styles/MainLayout.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when page changes on mobile
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  }, [currentPage]);

  // Authentication handlers
  const handleLogin = (email, password) => {
    setUser({ email, name: email.split('@')[0] });
    setCurrentPage('dashboard');
  };

  const handleSignup = (name, email, password) => {
    setUser({ email, name });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    setChatMessages([]);
    setOcrResult(null);
    setIsSidebarOpen(false);
  };

  // Chat handlers
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
    setChatMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `I understand you're asking about "${inputMessage}". Let me help you learn this concept step by step. This is a powerful learning topic that we can explore together!`,
        sender: 'ai'
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setInputMessage('');
  };

  // OCR handlers
  const handleFileUpload = (file) => {
    setTimeout(() => {
      setOcrResult({
        originalFileName: file.name,
        extractedText: "This is simulated OCR text extraction. In a real implementation, this would contain the actual text extracted from your uploaded image or document. The AI can now help you understand and learn from this content.",
        concepts: ["Machine Learning", "Data Processing", "Text Analysis"],
        difficulty: "Intermediate"
      });
      setCurrentPage('ocr-result');
    }, 2000);
  };

  // Pages that should show sidebar and navbar
  const pagesWithLayout = ['dashboard', 'chatbot', 'ocr', 'ocr-result', 'settings'];

  // Page Router
  const renderCurrentPage = () => {
    const mainContentClass = isSidebarOpen ? 'mainContentWithSidebar' : 'mainContentFull';
    
    switch (currentPage) {
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} handleLogin={handleLogin} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} handleSignup={handleSignup} />;
      case 'dashboard':
        return (
          <div className={mainContentClass}>
            <Dashboard 
              user={user} 
              handleLogout={handleLogout} 
              setCurrentPage={setCurrentPage} 
              chatMessages={chatMessages} 
            />
          </div>
        );
      case 'chatbot':
        return (
          <div className={mainContentClass}>
            <ChatbotPage 
              chatMessages={chatMessages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              handleLogout={handleLogout}
              setCurrentPage={setCurrentPage}
            />
          </div>
        );
      case 'ocr':
        return (
          <div className={mainContentClass}>
            <OcrPage 
              handleFileUpload={handleFileUpload}
              handleLogout={handleLogout}
              setCurrentPage={setCurrentPage}
            />
          </div>
        );
      case 'ocr-result':
        return (
          <div className={mainContentClass}>
            <OCRResultPage 
              ocrResult={ocrResult}
              setCurrentPage={setCurrentPage}
            />
          </div>
        );
      case 'settings':
        return (
          <div className={mainContentClass}>
            <div className="settingsPage">
              <h1>Settings</h1>
              <p>Settings page content will go here...</p>
            </div>
          </div>
        );
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={styles.container}>
      {user && pagesWithLayout.includes(currentPage) && (
        <>
          <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            user={user} 
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <Navbar 
            user={user}
            handleLogout={handleLogout}
            toggleSidebar={toggleSidebar}
            currentPage={currentPage}
            isSidebarOpen={isSidebarOpen}
          />
        </>
      )}
      {renderCurrentPage()}
    </div>
  );
};

export default App;