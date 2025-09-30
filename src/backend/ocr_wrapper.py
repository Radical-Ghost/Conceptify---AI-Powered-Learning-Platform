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

# Core dependencies
required_imports = [
    ("pdfplumber", "pdfplumber"),
    ("fitz", "PyMuPDF"),
    ("pytesseract", "pytesseract"),
    ("cv2", "opencv-python"),
    ("numpy", "numpy"),
    ("PIL", "Pillow"),
    ("nltk", "nltk"),
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
DEPS_AVAILABLE = True
class OCRPipeline:
    def __init__(self):
        self.setup_nltk()
        self.english_words, self.word_freq, self.stop_words = self.create_dict()
        
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
                "confidence_score": 0.0
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
                        and word not in self.stop_words]
                noun_freq = Counter(nouns)
                concepts = [word.title() for word, freq in noun_freq.most_common(8) if freq > 1]
                
                # Extract proper nouns as key topics
                proper_nouns = [word for word, pos in pos_tags 
                              if pos == 'NNP' and len(word) > 2]
                key_topics = list(set(proper_nouns))[:5]
                
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
        
        # Confidence score based on text quality
        confidence_score = min(1.0, max(0.1, (word_count / 100) * 0.8 + (len(concepts) / 10) * 0.2))
        
        return {
            "concepts": concepts,
            "difficulty": difficulty,
            "word_count": word_count,
            "estimated_reading_time": reading_time,
            "key_topics": key_topics,
            "confidence_score": round(confidence_score, 2)
        }
    
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
                    "pages_processed": result['pages_processed'],
                    "images_processed": result['images_processed']
                },
                "ai_analysis": analysis,
                "processing_metadata": {
                    "nltk_available": self.nltk_available,
                    "processing_time": result.get('processing_time', 0),
                    "corrections_applied": result.get('corrections_applied', 0)
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
        """Process PDF file with hybrid approach"""
        start_time = datetime.now()
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
            ai_analysis = result.get('ai_analysis', {})
            
            response = {
                'success': True,
                'finalExtractedText': extracted_text,
                'originalOcrOutput': raw_text,
                'enhancedTextNltk': corrected_text,
                'wordCount': ai_analysis.get('word_count', len(extracted_text.split())),
                'readingTime': ai_analysis.get('estimated_reading_time', max(1, len(extracted_text.split()) // 200)),
                'confidenceScore': ai_analysis.get('confidence_score', 0.85),
                'concepts': ai_analysis.get('concepts', []),
                'keyTopics': ai_analysis.get('key_topics', []),
                'difficulty': ai_analysis.get('difficulty', 'Intermediate'),
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