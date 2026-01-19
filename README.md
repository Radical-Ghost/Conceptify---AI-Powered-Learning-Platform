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

-   **Intelligent Document Routing** - Automatically detects document type (academic/handwritten/standard)
-   **Native PDF Text Extraction** - High-quality text extraction using PyMuPDF
-   **Image OCR with Tesseract** - Process scanned documents and images
-   **Academic Document OCR with Nougat** - Specialized processing for research papers with LaTeX, equations, and tables
-   **Handwriting Recognition with TrOCR** - Transformer-based handwritten text recognition
-   **AI-Powered Summarization** - Automatic document summarization with dynamic length adjustment
-   **Quality Scoring** - Multi-factor quality assessment (completeness, structure, punctuation)
-   **Key Concept Extraction** - Automatic identification of main topics and concepts (up to 10)
-   **NLTK Text Enhancement** - Spell checking, grammar correction, and cleanup
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

-   **AI-Powered Summarization** - Generates concise summaries with dynamic length based on content
-   **Reading Time Estimation** - Smart analysis of document complexity
-   **Key Concept Extraction** - Automatic identification of up to 10 main concepts
-   **Key Topics Recognition** - Extracts up to 7 primary topics from content
-   **Quality Scoring** - Multi-factor assessment (completeness, structure, punctuation, word length, concepts)
-   **Structured Data Export** - Clean JSON output for further processing

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

-   **Tesseract OCR** - Industry-standard OCR engine for scanned documents
-   **PyMuPDF (Fitz)** - High-quality PDF text extraction
-   **Nougat** - Meta's academic document OCR with LaTeX support
-   **TrOCR** - Microsoft's transformer-based handwriting recognition
-   **LED** - Long document summarization (up to 16k tokens)
-   **BART** - Backup summarization for shorter documents
-   **NLTK** - Natural language processing and text correction
-   **PyTorch with CUDA** - GPU-accelerated AI model inference
-   **OpenCV & Pillow** - Image processing and enhancement
-   **NumPy** - Numerical computing for image analysis

---

## 🚀 Quick Start

### **Prerequisites**

