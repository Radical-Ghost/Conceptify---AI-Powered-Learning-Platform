<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 📘 Conceptify – AI-Powered Learning Platform

Conceptify is an AI-powered platform that helps students learn smarter.  
It extracts knowledge from textbooks (PDFs or scanned images), summarizes concepts, and generates adaptive quizzes to make studying interactive and personalized.

## 🚀 Features

-   **PDF/Image to Text**

    -   Native PDFs → Extracted using PyMuPDF
    -   Scanned PDFs/Images → OCR with Tesseract (future: PaddleOCR/LayoutLM)

-   **Structured Output**

    -   Headings, paragraphs, and lists preserved in JSON format
    -   Directly stored in DB for model-ready consumption

-   **Summarization**

    -   Use transformer models (LongT5, BART, Pegasus X) for clear, concise notes

-   **Question Generation**

    -   Auto-generate MCQs from content with adjustable difficulty

-   **Adaptive Learning Engine**
    -   Dynamic quizzes based on student performance

## 🛠️ Tech Stack

-   **Python** (3.10, managed with [uv](https://github.com/astral-sh/uv))
-   **OCR**: Tesseract, pdf2image, Pillow
-   **Text Extraction**: PyMuPDF
-   **Planned ML/NLP**: Hugging Face Transformers, PyTorch
-   **Database (Planned)**: MongoDB / Firestore
-   **Frontend (Planned)**: React
-   **Backend (Planned)**: FastAPI

## 📦 Installation & Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/Radical-Ghost/Conceptify---AI-Powered-Learning-Platform.git "Conceptify - AI-Powered Learning Platform"
    cd Conceptify - AI-Powered Learning Platform
    ```

2. Create and activate virtual environment (Python 3.10):

    ```bash
    uv venv -p 3.10
    .venv\Scripts\activate
    ```

3. Install dependencies:

    ```bash
    uv sync
    ```

## 📜 License

MIT License © 2025 – Conceptify Team




>>>>>>> 29cf1f51f16e8c35beafbeb0622ca49f2f52ec05
