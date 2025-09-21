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

2. Initialize project (creates pyproject.toml if not exists):

    ```bash
    uv init
    ```

3. Create and activate virtual environment (Python 3.10):

    ```bash
    uv venv -p 3.10
    .venv\Scripts\activate
    ```

4. Install dependencies:

    ```bash
    uv sync
    ```

## 📜 License

MIT License © 2025 – Conceptify Team



