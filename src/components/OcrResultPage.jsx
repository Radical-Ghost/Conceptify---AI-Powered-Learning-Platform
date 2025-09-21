import React from 'react';
import { Eye, ArrowLeft, MessageSquare, Upload } from 'lucide-react';
import '../styles/OcrResultPage.css';

const OCRResultPage = ({ ocrResult, handleLogout, setCurrentPage }) => (
  <div className="ocrResultPage">
    <nav className="navbar">
      <div className="navContainer">
        <div className="navBrand">
          <button onClick={() => setCurrentPage('ocr')} className="navBackButton">
            <ArrowLeft size={20} />
          </button>
          <Eye size={32} color="#10b981" />
          <span className="navTitle">OCR Results</span>
        </div>
        <button onClick={handleLogout} className="navButton">
          Logout
        </button>
      </div>
    </nav>
    
    <div className="ocrResultContainer">
      <div className="ocrResultGrid">
        <div className="resultCard">
          <h2 className="resultTitle">Extracted Text</h2>
          <div className="extractedText">
            <p>{ocrResult?.extractedText}</p>
          </div>
        </div>
        
        <div>
          <div className="resultCard" style={{marginBottom: '1.5rem'}}>
            <h2 className="resultTitle">AI Analysis</h2>
            <div className="analysisSection">
              <h3 className="sectionTitle">Key Concepts Identified:</h3>
              <div className="conceptTags">
                {ocrResult?.concepts.map((concept, index) => (
                  <span key={index} className="conceptTag">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
            <div className="analysisSection">
              <h3 className="sectionTitle">Difficulty Level:</h3>
              <span className="difficultyTag">
                {ocrResult?.difficulty}
              </span>
            </div>
          </div>
          
          <div className="actionCard">
            <h2 className="resultTitle">Learning Actions</h2>
            <button
              onClick={() => setCurrentPage('chatbot')}
              className="actionButton actionButtonBlue"
            >
              <div className="actionContent">
                <MessageSquare size={20} color="#2563eb" className="actionIcon" />
                <div>
                  <div className="actionTitle">Discuss with AI</div>
                  <div className="actionDescription">Ask questions about this content</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setCurrentPage('ocr')}
              className="actionButton actionButtonGreen"
            >
              <div className="actionContent">
                <Upload size={20} color="#059669" className="actionIcon" />
                <div>
                  <div className="actionTitle">Upload Another Document</div>
                  <div className="actionDescription">Process more learning materials</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OCRResultPage;