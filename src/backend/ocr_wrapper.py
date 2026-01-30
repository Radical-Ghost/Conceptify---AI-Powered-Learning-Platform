#!/usr/bin/env python3
"""
Complete OCR Pipeline - Self-contained in src/backend
"""
import sys
import os
import json
import io
import re
import string
import tempfile
from datetime import datetime
from collections import Counter
import hashlib
import time

# Core dependencies
required_imports = [
    ("pdfplumber", "pdfplumber"),
    ("fitz", "PyMuPDF"),
    ("pytesseract", "pytesseract"),
    ("cv2", "opencv-python"),
    ("numpy", "numpy"),
    ("PIL", "Pillow"),
    ("nltk", "nltk"),
    ("torch", "torch"),
    ("transformers", "transformers"),
]
missing = []
for mod_name, pip_name in required_imports:
    try:
        if mod_name == "PIL":
            import PIL
            from PIL import Image, ImageEnhance
        else:
            __import__(mod_name)
    except ImportError:
        missing.append((mod_name, pip_name))
if missing:
    missing_mods = [m[0] for m in missing]
    install_cmd = "pip install " + " ".join(sorted(set(m[1] for m in missing)))
    print(json.dumps({
        'success': False,
        'error': (
            f"Required dependencies not installed: {', '.join(missing_mods)}. "
            f"To install, run: {install_cmd}"
        )
    }))
    sys.exit(1)
import pdfplumber
import fitz
import pytesseract
import cv2
import numpy as np
from PIL import Image, ImageEnhance
import nltk
import torch
import requests
DEPS_AVAILABLE = True

