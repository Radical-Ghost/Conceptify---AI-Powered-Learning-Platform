# Conceptify – AI-Powered Learning Platform

<div align="center">

![Conceptify Logo](src/assets/logo.png)

**Transform your learning experience with AI-powered document processing and intelligent tutoring**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

### **Advanced OCR Processing**

-   **Native PDF Text Extraction** - High-quality text extraction using PyMuPDF
-   **Image OCR with Tesseract** - Process scanned documents and images
-   **NLTK Text Enhancement** - Spell checking, grammar correction, and cleanup
-   **AI Content Analysis** - Automatic concept extraction and difficulty assessment
-   **Real-time Editing** - Edit and save OCR results with instant feedback

### **Intelligent AI Chatbot**

-   **Document-Aware Responses** - Context-aware answers based on uploaded materials
-   **Topic Recognition** - Automatic identification of key concepts and subjects
-   **Interactive Learning** - Ask questions about your study materials
-   **Smart Context Switching** - Seamless transitions between different documents

### **Robust Session Management**

-   **Server Health Validation** - Automatic session verification and cleanup
-   **Auto-Recovery** - Handles server restarts and connection issues gracefully
-   **Responsive Design** - Works seamlessly across devices
-   **Professional UI/UX** - Clean, modern interface with loading states

### **Content Analytics**

-   **Reading Time Estimation** - Smart analysis of document complexity
-   **Concept Extraction** - Automatic identification of key topics
-   **Structured Data Export** - Clean JSON output for further processing
-   **Confidence Scoring** - Quality assessment of OCR results

---

## 🛠️ Tech Stack

### **Frontend**

-   **React 18.3.1** - Modern UI framework with hooks and context
-   **CSS3** - Custom styling with responsive design
-   **Vite** - Fast development and build tool
-   **Lucide React** - Beautiful icon library

### **Backend**

-   **Node.js & Express** - RESTful API server
-   **Python 3.10+** - OCR processing and AI analysis
-   **UV Package Manager** - Fast Python dependency management

### **AI & Processing**

-   **Tesseract OCR** - Industry-standard OCR engine
-   **PyMuPDF (Fitz)** - PDF text extraction and processing
-   **NLTK** - Natural language processing and text correction
-   **OpenCV & Pillow** - Image processing and enhancement
-   **NumPy** - Numerical computing for image analysis

---

## � Quick Start

### **Prerequisites**

-   **Node.js 18+** - [Download here](https://nodejs.org/)
-   **Python 3.10+** - [Download here](https://python.org/)
-   **Git** - [Download here](https://git-scm.com/)

### **1. Clone Repository**

```bash
git clone https://github.com/Radical-Ghost/Conceptify---AI-Powered-Learning-Platform.git
cd "Conceptify - AI-Powered Learning Platform"
```

### **2. Python Backend Setup**

```bash
# Install UV package manager (if not installed)
winget install --id astral-sh.uv

# Create virtual environment
uv venv -p 3.10

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
uv sync
```

### **3. Node.js Frontend Setup**

```bash
# Install Node.js dependencies
npm install

# Install additional dependencies if needed
npm install lucide-react
```

### **4. Install System Dependencies**

#### **Windows:**

```bash
# Install Tesseract OCR
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH: C:\Program Files\Tesseract-OCR

# Verify installation
tesseract --version
```

#### **macOS:**

```bash
# Install Tesseract via Homebrew
brew install tesseract

# Verify installation
tesseract --version
```

#### **Linux (Ubuntu/Debian):**

```bash
# Install Tesseract and dependencies
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-eng
sudo apt install python3-opencv

# Verify installation
tesseract --version
```

---

## 🚀 Running the Application

### **Development Mode**

1. **Start Python Backend:**

```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Start the OCR processing server
cd src/backend
node server.js
```

2. **Start React Frontend:**

```bash
# In a new terminal
npm run dev
```

3. **Access Application:**

-   **Frontend:** http://localhost:5173
-   **Backend API:** http://localhost:5001

### **Production Build**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## � Project Structure

```
Conceptify - AI-Powered Learning Platform/
├── src/
│   ├── components/          # React components
│   │   ├── ChatbotPage.jsx     # AI chat interface
│   │   ├── OcrPage.jsx         # Document upload
│   │   ├── OcrResultPage.jsx   # Results & editing
│   │   └── ...
│   ├── styles/              # CSS stylesheets
│   ├── backend/             # Server & OCR processing
│   │   ├── server.js           # Express API server
│   │   ├── ocr_wrapper.py      # Python OCR pipeline
│   │   └── data/            # Processed documents
│   └── assets/              # Images & static files
├── OCR/                     # Jupyter notebooks
├── models/                  # AI models (future)
├── package.json             # Node.js dependencies
├── pyproject.toml           # Python dependencies
└── README.md                # This file
```

---

## 🎯 Usage Guide

### **1. Upload Documents**

-   Drag & drop PDF files or images
-   Supports: `.pdf`, `.jpg`, `.jpeg`, `.png`, `.bmp`, `.tiff`
-   Real-time processing with progress indicators

### **2. Review OCR Results**

-   **Final Extracted Text** - Clean, editable main result
-   **Enhanced Text (NLTK)** - Spell-corrected version
-   **Original OCR Output** - Raw OCR engine output
-   Edit and save changes with instant feedback

### **3. AI Chat Integration**

-   Upload documents to provide context to the AI
-   Ask questions about your study materials
-   Get intelligent, document-aware responses
-   Context indicator shows loaded topics

### **4. Session Management**

-   Automatic login persistence
-   Server health validation
-   Graceful error handling and recovery

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# OCR Settings
TESSERACT_PATH=/usr/bin/tesseract  # Adjust for your system
MAX_FILE_SIZE=10MB

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### **Python Dependencies**

Key packages (automatically installed with `uv sync`):

-   `opencv-python` - Image processing
-   `pytesseract` - OCR engine interface
-   `pymupdf` - PDF processing
-   `nltk` - Natural language processing
-   `pillow` - Image manipulation
-   `numpy` - Numerical computing

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Troubleshooting

### **Common Issues:**

**Tesseract not found:**

```bash
# Ensure Tesseract is in PATH
tesseract --version

# Windows: Add to PATH or set TESSERACT_CMD in ocr_wrapper.py
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

**Python dependencies fail:**

```bash
# Ensure Python 3.10+ is installed
python --version

# Clear cache and reinstall
uv cache clean
uv sync --reinstall
```

**Port conflicts:**

```bash
# Check if ports are in use
netstat -an | grep :5001  # Backend
netstat -an | grep :5173  # Frontend

# Kill processes if needed
npx kill-port 5001 5173
```

---

## 🚀 Future Roadmap

-   [ ] **React Router Integration** - Full routing system
-   [ ] **Advanced AI Models** - Integration with Hugging Face transformers
-   [ ] **Analytics Dashboard** - Learning progress tracking
-   [ ] **Quiz Generation** - Adaptive question generation
-   [ ] **Database Integration** - MongoDB/Firebase storage
-   [ ] **Multi-user Support** - User accounts and sharing
-   [ ] **Mobile App** - React Native implementation

---

<div align="center">

**Made with ❤️ by the Conceptify Team**

[⭐ Star this repo](https://github.com/Radical-Ghost/Conceptify---AI-Powered-Learning-Platform) • [Report Bug](https://github.com/Radical-Ghost/Conceptify---AI-Powered-Learning-Platform/issues) • [Request Feature](https://github.com/Radical-Ghost/Conceptify---AI-Powered-Learning-Platform/issues)

</div>
