# 🚀 Advanced OCR Setup Guide

This guide will help you set up Nougat, TrOCR, and improved summarization for Conceptify.

## 📦 What's Been Added

### **1. Intelligent Document Routing**

The OCR pipeline now automatically detects:

- **Academic/Mathematical PDFs** → Routes to Nougat
- **Handwritten Content** → Routes to TrOCR
- **Standard Text PDFs** → Uses existing PyMuPDF + Tesseract

### **2. New OCR Models**

- **Nougat** (already downloaded ✅) - For academic documents with formulas
- **TrOCR** (needs download) - For handwritten text recognition

## 🔧 Installation Steps

### **Step 1: Activate Your Virtual Environment**

```powershell
cd "C:\Projects\Conceptify - AI Powered Learning Platform"
.\.venv\Scripts\Activate.ps1
```

### **Step 2: Install Additional Dependencies**

```powershell
# Install pdf2image for Nougat (converts PDF to images)
uv pip install pdf2image

# Install poppler (required for pdf2image)
# Download from: https://github.com/oschwartz10612/poppler-windows/releases/
# Extract to C:\poppler and add C:\poppler\Library\bin to PATH
```

### **Step 3: Download TrOCR Model (Optional - for handwriting)**

The model will auto-download on first use, but you can pre-download:

```python
# Run this in Python to download TrOCR
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

print("TrOCR downloaded successfully!")
```

**Size:** ~556MB

## 📊 Current Model Status

| Model               | Status      | Purpose            | Size   |
| ------------------- | ----------- | ------------------ | ------ |
| PyMuPDF + Tesseract | ✅ Active   | Standard PDFs      | ~100MB |
| BART-large-cnn      | ✅ Active   | Summarization      | 1.6GB  |
| Nougat              | ✅ Ready    | Academic/Math PDFs | 1.5GB  |
| TrOCR               | ⏳ Optional | Handwritten text   | 556MB  |

## 🧪 Testing Your Setup

### **Test 1: Check GPU**

```powershell
.\.venv\Scripts\python.exe src\backend\gpu_check.py
```

### **Test 2: Test OCR Pipeline**

```powershell
# Test with a PDF
node src\backend\server.js
# Then upload a PDF through the UI at http://localhost:5173
```

### **Test 3: Python Script Test**

```python
# test_advanced_ocr.py
from src.backend.ocr_wrapper import OCRPipeline

ocr = OCRPipeline()
result = ocr.process_file("path/to/your/test.pdf")
print(result)
```

## 📝 How It Works Now

```
┌─────────────┐
│ Upload PDF  │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Detect Document Type │
└──────┬───────────────┘
       │
       ├─► Academic/Math? ──► Use Nougat (best for equations)
       │
       ├─► Handwritten? ──► Use TrOCR (best for handwriting)
       │
       └─► Standard? ──► Use PyMuPDF + Tesseract (fastest)
```

## ⚙️ Configuration

The pipeline automatically uses GPU if available. Models are loaded on-demand:

- **Nougat loads IF:** Academic PDF detected AND model exists in `models/nougat-base/`
- **TrOCR loads IF:** Handwritten content detected AND model downloaded
- **Fallback:** Always falls back to Tesseract if specialized models fail

## 🎯 Next Steps (Optional Upgrades)

### **Better Summarization (Replace BART with LED)**

For longer documents (textbooks, research papers):

```powershell
# Download LED model
uv pip install transformers
```

```python
# In ocr_wrapper.py, change summarizer model to:
model="pszemraj/led-large-book-summary"
```

### **Add Question Generation**

```powershell
# Install mixqg for MCQ generation
uv pip install transformers
```

```python
from transformers import pipeline
qg = pipeline("text2text-generation", model="Salesforce/mixqg-base")
```

## 🐛 Troubleshooting

### **Issue: "pdf2image not found"**

```powershell
uv pip install pdf2image
```

### **Issue: "Poppler not in PATH"**

1. Download Poppler: https://github.com/oschwartz10612/poppler-windows/releases/
2. Extract to `C:\poppler`
3. Add to PATH: `C:\poppler\Library\bin`

### **Issue: "CUDA out of memory"**

Models will automatically fall back to CPU. For better GPU usage:

- Process fewer pages at once
- Close other GPU applications
- Use smaller model variants

### **Issue: "TrOCR model not loading"**

Run manually:

```python
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
```

## 📊 Performance Expectations

| Document Type | Method    | Speed (GPU)         | Quality    |
| ------------- | --------- | ------------------- | ---------- |
| Digital PDF   | PyMuPDF   | ⚡⚡⚡⚡⚡ <1s/page | ⭐⭐⭐⭐⭐ |
| Academic PDF  | Nougat    | ⚡⚡ 5-10s/page     | ⭐⭐⭐⭐⭐ |
| Handwritten   | TrOCR     | ⚡⚡⚡ 2-3s/page    | ⭐⭐⭐⭐   |
| Scanned Text  | Tesseract | ⚡⚡⚡⚡ 1-2s/page  | ⭐⭐⭐     |

## ✅ Verification Checklist

- [ ] Virtual environment activated
- [ ] pdf2image installed (`uv pip list | grep pdf2image`)
- [ ] Poppler in PATH (run `poppler -v` or check bin folder exists)
- [ ] Nougat model in `models/nougat-base/` folder
- [ ] TrOCR downloaded (optional)
- [ ] GPU check passes (optional)
- [ ] Backend server starts without errors

## 🎓 Usage Tips

1. **For Math/Science PDFs:** The system will auto-detect and use Nougat
2. **For Handwritten Notes:** Upload as image (.jpg, .png) for best results
3. **For Speed:** Digital PDFs are fastest - avoid unnecessary OCR
4. **For Quality:** Academic PDFs benefit most from Nougat

## 📚 Model Details

### **Nougat (facebook/nougat-base)**

- **Purpose:** Scientific document OCR with LaTeX support
- **Best for:** Research papers, math textbooks, technical documents
- **Output:** Markdown with LaTeX formulas

### **TrOCR (microsoft/trocr-base-handwritten)**

- **Purpose:** Handwritten text recognition
- **Best for:** Handwritten notes, forms, written exams
- **Output:** Plain text

### **BART (facebook/bart-large-cnn)**

- **Purpose:** Text summarization
- **Best for:** Creating study summaries
- **Output:** Concise summary paragraphs

---

**Need help?** Check the console logs - they show which models loaded and which document type was detected!