# Ollama API configuration for Mistral 7B
OLLAMA_URL = "http://localhost:11434/api/generate"
MISTRAL_MODEL = "mistral:7b"
class OCRPipeline:
    def __init__(self):
        self.setup_nltk()
        self.english_words, self.word_freq, self.stop_words = self.create_dict()
        self.ollama_available = self.check_ollama_connection()
        # Advanced OCR models
        self.nougat_model = None
        self.nougat_processor = None
        self.trocr_model = None
        self.trocr_processor = None
        self.setup_advanced_ocr()

    def check_ollama_connection(self):
        """Check if Ollama is running and Mistral 7B is available"""
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=2)
            if response.status_code == 200:
                models = response.json().get('models', [])
                model_names = [m['name'] for m in models]
                if any('mistral' in m for m in model_names):
                    print("✅ Mistral 7B available via Ollama", file=sys.stderr)
                    return True
                else:
                    print("⚠️  Mistral 7B not found. Run: ollama pull mistral:7b", file=sys.stderr)
                    return False
        except Exception as e:
            print(f"⚠️  Ollama not running: {e}", file=sys.stderr)
            print("   Start Ollama and run: ollama pull mistral:7b", file=sys.stderr)
            return False
    
    def setup_advanced_ocr(self):
        """Setup Nougat and TrOCR models for academic/handwritten documents"""
        try:
            use_gpu = torch.cuda.is_available()
            device = 0 if use_gpu else -1
            
            # Try loading Nougat (for academic documents with math)
            try:
                nougat_path = os.path.join(
                    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                    "models", "nougat-base"
                )
                if os.path.exists(nougat_path):
                    from transformers import VisionEncoderDecoderModel, TrOCRProcessor
                    self.nougat_processor = TrOCRProcessor.from_pretrained(nougat_path)
                    self.nougat_model = VisionEncoderDecoderModel.from_pretrained(
                        nougat_path,
                        torch_dtype=torch.float16 if use_gpu else torch.float32
                    )
                    if use_gpu:
                        self.nougat_model = self.nougat_model.to('cuda')
                    print("✅ Nougat model loaded for academic documents", file=sys.stderr)
                else:
                    print("⚠️  Nougat model not found - will use standard OCR", file=sys.stderr)
            except Exception as e:
                print(f"⚠️  Could not load Nougat: {e}", file=sys.stderr)
            
            # Try loading TrOCR (for handwritten text)
            try:
                from transformers import TrOCRProcessor, VisionEncoderDecoderModel
                self.trocr_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
                self.trocr_model = VisionEncoderDecoderModel.from_pretrained(
                    "microsoft/trocr-base-handwritten",
                    torch_dtype=torch.float16 if use_gpu else torch.float32
                )
                if use_gpu:
                    self.trocr_model = self.trocr_model.to('cuda')
                print("✅ TrOCR model loaded for handwritten text", file=sys.stderr)
            except Exception as e:
                print(f"⚠️  Could not load TrOCR: {e}", file=sys.stderr)
                
        except Exception as e:
            print(f"⚠️  Advanced OCR setup failed: {e}", file=sys.stderr)
        
    def setup_nltk(self):
        """Setup NLTK with quiet initialization"""
        try:
            nltk_data_path = os.path.expanduser('~/nltk_data')
            if nltk_data_path not in nltk.data.path:
                nltk.data.path.append(nltk_data_path)
            
            required_data = ['punkt', 'words', 'averaged_perceptron_tagger', 'brown', 'stopwords']
            missing = []
            
            for data in required_data:
                try:
                    nltk.data.find(f'tokenizers/{data}' if data == 'punkt' else 
                                  f'taggers/{data}' if 'tagger' in data else f'corpora/{data}')
                except LookupError:
                    missing.append(data)
            
            for data in missing:
                nltk.download(data, download_dir=nltk_data_path, quiet=True)
                
            self.nltk_available = True
        except Exception as e:
            self.nltk_available = False
    
    def create_dict(self):
        """Create word dictionaries and stopwords for text processing"""
        try:
            if not self.nltk_available:
                return set(), Counter(), set()
            
            from nltk.corpus import brown, words, stopwords
            english_words = set(words.words())
            brown_words = [w.lower() for w in brown.words() if w.isalpha()]
            word_freq = Counter(brown_words)
            stop_words = set(stopwords.words('english'))
            return english_words, word_freq, stop_words
        except:
            return set(), Counter(), set()
    
    def edit_distance(self, s1, s2):
        """Calculate edit distance between strings"""
        if len(s1) < len(s2): 
            return self.edit_distance(s2, s1)
        if not s2: 
            return len(s1)
        
        prev = list(range(len(s2) + 1))
        for i, c1 in enumerate(s1):
            curr = [i + 1]
            for j, c2 in enumerate(s2):
                ins, dele, sub = prev[j+1]+1, curr[j]+1, prev[j]+(c1!=c2)
                curr.append(min(ins, dele, sub))
            prev = curr
        return prev[-1]
    
    def spell_check(self, word, max_d=2):
        """Spell check using edit distance and frequency"""
        word = word.lower()
        if not self.english_words or word in self.english_words:
            return word
        
        candidates = []
        for w in self.english_words:
            if abs(len(w) - len(word)) <= max_d:
                dist = self.edit_distance(word, w)
                if dist <= max_d:
                    candidates.append((w, dist, self.word_freq.get(w, 1)))
        
        if candidates:
            return sorted(candidates, key=lambda x: (x[1], -x[2]))[0][0]
        return word
    
    def correct_text(self, text):
        """Advanced text correction with POS tagging"""
        if not self.nltk_available or not text.strip():
            return self.simple_correct(text)
        
        try:
            from nltk.tokenize import word_tokenize, sent_tokenize
            from nltk.tag import pos_tag
            
            sentences = sent_tokenize(text)
            corrected_sentences = []
            
            for sentence in sentences:
                words = word_tokenize(sentence)
                pos_tags = pos_tag(words)
                corrected = []
                
                for word, pos in pos_tags:
                    if word in string.punctuation:
                        corrected.append(word)
                        continue
                    
                    # Context-aware corrections
                    if pos.startswith('NN'):  # Nouns
                        word = re.sub(r'rn', 'm', word)
                        word = re.sub(r'cl', 'd', word)
                    elif pos.startswith('VB'):  # Verbs
                        word = re.sub(r'1ng', 'ing', word)
                    elif pos.startswith('DT'):  # Determiners
                        if word.lower() in ['tlle', 'tl1e']:
                            word = 'the'
                    
                    # OCR fixes
                    if any(c.isdigit() for c in word) and any(c.isalpha() for c in word):
                        word = re.sub(r'0', 'o', word)
                        word = re.sub(r'1', 'l', word)
                        word = re.sub(r'5', 'S', word)
                        word = re.sub(r'8', 'B', word)
                    
                    # Spell check
                    if word.isalpha() and len(word) > 1:
                        word = self.spell_check(word)
                    
                    corrected.append(word)
                
                # Reconstruct sentence
                s = ' '.join(corrected)
                s = re.sub(r'\s+([,.!?;:])', r'\1', s)
                s = re.sub(r'([,.!?;:])\s*([A-Za-z])', r'\1 \2', s)
                corrected_sentences.append(s)
            
            return re.sub(r'\s+', ' ', ' '.join(corrected_sentences)).strip()
        except:
            return self.simple_correct(text)
    
    def simple_correct(self, text):
        """Fallback correction without advanced features"""
        corrections = [
            (r'rn', 'm'), (r'cl', 'd'), (r'vv', 'w'),
            (r'(\w)1(\w)', r'\1l\2'), (r'(\w)0(\w)', r'\1o\2'),
            (r'\s+', ' '), (r'\btlle\b', 'the'), (r'\btl1e\b', 'the'),
            (r'\s+([,.!?;:])', r'\1')
        ]
        
        corrected = text
        for pattern, replacement in corrections:
            corrected = re.sub(pattern, replacement, corrected)
        return corrected.strip()
    
    def process_normal_text(self, text):
        """Process normal PDF text with NLTK cleaning and stopword filtering"""
        if not text.strip():
            return text.strip()
        
        try:
            # Clean up common PDF extraction issues
            text = re.sub(r'\s+', ' ', text)  # Multiple spaces
            text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # CamelCase splitting
            text = re.sub(r'(\w)([.!?])', r'\1\2 ', text)  # Punctuation spacing
            
            if not self.nltk_available:
                return text.strip()
            
            from nltk.tokenize import word_tokenize, sent_tokenize
            
            # Sentence tokenization and cleaning
            sentences = sent_tokenize(text)
            cleaned_sentences = []
            
            for sentence in sentences:
                # Remove very short sentences (likely extraction errors)
                if len(sentence.split()) < 3:
                    continue
                
                # Remove excessive stopwords from sentence
                words = word_tokenize(sentence.lower())
                
                # Keep sentence structure but filter out excessive stopwords
                # Only remove if more than 60% of words are stopwords
                content_words = [w for w in words if w not in self.stop_words and w.isalpha()]
                if len(content_words) > len(words) * 0.4:  # At least 40% content words
                    cleaned_sentences.append(sentence.strip())
            
            return ' '.join(cleaned_sentences)
        except:
            return text.strip()
    
    def analyze_content(self, text):
        """AI-like content analysis for frontend"""
        if not text.strip():
            return {
                "concepts": [],
                "difficulty": "Unknown",
                "word_count": 0,
                "estimated_reading_time": 0,
                "key_topics": [],
                "confidence_score": 0.0,
                "summary": ""
            }
        
        words = text.split()
        word_count = len(words)
        
        # Simple concept extraction (can be enhanced with NLP models)
        concepts = []
        key_terms = []
        
        # Look for academic/technical terms
        if self.nltk_available:
            try:
                from nltk.tokenize import word_tokenize
                from nltk.tag import pos_tag
                
                tokens = word_tokenize(text.lower())
                pos_tags = pos_tag(tokens)
                
                # Extract nouns as potential concepts (excluding stopwords)
                nouns = [word for word, pos in pos_tags 
                        if pos.startswith('NN') and len(word) > 3 
                        and word not in self.stop_words and word.isalpha()]
                noun_freq = Counter(nouns)
                # Get concepts that appear at least twice, up to 10 concepts
                concepts = [word.title() for word, freq in noun_freq.most_common(15) if freq >= 2][:10]
                
                # If we don't have enough, include single-occurrence important nouns
                if len(concepts) < 5:
                    additional = [word.title() for word, freq in noun_freq.most_common(10) if freq == 1]
                    concepts.extend(additional[:5 - len(concepts)])
                
                # Extract proper nouns and technical terms as key topics
                proper_nouns = [word.title() for word, pos in pos_tags 
                              if pos == 'NNP' and len(word) > 2]
                # Remove duplicates while preserving order
                key_topics = list(dict.fromkeys(proper_nouns))[:7]
                
            except:
                # Fallback to simple word analysis
                words_clean = [w.lower().strip('.,!?;:') for w in words 
                             if len(w) > 4 and w.lower() not in self.stop_words]
                word_freq = Counter(words_clean)
                concepts = [w.title() for w, f in word_freq.most_common(6)]
                key_topics = concepts[:3]
        else:
            # Simple analysis without NLTK
            basic_stopwords = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those'}
            words_clean = [w.lower().strip('.,!?;:') for w in words 
                         if len(w) > 4 and w.lower() not in basic_stopwords]
            word_freq = Counter(words_clean)
            concepts = [w.title() for w, f in word_freq.most_common(6)]
            key_topics = concepts[:3]
        
        # Estimate difficulty based on word complexity
        complex_words = [w for w in words if len(w) > 8]
        complexity_ratio = len(complex_words) / max(word_count, 1)
        
        if complexity_ratio > 0.15:
            difficulty = "Advanced"
        elif complexity_ratio > 0.08:
            difficulty = "Intermediate"
        else:
            difficulty = "Beginner"
        
        # Reading time (average 200 words per minute)
        reading_time = max(1, round(word_count / 200))
        
        # OCR Quality Score - based on text completeness and structure
        # More meaningful than arbitrary confidence
        has_paragraphs = text.count('\n') > 2
        has_punctuation = any(p in text for p in ['.', '!', '?'])
        avg_word_length = sum(len(w) for w in words) / len(words) if words else 0
        
        quality_score = 0
        # Has reasonable word count (30% weight)
        if word_count > 50:
            quality_score += 0.3
        elif word_count > 20:
            quality_score += 0.15
        
        # Has structure (20% weight)
        if has_paragraphs:
            quality_score += 0.2
        
        # Has proper punctuation (20% weight)
        if has_punctuation:
            quality_score += 0.2
        
        # Reasonable word length (15% weight) - not too short (OCR errors) or long (gibberish)
        if 4 <= avg_word_length <= 12:
            quality_score += 0.15
        
        # Has identified concepts (15% weight)
        if len(concepts) >= 3:
            quality_score += 0.15
        elif len(concepts) >= 1:
            quality_score += 0.075
        
        return {
            "concepts": concepts,
            "difficulty": difficulty,
            "word_count": word_count,
            "estimated_reading_time": reading_time,
            "key_topics": key_topics,
            "quality_score": round(quality_score, 2),  # 0.0 to 1.0
            "has_structure": has_paragraphs,
            "complexity_ratio": round(complexity_ratio, 2)
        }

    def calculate_summary_length(self, word_count):
        """Calculate appropriate summary length based on input text length"""
        # Dynamic scaling: 500->100, 1000->140, 2000->250, 3000+->400
        if word_count <= 500:
            max_len = 100
            min_len = 60
        elif word_count <= 1000:
            max_len = 140
            min_len = 90
        elif word_count <= 1500:
            max_len = 180
            min_len = 120
        elif word_count <= 2000:
            max_len = 250
            min_len = 150
        elif word_count <= 3000:
            max_len = 350
            min_len = 200
        else:
            max_len = 400
            min_len = 250
        
        return max_len, min_len
    
    def clean_text_for_summarization(self, text):
        """Clean and validate text before summarization to prevent CUDA errors"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove non-printable characters that can cause tokenization issues
        text = ''.join(char for char in text if char.isprintable() or char in '\n\t')
        
        # Remove extremely long words (likely OCR errors)
        words = text.split()
        cleaned_words = [w if len(w) < 50 else w[:50] for w in words]
        text = ' '.join(cleaned_words)
        
        return text.strip()
    
    def summarize_text(self, text):
        """Summarize extracted text using Mistral 7B via Ollama"""
        self.last_summary_details = {
            "generated": False,
            "strategy": "mistral_ollama",
            "reason": "",
            "duration": 0.0,
        }

        if not self.ollama_available:
            self.last_summary_details["reason"] = "ollama_unavailable"
            return ""

        if not text or len(text.strip()) < 80:
            self.last_summary_details["reason"] = "not_enough_text"
            return ""
        
        text = self.clean_text_for_summarization(text)
        start_time = time.perf_counter()
        total_words = len(text.split())
        target_words = self.calculate_target_summary_words(total_words)
        print(f"📊 Summarizing {total_words} words -> target: ~{target_words} words", file=sys.stderr)

        max_input_words = 3000
        if total_words > max_input_words:
            text = " ".join(text.split()[:max_input_words])
            print(f"✂️  Trimmed to {max_input_words} words", file=sys.stderr)

        prompt = f"""You are an expert summarizer. Provide a comprehensive single-paragraph summary of the following text in approximately {target_words} words. Cover all important points, key concepts, and main ideas. Write directly - do not start with phrases like "The document" or "This text". Do not add conclusions or final thoughts.