-   **Node.js 18+** - [Download here](https://nodejs.org/)
-   **Python 3.10+** - [Download here](https://python.org/) ⚠️ **Check "Add Python to PATH"**
-   **Git** - [Download here](https://git-scm.com/)

### **Automated Installation (Recommended for Windows)**

```powershell
# 1. Clone the repository
git clone https://github.com/Radical-Ghost/Conceptify.git
cd Conceptify

# 2. Run the automated setup script
.\SETUP_COMPLETE.ps1

# 3. Follow the interactive prompts
# The script will:
#   ✅ Install UV package manager
#   ✅ Create Python virtual environment
#   ✅ Install all Python dependencies
#   ✅ Install all Node.js dependencies
#   ✅ Set up Poppler (for advanced OCR)
#   ✅ Install PyTorch with GPU support
#   ✅ Download NLTK data
#   ✅ Pre-download AI models (optional)
#   ✅ Run installation tests

# Total installation time: 20-30 minutes
# Total download size: 6-8 GB (including AI models)
```

### **Manual Installation**

<details>
<summary>Click to expand manual setup instructions</summary>

#### **1. Clone Repository**

```bash
git clone https://github.com/Radical-Ghost/Conceptify.git
cd Conceptify
```

#### **2. Python Backend Setup**

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

#### **3. Node.js Frontend Setup**

```bash
# Install Node.js dependencies
npm install
```

#### **4. Install System Dependencies**

##### **Windows:**

```bash
# Install Tesseract OCR
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH: C:\Program Files\Tesseract-OCR

# Install Poppler (for advanced OCR)
# Download from: https://github.com/oschwartz10612/poppler-windows/releases
# Extract and add bin folder to PATH

# Verify installations
tesseract --version
```

##### **macOS:**

```bash
# Install Tesseract and Poppler via Homebrew
brew install tesseract poppler

# Verify installations
tesseract --version
```

##### **Linux (Ubuntu/Debian):**

```bash
# Install Tesseract and dependencies
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-eng poppler-utils
sudo apt install python3-opencv

# Verify installation
tesseract --version
```

#### **5. GPU Support (Optional)**

```bash
# Install PyTorch with CUDA support (NVIDIA GPU only)
# Activate virtual environment first
.venv\Scripts\activate

# Install PyTorch with CUDA 12.1
uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Verify GPU
python src/backend/gpu_check.py
```

#### **6. Download NLTK Data**

```bash
# Activate virtual environment
.venv\Scripts\activate

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('words'); nltk.download('averaged_perceptron_tagger'); nltk.download('brown'); nltk.download('stopwords')"
```

</details>

---

## 🚀 Running the Application

### **Quick Start**

```powershell
# Terminal 1 - Start Backend (keep this running)
node src\backend\server.js

# Terminal 2 - Start Frontend (in a new terminal)
npm run dev
```

**Access Application:**
-   **Frontend:** http://localhost:5173
-   **Backend API:** http://localhost:5001

### **Detailed Instructions**

<details>
<summary>Click for detailed startup guide</summary>

#### **1. Start Python Backend:**

```bash
# Activate virtual environment (if not already activated)
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Start the OCR processing server
node src/backend/server.js
```

**Expected output:**
```
Server running on port 5001
Python script path: C:\Projects\Conceptify\src\backend\ocr_wrapper.py
✓ CUDA available: True
✓ GPU: NVIDIA GeForce RTX 3050
```

#### **2. Start React Frontend:**

```bash
# In a new terminal (no need to activate venv)
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### **3. Access Application:**

Open your browser and navigate to:
-   **Frontend:** http://localhost:5173
-   **Backend API:** http://localhost:5001

</details>

### **Production Build**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
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

### **AI Models & Advanced Features**

Conceptify uses advanced AI models for enhanced document processing:

#### **Automatic Setup**
Most models download automatically on first use. The setup script (`SETUP_COMPLETE.ps1`) can pre-download them:

-   **Nougat** (1.5GB) - Academic PDF processing with LaTeX support
-   **TrOCR** (556MB) - Handwriting recognition
-   **LED** (1.6GB) - Long document summarization
-   **BART** (1.6GB) - Backup summarization model

#### **GPU Acceleration**
For NVIDIA GPU users, PyTorch with CUDA 12.1 enables:
-   10-50x faster summarization
-   Real-time document processing
-   Advanced model inference

Check GPU status: `python src/backend/gpu_check.py`

### **Environment Variables**

Create a `.env` file in the root directory (optional):

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

## 🆘 Troubleshooting

### **Installation Issues**

**Setup script fails:**
```powershell
# Try manual installation steps in SETUP_ADVANCED_OCR.md
# Or check individual component installations below
```

**UV installation fails:**
```bash
# Use pip instead of UV
python -m pip install -r requirements.txt
```

### **Runtime Issues**

**Tesseract not found:**

```bash
# Ensure Tesseract is in PATH
tesseract --version

# Windows: Add to PATH or set TESSERACT_CMD in ocr_wrapper.py
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

**Poppler not found (Nougat won't work):**
```bash
# Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases
# Extract and add bin folder to PATH
# Or specify in ocr_wrapper.py: pdf2image.convert_from_path(..., poppler_path=r'C:\path\to\poppler\bin')

# macOS: brew install poppler
# Linux: sudo apt install poppler-utils
```

**GPU not detected:**
```bash
# Verify GPU
python src/backend/gpu_check.py

# Reinstall PyTorch with CUDA
# Activate venv first: .venv\Scripts\activate
uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

**AI models not downloading:**
```bash
# Check internet connection
# Models download automatically on first use
# Or pre-download: python src/backend/test_models.py

# If download fails, try manual download:
# Nougat: https://huggingface.co/facebook/nougat-base
# TrOCR: https://huggingface.co/microsoft/trocr-base-handwritten
# LED: https://huggingface.co/pszemraj/led-large-book-summary
```

**Summarization fails:**
```bash
# Check GPU: python src/backend/gpu_check.py
# Fallback to CPU (slower): The system automatically uses extractive summarization
# Test: python src/backend/test_summarization.py
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

## 📚 Documentation

-   **[SETUP_COMPLETE.ps1](SETUP_COMPLETE.ps1)** - Automated installation script
-   **[SETUP_ADVANCED_OCR.md](SETUP_ADVANCED_OCR.md)** - Detailed setup guide with troubleshooting
-   **[QUICKSTART_OCR.md](QUICKSTART_OCR.md)** - Quick reference for OCR features
-   **[DISTRIBUTION_GUIDE.md](DISTRIBUTION_GUIDE.md)** - How to share project with teammates

---

<div align="center">

[⭐ Star this repo](https://github.com/Radical-Ghost/Conceptify) • [Report Bug](https://github.com/Radical-Ghost/Conceptify/issues) • [Request Feature](https://github.com/Radical-Ghost/Conceptify/issues)

</div>
