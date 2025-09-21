import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import ChatbotPage from './components/ChatbotPage';
import OcrPage from './components/OcrPage';
import OCRResultPage from './components/OcrResultPage';
import { styles } from './styles/styles';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

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

  // Page Router
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} handleLogin={handleLogin} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} handleSignup={handleSignup} />;
      case 'dashboard':
        return <Dashboard user={user} handleLogout={handleLogout} setCurrentPage={setCurrentPage} />;
      case 'chatbot':
        return (
          <ChatbotPage 
            chatMessages={chatMessages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleLogout={handleLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'ocr':
        return (
          <OcrPage 
            handleFileUpload={handleFileUpload}
            handleLogout={handleLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'ocr-result':
        return (
          <OCRResultPage 
            ocrResult={ocrResult}
            handleLogout={handleLogout}
            setCurrentPage={setCurrentPage}
          />
        );
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={styles.container}>
      {renderCurrentPage()}
    </div>
  );
};

export default App;