{text}"""

        try:
            response = requests.post(OLLAMA_URL, json={
                "model": MISTRAL_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.5, "top_p": 0.9}
            }, timeout=120)
            
            if response.status_code == 200:
                result = response.json()
                summary = result.get('response', '').strip()
                if summary:
                    duration = round(time.perf_counter() - start_time, 3)
                    self.last_summary_details.update({
                        "generated": True,
                        "reason": "",
                        "duration": duration,
                        "original_words": total_words,
                        "summary_words": len(summary.split()),
                        "model": "mistral:7b"
                    })
                    print(f"✅ Summary generated: {len(summary.split())} words in {duration}s", file=sys.stderr)
                    return summary
                else:
                    self.last_summary_details["reason"] = "empty_response"
                    return ""
            else:
                print(f"❌ Ollama error: {response.status_code}", file=sys.stderr)
                self.last_summary_details["reason"] = f"ollama_error_{response.status_code}"
                return ""
        except Exception as exc:
            error_msg = f"generation_error:{type(exc).__name__}"
            print(f"❌ Summary generation failed: {type(exc).__name__}", file=sys.stderr)
            print(f"   Error details: {str(exc)[:200]}", file=sys.stderr)
            self.last_summary_details["reason"] = error_msg
            self.last_summary_details["duration"] = round(time.perf_counter() - start_time, 3)
            self.last_summary_details["error_detail"] = str(exc)[:500]
            return ""
    
    def calculate_target_summary_words(self, input_words):
        """Calculate target summary length based on input"""
        if input_words <= 500:
            return 80
        elif input_words <= 1000:
            return 120
        elif input_words <= 2000:
            return 200
        elif input_words <= 3000:
            return 300
        else:
            return 400
    
    def enhance_text_with_ai(self, text):
        """Use Mistral to semantically clean OCR text - remove artifacts, watermarks, duplicates while preserving structure"""
        if not self.ollama_available:
            print("⚠️  Ollama unavailable, skipping AI enhancement", file=sys.stderr)
            return text
        
        if not text or len(text.strip()) < 50:
            return text
        
        start_time = time.perf_counter()
        total_words = len(text.split())
        print(f"🔧 AI Enhancement starting: {total_words} words", file=sys.stderr)
        
        # For very long text, process in chunks
        max_input_words = 4000
        if total_words > max_input_words:
            text = " ".join(text.split()[:max_input_words])
            print(f"✂️  Trimmed to {max_input_words} words for enhancement", file=sys.stderr)
        
        prompt = f"""You are an expert text restoration specialist. Your task is to clean and restore OCR-extracted text by removing artifacts while preserving the original content and structure.

