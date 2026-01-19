# 📦 Distribution Guide for Conceptify

## What to Give Your Teammates

### ✅ Required Files & Folders

```
Conceptify/
├── SETUP_COMPLETE.ps1          ⭐ Main setup script
├── README.md                    📚 Project overview
├── QUICKSTART_OCR.md           📚 Quick start guide
├── SETUP_ADVANCED_OCR.md       📚 Detailed setup
├── package.json                 📦 Node dependencies
├── pyproject.toml              📦 Python dependencies
├── vite.config.js              ⚙️ Vite configuration
├── eslint.config.js            ⚙️ ESLint configuration
├── index.html                  🌐 Entry HTML
│
├── src/                        📁 Source code
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/             📁 React components
│   │   ├── ChatbotPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── Navbar.jsx
│   │   ├── OcrPage.jsx
│   │   ├── OcrResultPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SignupPage.jsx
│   │   ├── TakeTestPage.jsx
│   │   ├── TestPage.jsx
│   │   └── TestResultPage.jsx
│   │
│   ├── styles/                 📁 CSS files
│   │   ├── Auth.css
│   │   ├── ChatbotPage.css
│   │   ├── Dashboard.css
│   │   ├── LandingPage.css
│   │   ├── MainLayout.css
│   │   ├── Navbar.css
│   │   ├── OcrPage.css
│   │   ├── OcrResultPage.css
│   │   ├── SettingsPage.css
│   │   ├── Sidebar.css
│   │   ├── styles.js
│   │   ├── TakeTestPage.css
│   │   ├── TestPage.css
│   │   └── TestResultPage.css
│   │
│   ├── assets/                 📁 Images/icons
│   │   └── (all images)
│   │
│   └── backend/                📁 Backend code
│       ├── server.js           🔧 Express server
│       ├── ocr_wrapper.py      🔧 OCR pipeline
│       ├── gpu_check.py        🔧 GPU diagnostics
│       ├── test_models.py      🔧 Model tests
│       ├── test_summarization.py 🔧 Summary tests
│       └── cleanup_data.js     🔧 Data cleanup
│
└── models/                     📁 Pre-downloaded models (optional)
    └── nougat-base/           📦 Nougat model (if sharing)
        ├── config.json
        ├── generation_config.json
        ├── model.safetensors
        ├── preprocessor_config.json
        ├── special_tokens_map.json
        ├── tokenizer_config.json
        └── tokenizer.json
```

---

## ❌ What NOT to Include

### Never Share These:

```
.venv/                         # Virtual environment (5GB+)
node_modules/                  # Node packages (200MB+)
.git/                          # Git history
```

### Auto-Generated (Don't Share):

```
src/backend/data/              # Generated OCR results
src/backend/uploads/           # Uploaded files
dist/                          # Build output
.vscode/                       # Editor settings
```

### Temporary Files (Don't Share):

```
*.pyc
__pycache__/
*.log
.DS_Store
Thumbs.db
```

---

## 📦 How to Package for Distribution

### Option 1: ZIP File (Recommended)

```powershell
# Create a clean package
$exclude = @('.venv', 'node_modules', '.git', 'src/backend/data', 'src/backend/uploads', 'dist')
Compress-Archive -Path * -DestinationPath Conceptify-v1.0.zip -Force
```

### Option 2: Git Repository

```bash
# Clone without large files
git clone <your-repo-url>
cd Conceptify
# Run SETUP_COMPLETE.ps1
```

---

## 📋 Quick Distribution Checklist

Before sharing, ensure you have:

- [ ] ✅ SETUP_COMPLETE.ps1 in root folder
- [ ] ✅ README.md with updated instructions
- [ ] ✅ All src/ files
- [ ] ✅ package.json and pyproject.toml
- [ ] ✅ Configuration files (vite.config.js, etc.)
- [ ] ❌ NO .venv folder
- [ ] ❌ NO node_modules folder
- [ ] ❌ NO uploaded files or generated data

---

## 🚀 Installation Instructions for Teammates

**Send this to your team:**

1. **Extract the package**

    ```powershell
    # Extract Conceptify-v1.0.zip to C:\Projects\
    ```

2. **Run the setup script**

    ```powershell
    cd "C:\Projects\Conceptify - AI Powered Learning Platform"
    .\SETUP_COMPLETE.ps1
    ```

3. **Follow the prompts**
    - The script will guide you through each step
    - Press Y to install each component
    - Installation takes 20-30 minutes total

4. **Start the application**

    ```powershell
    # Terminal 1 - Backend
    node src\backend\server.js

    # Terminal 2 - Frontend
    npm run dev
    ```

5. **Open in browser**
    ```
    http://localhost:5173
    ```

---

## 📝 What Teammates Need Pre-Installed

Before running SETUP_COMPLETE.ps1, they need:

1. **Node.js 18+**
    - Download: https://nodejs.org/

2. **Python 3.10+**
    - Download: https://python.org/
    - ⚠️ Check "Add Python to PATH" during installation

3. **Git** (if cloning from repository)
    - Download: https://git-scm.com/

That's it! The setup script handles everything else.

---

## 💾 Optional: Share Pre-Downloaded Models

If you want to save teammates download time, include these:

### Nougat Model (~1.5GB)

```
models/nougat-base/
├── config.json
├── model.safetensors
└── (other files)
```

This saves teammates from downloading Nougat on first use.

### Don't Share These Models:

- BART, LED, TrOCR cache (stored in user's home folder)
- These will auto-download on first use

---

## 🔧 Troubleshooting for Teammates

### If setup fails:

1. **Python/Node not found**
    - Install from links above
    - Restart PowerShell

2. **UV installation fails**
    - Skip it, use pip instead
    - Change `uv` commands to `pip` in scripts

3. **GPU PyTorch fails**
    - Skip GPU installation
    - CPU version works but slower

4. **Poppler not working**
    - Nougat won't work
    - Standard OCR still works fine

---

## 📊 Package Size Estimates

| Component                  | Size       |
| -------------------------- | ---------- |
| Source code + configs      | ~2MB       |
| Nougat model (optional)    | 1.5GB      |
| **Total (without models)** | **~2MB**   |
| **Total (with Nougat)**    | **~1.5GB** |

**What teammates will download:**

- Python packages: ~1GB
- Node packages: ~200MB
- PyTorch GPU: ~2.5GB (optional)
- AI models: ~3-4GB (auto-downloads)
- **Total**: 6-8GB depending on options

---

## ✨ Summary

**Give teammates:**

1. ZIP file with src/, configs, and SETUP_COMPLETE.ps1
2. Instructions to run SETUP_COMPLETE.ps1
3. Links to install Node.js and Python

**They get:**

- Fully guided installation
- Everything installs automatically
- Working app in 20-30 minutes

**That's it!** 🎉
