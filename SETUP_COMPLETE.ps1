# =============================================================================
# Conceptify - Complete Setup Script for Team Members
# =============================================================================
# This script will install everything needed to run Conceptify from scratch
# Run this after extracting the project files
# =============================================================================

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "║         CONCEPTIFY - AI LEARNING PLATFORM SETUP          ║" -ForegroundColor Cyan
Write-Host "║                                                           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# Step 0: Prerequisites Check
# =============================================================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 0: Checking Prerequisites" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

# Check Node.js
Write-Host "🔍 Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = & node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js 18+ from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Python
Write-Host "🔍 Checking Python..." -ForegroundColor Cyan
$pythonVersion = & python --version 2>$null
if ($pythonVersion -and $pythonVersion -match "3\.(10|11|12)") {
    Write-Host "   ✅ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Python 3.10+ not found!" -ForegroundColor Red
    Write-Host "   Please install Python 3.10+ from: https://python.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ All prerequisites met!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue"

# =============================================================================
# Step 1: Install UV Package Manager
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 1: Installing UV Package Manager" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "UV is a fast Python package manager (replaces pip)" -ForegroundColor Gray
Write-Host ""

$installUV = Read-Host "Install UV package manager? (Y/N)"
if ($installUV -eq 'Y' -or $installUV -eq 'y') {
    Write-Host "📥 Installing UV..." -ForegroundColor Cyan
    & winget install --id astral-sh.uv -e
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ UV installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  UV installation had issues, but continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping UV installation" -ForegroundColor Yellow
}

# =============================================================================
# Step 2: Create Python Virtual Environment
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 2: Creating Python Virtual Environment" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "This creates an isolated Python environment for the project" -ForegroundColor Gray
Write-Host ""

$createVenv = Read-Host "Create virtual environment? (Y/N)"
if ($createVenv -eq 'Y' -or $createVenv -eq 'y') {
    Write-Host "📦 Creating virtual environment (.venv)..." -ForegroundColor Cyan
    & uv venv -p 3.10
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Virtual environment created!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping virtual environment creation" -ForegroundColor Yellow
}

# =============================================================================
# Step 3: Install Python Dependencies
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 3: Installing Python Dependencies" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "This installs required Python packages (~1GB download)" -ForegroundColor Gray
Write-Host ""

$installPython = Read-Host "Install Python dependencies? (Y/N)"
if ($installPython -eq 'Y' -or $installPython -eq 'y') {
    Write-Host "📥 Installing Python packages..." -ForegroundColor Cyan
    Write-Host "   This may take 5-10 minutes..." -ForegroundColor Gray
    Write-Host ""
    & uv sync
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python dependencies installed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping Python dependencies" -ForegroundColor Yellow
}

# =============================================================================
# Step 4: Install Node.js Dependencies
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 4: Installing Node.js Dependencies" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "This installs frontend dependencies (~200MB)" -ForegroundColor Gray
Write-Host ""

$installNode = Read-Host "Install Node.js dependencies? (Y/N)"
if ($installNode -eq 'Y' -or $installNode -eq 'y') {
    Write-Host "📥 Installing npm packages..." -ForegroundColor Cyan
    Write-Host "   This may take 3-5 minutes..." -ForegroundColor Gray
    Write-Host ""
    & npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node dependencies installed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Node dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️  Skipping Node dependencies" -ForegroundColor Yellow
}

# =============================================================================
# Step 5: Install Poppler (PDF Processing)
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 5: Install Poppler (PDF Processing)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "Poppler is required for Nougat (academic PDF processing)" -ForegroundColor Gray
Write-Host "Download: https://github.com/oschwartz10612/poppler-windows/releases/" -ForegroundColor Gray
Write-Host ""

$installPoppler = Read-Host "Do you want to install Poppler? (Y/N)"
if ($installPoppler -eq 'Y' -or $installPoppler -eq 'y') {
    Write-Host ""
    Write-Host "📥 Installing Poppler..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
    Write-Host "1. Download Poppler from: https://github.com/oschwartz10612/poppler-windows/releases/" -ForegroundColor White
    Write-Host "2. Extract to C:\Coding\poppler-25.12.0\" -ForegroundColor White
    Write-Host "3. Add to PATH: C:\Coding\poppler-25.12.0\Library\bin" -ForegroundColor White
    Write-Host ""
    Write-Host "To add to PATH:" -ForegroundColor Yellow
    Write-Host "  1. Search 'Environment Variables' in Windows" -ForegroundColor White
    Write-Host "  2. Edit System 'Path' variable" -ForegroundColor White
    Write-Host "  3. Add: C:\Coding\poppler-25.12.0\Library\bin" -ForegroundColor White
    Write-Host "  4. Restart PowerShell" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter after you've installed Poppler"
} else {
    Write-Host "⚠️  Skipping Poppler (Nougat won't work)" -ForegroundColor Yellow
}

# =============================================================================
# Step 6: Install PyTorch with GPU Support
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 6: Install PyTorch with GPU Support" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "GPU support enables 5-10x faster AI processing" -ForegroundColor Gray
Write-Host "Download size: ~2.5GB" -ForegroundColor Gray
Write-Host ""

$installGPU = Read-Host "Install PyTorch with GPU support? (Y/N, N for CPU-only)"
if ($installGPU -eq 'Y' -or $installGPU -eq 'y') {
    Write-Host ""
    Write-Host "📥 Installing PyTorch with CUDA 12.1..." -ForegroundColor Cyan
    Write-Host "   This will take 10-15 minutes..." -ForegroundColor Gray
    Write-Host ""
    
    # Activate venv first
    & .\.venv\Scripts\Activate.ps1
    
    Write-Host "🗑️  Removing CPU-only PyTorch..." -ForegroundColor Cyan
    & uv remove torch torchvision torchaudio 2>$null
    
    Write-Host "📥 Installing GPU version..." -ForegroundColor Cyan
    & uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PyTorch GPU installed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PyTorch GPU installation had issues" -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping GPU PyTorch (will use CPU - slower)" -ForegroundColor Yellow
}

# =============================================================================
# Step 7: Download NLTK Data
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 7: Download NLTK Data (Text Processing)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "NLTK provides text correction and analysis" -ForegroundColor Gray
Write-Host ""

$installNLTK = Read-Host "Download NLTK data? (Y/N)"
if ($installNLTK -eq 'Y' -or $installNLTK -eq 'y') {
    Write-Host "📥 Downloading NLTK data..." -ForegroundColor Cyan
    
    $nltkScript = @"
import nltk
nltk.download('punkt')
nltk.download('words')
nltk.download('averaged_perceptron_tagger')
nltk.download('brown')
nltk.download('stopwords')
print('✅ NLTK data downloaded!')
"@
    
    $nltkScript | & .\.venv\Scripts\python.exe -
    Write-Host "✅ NLTK data ready!" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipping NLTK data" -ForegroundColor Yellow
}

# =============================================================================
# Step 8: Download AI Models (Optional)
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 8: Download AI Models (Optional)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""
Write-Host "Models will auto-download on first use, but you can pre-download them now" -ForegroundColor Gray
Write-Host ""

# TrOCR
Write-Host "📦 TrOCR (Handwritten text recognition) - 556MB" -ForegroundColor Cyan
$downloadTrOCR = Read-Host "Pre-download TrOCR? (Y/N)"
if ($downloadTrOCR -eq 'Y' -or $downloadTrOCR -eq 'y') {
    Write-Host "📥 Downloading TrOCR..." -ForegroundColor Cyan
    $trocrScript = @"
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
print('Downloading TrOCR...')
processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')
print('✅ TrOCR downloaded!')
"@
    $trocrScript | & .\.venv\Scripts\python.exe -
}

Write-Host ""

# LED
Write-Host "📦 LED (Document summarization) - 1.6GB" -ForegroundColor Cyan
$downloadLED = Read-Host "Pre-download LED? (Y/N)"
if ($downloadLED -eq 'Y' -or $downloadLED -eq 'y') {
    Write-Host "📥 Downloading LED..." -ForegroundColor Cyan
    $ledScript = @"
from transformers import pipeline
print('Downloading LED model...')
summarizer = pipeline('summarization', model='pszemraj/led-large-book-summary', device=-1)
print('✅ LED downloaded!')
"@
    $ledScript | & .\.venv\Scripts\python.exe -
}

Write-Host ""

# BART (already included in dependencies)
Write-Host "📦 BART (Summarization fallback) - Downloads on first use" -ForegroundColor Gray
Write-Host ""

# =============================================================================
# Step 9: Test Installation
# =============================================================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 9: Testing Installation" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

$runTest = Read-Host "Run installation test? (Y/N)"
if ($runTest -eq 'Y' -or $runTest -eq 'y') {
    Write-Host ""
    Write-Host "🧪 Running tests..." -ForegroundColor Cyan
    Write-Host ""
    
    # Test GPU
    Write-Host "1️⃣ Testing GPU support..." -ForegroundColor Cyan
    & .\.venv\Scripts\python.exe src\backend\gpu_check.py
    
    Write-Host ""
    Write-Host "2️⃣ Testing models..." -ForegroundColor Cyan
    & .\.venv\Scripts\python.exe src\backend\test_models.py
    
    Write-Host ""
}

# =============================================================================
# Final Summary
# =============================================================================
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                           ║" -ForegroundColor Green
Write-Host "║              🎉 SETUP COMPLETE! 🎉                        ║" -ForegroundColor Green
Write-Host "║                                                           ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Backend:" -ForegroundColor Yellow
Write-Host "   node src\backend\server.js" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Frontend (in new terminal):" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Open in browser:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md - General overview" -ForegroundColor Gray
Write-Host "   - QUICKSTART_OCR.md - Quick start guide" -ForegroundColor Gray
Write-Host "   - SETUP_ADVANCED_OCR.md - Detailed setup" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Need help? Check the documentation or contact the team!" -ForegroundColor Gray
Write-Host ""