INSTRUCTIONS:
- Remove watermarks, repeated junk text, page numbers, headers/footers that don't belong to the main content
- Remove OCR artifacts like random characters, broken formatting, duplicate lines
- Fix broken words and spacing issues
- Restore what the OCR intended to capture
- DO NOT summarize, rewrite, or change the meaning
- DO NOT change the order of sentences or paragraphs
- DO NOT add new information
- Keep all important content, just clean up the noise

Input text:
{text}

Cleaned text:"""

        try:
            response = requests.post(OLLAMA_URL, json={
                "model": MISTRAL_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3, "top_p": 0.9}
            }, timeout=180)
            
            if response.status_code == 200:
                result = response.json()
                enhanced = result.get('response', '').strip()
                if enhanced:
                    duration = round(time.perf_counter() - start_time, 3)
                    print(f"✅ AI Enhancement complete: {len(enhanced.split())} words in {duration}s", file=sys.stderr)
                    return enhanced
                else:
                    print(f"⚠️  Empty AI enhancement response, returning original", file=sys.stderr)
                    return text
            else:
                print(f"❌ Ollama enhancement error: {response.status_code}", file=sys.stderr)
                return text
        except Exception as exc:
            print(f"❌ AI Enhancement failed: {type(exc).__name__}", file=sys.stderr)
            return text

    def detect_document_type(self, pdf_path):
        """Detect if PDF is academic/mathematical, handwritten, or standard"""
        try:
            # Quick scan of first few pages
            with pdfplumber.open(pdf_path) as pdf:
                sample_text = ""
                for page in pdf.pages[:3]:  # Check first 3 pages
                    text = page.extract_text() or ''
                    sample_text += text
                
                # Check for academic/mathematical indicators
                math_indicators = ['equation', 'theorem', 'proof', 'lemma', 'formula', 
                                 'integral', 'derivative', 'matrix', 'coefficient']
                academic_score = sum(1 for indicator in math_indicators 
                                   if indicator in sample_text.lower())
                
                # Check if native text extraction worked well
                words = sample_text.split()
                has_native_text = len(words) > 50
                
                # Determine document type
                if academic_score >= 2 and self.nougat_model:
                    return "academic"  # Use Nougat
                elif not has_native_text:
                    return "handwritten"  # Use TrOCR
                else:
                    return "standard"  # Use current pipeline
        except:
            return "standard"
    
    def process_with_nougat(self, pdf_path):
        """Process academic PDF with Nougat for better math/formula extraction"""
        try:
            from pdf2image import convert_from_path
            import cv2
            
            # Try multiple common poppler locations
            poppler_paths = [
                r'C:\Coding\poppler-25.12.0\Library\bin',
                r'C:\poppler\Library\bin',
                r'C:\Coding\Mics\poppler-25.07.0\Library\bin',
                None  # Try system PATH
            ]
            
            pages = None
            for poppler_path in poppler_paths:
                try:
                    pages = convert_from_path(pdf_path, dpi=300, poppler_path=poppler_path)
                    break
                except Exception:
                    continue
            
            if not pages:
                raise Exception("Could not convert PDF - check Poppler installation")
            extracted_texts = []
            
            for i, page_img in enumerate(pages[:10]):  # Limit to first 10 pages for speed
                # Preprocess image
                img_array = np.array(page_img)
                img_gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
                _, img_thresh = cv2.threshold(img_gray, 150, 255, cv2.THRESH_BINARY)
                img_rgb = cv2.cvtColor(img_thresh, cv2.COLOR_GRAY2RGB)
                pil_img = Image.fromarray(img_rgb)
                
                # Run Nougat
                pixel_values = self.nougat_processor(images=pil_img, return_tensors="pt").pixel_values
                if torch.cuda.is_available():
                    pixel_values = pixel_values.to('cuda')
                
                generated_ids = self.nougat_model.generate(pixel_values)
                text = self.nougat_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                
                if text.strip():
                    extracted_texts.append(f"--- Page {i+1} ---\n{text}")
            
            return "\n\n".join(extracted_texts)
        except Exception as e:
            print(f"⚠️  Nougat processing failed: {e}, falling back to standard OCR", file=sys.stderr)
            return None
    
    def process_with_trocr(self, image):
        """Process handwritten text with TrOCR"""
        try:
            if not self.trocr_model or not self.trocr_processor:
                return None
            
            # Prepare image
            if isinstance(image, np.ndarray):
                image = Image.fromarray(image)
            
            pixel_values = self.trocr_processor(images=image, return_tensors="pt").pixel_values
            if torch.cuda.is_available():
                pixel_values = pixel_values.to('cuda')
            
            generated_ids = self.trocr_model.generate(pixel_values)
            text = self.trocr_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            
            return text.strip()
        except Exception as e:
            print(f"⚠️  TrOCR failed: {e}", file=sys.stderr)
            return None
    
    def process_file(self, file_path, user_id=None):
        """Main processing pipeline for frontend integration"""
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")
            
            # Process based on file type
            file_ext = os.path.splitext(file_path)[1].lower()
            
            if file_ext == '.pdf':
                result = self.process_pdf(file_path)
            elif file_ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
                result = self.process_image(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_ext}")
            
            # Analyze content
            all_text = result['extracted_text']
            analysis = self.analyze_content(all_text)
            
            print(f"\n🤖 AI ANALYSIS STARTING", file=sys.stderr)
            print(f"{'='*60}", file=sys.stderr)
            
            # Generate AI enhanced text (semantic cleaning)
            ai_enhanced_text = self.enhance_text_with_ai(all_text)
            
            # Generate summary
            summary_text = self.summarize_text(all_text)
            summary_details = getattr(self, "last_summary_details", {})
            
            if summary_text:
                analysis["summary"] = summary_text
                analysis["summary_model"] = "mistral:7b"
                print(f"✅ Summary generated: {len(summary_text.split())} words", file=sys.stderr)
                print(f"📊 Model: Mistral 7B ({summary_details.get('strategy', 'unknown').upper()})", file=sys.stderr)
            else:
                print(f"⚠️  No summary generated: {summary_details.get('reason', 'unknown')}", file=sys.stderr)
            if summary_details:
                analysis["summary_details"] = summary_details
            
            # Create Firebase-ready JSON structure (Firebase will add timestamp and ID)
            firebase_data = {
                "user_id": user_id or "anonymous",
                "file_info": {
                    "original_name": os.path.basename(file_path),
                    "file_type": file_ext,
                    "file_size": os.path.getsize(file_path),
                    "processing_method": result['processing_method']
                },
                "extraction_results": {
                    "raw_text": result['raw_text'],
                    "corrected_text": result['corrected_text'],
                    "extracted_text": all_text,
                    "ai_enhanced_text": ai_enhanced_text,
                    "pages_processed": result['pages_processed'],
                    "images_processed": result['images_processed']
                },
                "ai_analysis": analysis,
                "processing_metadata": {
                    "nltk_available": self.nltk_available,
                    "processing_time": result.get('processing_time', 0),
                    "corrections_applied": result.get('corrections_applied', 0),
                    "summary_time": summary_details.get('duration', 0.0),
                    "summary_strategy": summary_details.get('strategy'),
                    "summary_chunks": summary_details.get('chunks', 0),
                    "summary_trimmed_words": summary_details.get('trimmed_words', 0),
                    "summary_generated": summary_details.get('generated', False),
                    "summary_reason": summary_details.get('reason', "")
                }
            }
            
            return firebase_data
            
        except Exception as e:
            # Return error structure for Firebase
            return {
                "user_id": user_id or "anonymous",
                "error": True,
                "error_message": str(e),
                "file_info": {
                    "original_name": os.path.basename(file_path) if os.path.exists(file_path) else "unknown",
                    "file_type": "unknown",
                    "processing_method": "failed"
                }
            }
    
    def process_pdf(self, pdf_path):
        """Process PDF file with intelligent routing to best OCR method"""
        start_time = datetime.now()
        
        # Detect document type and route to appropriate processor
        doc_type = self.detect_document_type(pdf_path)
        print(f"\n{'='*60}", file=sys.stderr)
        print(f"📄 DOCUMENT PROCESSING STARTED", file=sys.stderr)
        print(f"{'='*60}", file=sys.stderr)
        print(f"📋 Document type detected: {doc_type.upper()}", file=sys.stderr)
        
        # Try academic processing with Nougat
        if doc_type == "academic" and self.nougat_model:
            print(f"🎓 Using: NOUGAT (Academic PDF processor)", file=sys.stderr)
            print(f"📊 Features: LaTeX formulas, tables, academic structure", file=sys.stderr)
            nougat_text = self.process_with_nougat(pdf_path)
            if nougat_text:
                processing_time = (datetime.now() - start_time).total_seconds()
                print(f"✅ Nougat processing complete: {processing_time:.2f}s", file=sys.stderr)
                return {
                    "processing_method": "nougat_academic",
                    "extracted_text": nougat_text,
                    "raw_text": nougat_text,
                    "corrected_text": nougat_text,
                    "pages_processed": len(nougat_text.split("---")),
                    "images_processed": 0,
                    "processing_time": round(processing_time, 2),
                    "corrections_applied": 0
                }
        
        # Standard hybrid processing
        print(f"🔧 Using: HYBRID PIPELINE (PyMuPDF + Tesseract)", file=sys.stderr)
        print(f"📊 Features: Fast text extraction, OCR for images, NLTK cleanup", file=sys.stderr)
        text_blocks = []
        image_blocks = []
        raw_texts = []
        corrected_texts = []
        corrections_count = 0
        
        # Extract native text with pdfplumber
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    text = page.extract_text() or ''
                    if text.strip():
                        # Process normal text with NLTK cleaning
                        cleaned_text = self.process_normal_text(text)
                        text_blocks.append({
                            "page": page_num,
                            "type": "native_text",
                            "content": cleaned_text
                        })
        except Exception as e:
            raise Exception(f"Error with pdfplumber: {e}")
        
        # Extract and OCR images
        try:
            pdf_doc = fitz.open(pdf_path)
            for page_num in range(len(pdf_doc)):
                page = pdf_doc[page_num]
                page_num += 1  # Make it 1-indexed
                images = page.get_images(full=True)
                for img_idx, img_info in enumerate(images, 1):
                    try:
                        xref = img_info[0]
                        base_img = pdf_doc.extract_image(xref)
                        image_bytes = base_img["image"]
                        
                        # Process image
                        pil_img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
                        pil_img = ImageEnhance.Contrast(pil_img).enhance(1.5)
                        pil_img = ImageEnhance.Sharpness(pil_img).enhance(2.0)
                        
                        img_cv = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
                        
                        # Try TrOCR for handwritten-looking content
                        if doc_type == "handwritten" and self.trocr_model:
                            raw_text = self.process_with_trocr(pil_img) or ""
                            if not raw_text:  # Fallback to Tesseract
                                raw_text = pytesseract.image_to_string(img_cv, config='--oem 3 --psm 6 -l eng').strip()
                        else:
                            raw_text = pytesseract.image_to_string(img_cv, config='--oem 3 --psm 6 -l eng').strip()
                        
                        if raw_text:
                            corrected_text = self.correct_text(raw_text)
                            corrections_count += len(raw_text.split()) - len(corrected_text.split())
                            
                            raw_texts.append(raw_text)
                            corrected_texts.append(corrected_text)
                            
                            image_blocks.append({
                                "page": page_num,
                                "image": img_idx,
                                "type": "ocr_text",
                                "raw_content": raw_text,
                                "corrected_content": corrected_text
                            })
                    except Exception:
                        continue
            pdf_doc.close()
        except Exception as e:
            raise Exception(f"Error with image processing: {e}")
        
        # Combine all text
        all_text_parts = []
        for block in text_blocks:
            all_text_parts.append(block['content'])
        for block in image_blocks:
            all_text_parts.append(block['corrected_content'])
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        print(f"\n✅ OCR COMPLETE", file=sys.stderr)
        print(f"⏱️  Processing time: {processing_time:.2f}s", file=sys.stderr)
        print(f"📄 Pages processed: {len(set([b['page'] for b in text_blocks + image_blocks]))}", file=sys.stderr)
        print(f"🖼️  Images processed: {len(image_blocks)}", file=sys.stderr)
        print(f"📝 Words extracted: {len(''.join(all_text_parts).split())}", file=sys.stderr)
        print(f"{'='*60}\n", file=sys.stderr)
        
        return {
            "processing_method": "hybrid_pdf",
            "extracted_text": "\n\n".join(all_text_parts),
            "raw_text": "\n\n".join(raw_texts),
            "corrected_text": "\n\n".join(corrected_texts),
            "pages_processed": len(set([b['page'] for b in text_blocks + image_blocks])),
            "images_processed": len(image_blocks),
            "processing_time": round(processing_time, 2),
            "corrections_applied": abs(corrections_count),
            "detailed_blocks": text_blocks + image_blocks
        }
    
    def process_image(self, image_path):
        """Process single image file"""
        start_time = datetime.now()
        
        try:
            # Load and enhance image
            pil_img = Image.open(image_path).convert('RGB')
            pil_img = ImageEnhance.Contrast(pil_img).enhance(1.5)
            pil_img = ImageEnhance.Sharpness(pil_img).enhance(2.0)
            
            # Convert to OpenCV format
            img_cv = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            
            # OCR
            raw_text = pytesseract.image_to_string(img_cv, config='--oem 3 --psm 6 -l eng').strip()
            corrected_text = self.correct_text(raw_text) if raw_text else ""
            
            processing_time = (datetime.now() - start_time).total_seconds()
            corrections_count = len(raw_text.split()) - len(corrected_text.split()) if raw_text and corrected_text else 0
            
            return {
                "processing_method": "image_ocr",
                "extracted_text": corrected_text,
                "raw_text": raw_text,
                "corrected_text": corrected_text,
                "pages_processed": 1,
                "images_processed": 1,
                "processing_time": round(processing_time, 2),
                "corrections_applied": abs(corrections_count)
            }
        except Exception as e:
            raise Exception(f"Error processing image: {e}")

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python ocr_wrapper.py <file_path>'
        }))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(json.dumps({
            'success': False,
            'error': f'File not found: {file_path}'
        }))
        sys.exit(1)
    
    try:
        # Initialize OCR pipeline
        ocr = OCRPipeline()
        
        # Process the file
        result = ocr.process_file(file_path)
        
        # Check if processing failed
        if result.get('error'):
            response = {
                'success': False,
                'error': result.get('error_message', 'Unknown processing error')
            }
        else:
            # Format response for frontend
            extracted_text = result.get('extraction_results', {}).get('extracted_text', '')
            raw_text = result.get('extraction_results', {}).get('raw_text', '')
            corrected_text = result.get('extraction_results', {}).get('corrected_text', '')
            ai_enhanced_text = result.get('extraction_results', {}).get('ai_enhanced_text', '')
            ai_analysis = result.get('ai_analysis', {})
            
            response = {
                'success': True,
                'finalExtractedText': extracted_text,
                'originalOcrOutput': raw_text,
                'enhancedTextNltk': corrected_text,
                'aiEnhancedText': ai_enhanced_text,
                'wordCount': ai_analysis.get('word_count', len(extracted_text.split())),
                'readingTime': ai_analysis.get('estimated_reading_time', max(1, len(extracted_text.split()) // 200)),
                'qualityScore': ai_analysis.get('quality_score', ai_analysis.get('confidence_score', 0.85)),  # Use new quality_score, fallback to old confidence
                'quality_score': ai_analysis.get('quality_score', 0.85),  # New field
                'confidenceScore': ai_analysis.get('quality_score', ai_analysis.get('confidence_score', 0.85)),  # Legacy support
                'concepts': ai_analysis.get('concepts', []),
                'keyTopics': ai_analysis.get('key_topics', []),
                'difficulty': ai_analysis.get('difficulty', 'Intermediate'),
                'summary': ai_analysis.get('summary', ''),
                'summaryDetails': ai_analysis.get('summary_details', {}),
                'summaryTime': result.get('processing_metadata', {}).get('summary_time', 0.0),
                'processingMetadata': result.get('processing_metadata', {}),
                'fileInfo': result.get('extraction_results', {})
            }
        
        print(json.dumps(response))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()