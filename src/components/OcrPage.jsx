import React, { useState } from 'react';
import { Camera, ArrowLeft, Upload } from 'lucide-react';
import '../styles/OcrPage.css';

const OCRPage = ({ handleFileUpload, handleLogout, setCurrentPage }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setIsProcessing(true);
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setIsProcessing(true);
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="ocrPage">
      <nav className="navbar">
        <div className="navContainer">
          <div className="navBrand">
            <button onClick={() => setCurrentPage('dashboard')} className="navBackButton">
              <ArrowLeft size={20} />
            </button>
            <Camera size={32} color="#8b5cf6" />
            <span className="navTitle">OCR Learning</span>
          </div>
          <button onClick={handleLogout} className="navButton">
            Logout
          </button>
        </div>
      </nav>
      
      <div className="ocrContainer">
        <div className="ocrHeader">
          <h1 className="ocrTitle">Upload Document or Image</h1>
          <p className="ocrSubtitle">Extract text and get AI-powered learning insights</p>
        </div>
        
        {isProcessing ? (
          <div className="ocrProcessing">
            <div className="spinner"></div>
            <h3 className="processingTitle">Processing...</h3>
            <p className="processingText">Extracting text and analyzing content</p>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`uploadArea ${isDragOver ? 'uploadAreaHover' : ''}`}
          >
            <Upload size={64} className="uploadIcon" />
            <h3 className="uploadTitle">Drag & Drop or Click to Upload</h3>
            <p className="uploadDescription">
              Support for images (JPG, PNG) and documents (PDF)
            </p>
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*,.pdf"
              className="hiddenInput"
              id="file-input"
            />
            <label htmlFor="file-input" className="uploadButton">
              Choose File
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRPage;