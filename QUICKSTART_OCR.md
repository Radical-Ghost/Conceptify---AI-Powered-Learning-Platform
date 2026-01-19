# 🚀 Quick Start - Advanced OCR Setup

## ⚡ Installation (5 minutes)

### 1. Activate Environment

```powershell
cd "C:\Projects\Conceptify - AI Powered Learning Platform"
.\.venv\Scripts\Activate.ps1
```

### 2. Run Setup Script

```powershell
.\setup_advanced_ocr.ps1
```

**OR Manual Install:**

```powershell
uv pip install pdf2image
```

### 3. Install Poppler (Required for Nougat)

📥 Download: https://github.com/oschwartz10612/poppler-windows/releases/

- Extract to `C:\Coding\poppler-25.12.0` (or your preferred location)
- Add `C:\Coding\poppler-25.12.0\Library\bin` to system PATH

**Quick PATH setup (run as Administrator):**

```powershell
.\add_poppler_to_path.ps1
```

### 4. Test Everything

```powershell
python src\backend\test_models.py
```

---

## 📦 What Gets Downloaded

| Component | Size  | Status         | Purpose                |
| --------- | ----- | -------------- | ---------------------- |
| pdf2image | ~2MB  | Required       | Converts PDF to images |
| Poppler   | ~30MB | Required       | PDF processing backend |
| Nougat    | 1.5GB | ✅ You have it | Academic PDF OCR       |
| TrOCR     | 556MB | Optional       | Handwritten text       |

---

## 🎯 What Changed in Your Code

### ✅ Added to `ocr_wrapper.py`:

1. **`setup_advanced_ocr()`** - Loads Nougat & TrOCR
2. **`detect_document_type()`** - Routes to best OCR method
3. **`process_with_nougat()`** - Academic PDF processing
4. **`process_with_trocr()`** - Handwriting recognition
5. **Smart routing in `process_pdf()`** - Auto-selects best method

### 🔄 How It Routes Documents:

```
PDF Upload
    ↓
Has math/formulas? → Nougat (academic)
Has native text? → PyMuPDF (fast)
Handwritten? → TrOCR (handwriting)
Scanned text? → Tesseract (standard)
```

---

## 🧪 Testing

### Test Individual Models

```python
from src.backend.ocr_wrapper import OCRPipeline
ocr = OCRPipeline()

# Check what loaded
print(f"Nougat: {ocr.nougat_model is not None}")
print(f"TrOCR: {ocr.trocr_model is not None}")
print(f"BART: {ocr.summarizer is not None}")
```

### Test Document Detection

```python
doc_type = ocr.detect_document_type("your_file.pdf")
print(f"Detected as: {doc_type}")
# Returns: "academic", "handwritten", or "standard"
```

### Test Full Pipeline

```python
result = ocr.process_file("test.pdf")
print(result['file_info']['processing_method'])
# Returns: "nougat_academic", "hybrid_pdf", etc.
```

---

## 📊 Performance Guide

| Document Type     | Best Method | Speed      | Quality    |
| ----------------- | ----------- | ---------- | ---------- |
| Digital textbook  | PyMuPDF     | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| Math/equations    | Nougat      | ⚡⚡       | ⭐⭐⭐⭐⭐ |
| Handwritten notes | TrOCR       | ⚡⚡⚡     | ⭐⭐⭐⭐   |
| Scanned pages     | Tesseract   | ⚡⚡⚡⚡   | ⭐⭐⭐     |

---

## 🐛 Common Issues

### "pdf2image not found"

```powershell
uv pip install pdf2image
```

### "Poppler not in PATH"

Add `C:\poppler\Library\bin` to system PATH

### "Nougat model not found"

Check `models/nougat-base/` folder exists with model files

### "TrOCR failed"

Model will auto-download on first use. Force download:

```python
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
```

### "CUDA out of memory"

Reduce batch size or process fewer pages. Code automatically falls back to CPU.

---

## ✅ Verification Checklist

- [ ] Virtual env activated (`.venv\Scripts\Activate.ps1`)
- [ ] `pdf2image` installed (`uv pip list | grep pdf2image`)
- [ ] Poppler in PATH (`where poppler` or check `C:\poppler\Library\bin`)
- [ ] Nougat folder exists (`models/nougat-base/`)
- [ ] Test script passes (`python src\backend\test_models.py`)
- [ ] Backend starts (`node src\backend\server.js`)

---

## 🎓 Usage Examples

### Example 1: Math Textbook

```
Upload "calculus.pdf"
→ Detects "academic"
→ Uses Nougat
→ Extracts LaTeX formulas
→ High quality output ✅
```

### Example 2: Handwritten Notes

```
Upload "notes.jpg"
→ Detects "handwritten"
→ Uses TrOCR
→ Recognizes handwriting
→ Good quality output ✅
```

### Example 3: Regular PDF

```
Upload "syllabus.pdf"
→ Detects "standard"
→ Uses PyMuPDF
→ Fast extraction
→ Excellent quality ✅
```

---

## 📚 Read More

- Full guide: `SETUP_ADVANCED_OCR.md`
- Test models: `python src\backend\test_models.py`
- Check progress: `PROGRESS_LOCAL.md`

**🎉 You're all set! Upload a PDF to see the magic!**
