import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import '../styles/OcrPage.css';

const OCRPage = ({ handleFileUpload, setCurrentPage }) => {
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
    <div className="ocrPageContent">
      <div className="ocrHeader">
        <div className="headerTitle">
          <Camera size={32} color="#8b5cf6" />
          <h1>Upload Document or Image</h1>
        </div>
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
  );
};

export default OCRPage;