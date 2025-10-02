# 🤖 AI Model Setup Guide - Conceptify

## Model Information

**Model Used:** `facebook/bart-large-cnn`

-   **Type:** Transformer-based summarization model
-   **Size:** ~1.6 GB
-   **Purpose:** Automatic text summarization and content analysis
-   **Framework:** PyTorch + Hugging Face Transformers

---

## 📍 Where Models Are Stored

The BART-Large-CNN model is **NOT included in this repository**. It will be **automatically downloaded** on first use and cached locally.

### Default Cache Locations:

**Windows:**

```
C:\Users\<YourUsername>\.cache\huggingface\hub\
```

**macOS/Linux:**

```
~/.cache/huggingface/hub/
```

---

## 🚀 Setup for Collaborators

### 1. Install Dependencies

First, make sure you have all Python dependencies installed:

```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Install dependencies (includes transformers and torch)
uv sync
```

### 2. First Run - Automatic Download

When you first run the application, the model will be downloaded automatically:

```bash
# Start the backend server
cd src/backend
node server.js
```

**Expected behavior:**

-   First run: Model downloads (~1.6 GB) - **takes 5-15 minutes** depending on internet speed
-   Console shows: `Downloading (…): 100%`
-   Subsequent runs: Model loads instantly from cache

### 3. Manual Pre-download (Optional)

If you want to download the model before running the app:

```bash
# Activate virtual environment
.venv\Scripts\activate

# Download model manually
python -c "from transformers import pipeline; pipeline('summarization', model='facebook/bart-large-cnn')"
```

---

## ⚙️ GPU vs CPU Performance

The application **automatically detects** available hardware:

| Hardware       | Speed  | Max Words/Chunk | Batch Size |
| -------------- | ------ | --------------- | ---------- |
| **GPU (CUDA)** | Fast   | 1200 words      | 4 chunks   |
| **CPU**        | Slower | 600 words       | 2 chunks   |

**Check if GPU is available:**

```python
import torch
print(f"CUDA Available: {torch.cuda.is_available()}")
print(f"Device: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'}")
```

---

## 🔧 Troubleshooting

### Model Download Fails

**Problem:** Slow or failed download from Hugging Face

**Solutions:**

1. **Check internet connection** - Model is 1.6 GB
2. **Use a VPN** if Hugging Face is blocked in your region
3. **Change Hugging Face mirror** (for users in China):
    ```bash
    export HF_ENDPOINT=https://hf-mirror.com
    ```
4. **Manual download with better error messages:**
    ```bash
    python -c "from transformers import BartForConditionalGeneration, BartTokenizer; BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn'); BartTokenizer.from_pretrained('facebook/bart-large-cnn')"
    ```

### Model Cache Corrupted

**Problem:** Model fails to load after partial download

**Solution:** Clear cache and re-download:

**Windows:**

```bash
rd /s /q "%USERPROFILE%\.cache\huggingface"
```

**macOS/Linux:**

```bash
rm -rf ~/.cache/huggingface
```

Then restart the application to re-download.

### Out of Memory Error

**Problem:** System runs out of RAM/VRAM

**Solutions:**

1. **Close other applications** to free memory
2. **CPU mode uses less memory** than GPU mode
3. **Model requirements:**
    - CPU: ~2 GB RAM
    - GPU: ~2 GB VRAM + 2 GB RAM

### Model Not Found Error

**Problem:** `OSError: Can't load tokenizer for 'facebook/bart-large-cnn'`

**Solutions:**

1. **Check internet connection** during first run
2. **Verify transformers version:**
    ```bash
    python -c "import transformers; print(transformers.__version__)"
    # Should be 4.36.0 or higher
    ```
3. **Reinstall transformers:**
    ```bash
    uv add transformers --force-reinstall
    ```

---

## 📦 Alternative: Offline Setup

If you need to set up the project on a machine without internet access:

### On Internet-Connected Machine:

1. **Download model cache:**

    ```bash
    python -c "from transformers import pipeline; pipeline('summarization', model='facebook/bart-large-cnn')"
    ```

2. **Locate cache folder:**

    - Windows: `C:\Users\<YourUsername>\.cache\huggingface\`
    - macOS/Linux: `~/.cache/huggingface/`

3. **Copy entire folder** to USB drive or shared network location

### On Offline Machine:

1. **Copy cache folder** to the same location on the offline machine
2. **Run application normally** - it will use the cached model

---

## 🔍 Verify Installation

Run this test script to verify everything is working:

```python
# test_model.py
from transformers import pipeline
import torch

print("Testing BART-Large-CNN setup...")
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")

try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    test_text = "Artificial intelligence is transforming how we learn and process information. Machine learning models can now understand and summarize complex documents automatically."

    result = summarizer(test_text, max_length=50, min_length=20)
    print(f"\n✅ Model loaded successfully!")
    print(f"Test summary: {result[0]['summary_text']}")
except Exception as e:
    print(f"\n❌ Error: {e}")
```

Run with:

```bash
python test_model.py
```

---

## 📊 Model Details

**Model Card:** https://huggingface.co/facebook/bart-large-cnn

**Capabilities:**

-   Extractive + Abstractive Summarization
-   Handles documents up to 1024 tokens
-   Trained on CNN/DailyMail dataset
-   High-quality summaries for educational content

**Limitations:**

-   English language only
-   Max input: ~1024 tokens (~750 words)
-   Best for news/article-style text
-   May struggle with highly technical jargon

---

## 🤝 Questions?

If you encounter issues:

1. Check this guide first
2. Look at the main [README.md](../README.md) troubleshooting section
3. Check Hugging Face status: https://status.huggingface.co/
4. Open an issue on GitHub with error logs

---

**Last Updated:** October 2, 2025
