#!/usr/bin/env python3
"""
Test script for advanced OCR features
Verifies all models load correctly
"""
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def test_models():
    print("🧪 Testing Advanced OCR Models")
    print("=" * 50)
    print()
    
    # Test imports
    print("1️⃣ Testing imports...")
    try:
        from src.backend.ocr_wrapper import OCRPipeline
        print("   ✅ OCRPipeline imported successfully")
    except Exception as e:
        print(f"   ❌ Failed to import: {e}")
        return False
    
    print()
    
    # Initialize pipeline
    print("2️⃣ Initializing OCR Pipeline...")
    try:
        ocr = OCRPipeline()
        print("   ✅ Pipeline initialized")
    except Exception as e:
        print(f"   ❌ Initialization failed: {e}")
        return False
    
    print()
    
    # Check models
    print("3️⃣ Checking model availability...")
    
    # BART Summarizer
    if ocr.summarizer:
        print("   ✅ BART summarizer: LOADED")
        print(f"      Strategy: {ocr.summarizer_strategy}")
    else:
        print("   ❌ BART summarizer: NOT LOADED")
    
    # Nougat
    if ocr.nougat_model and ocr.nougat_processor:
        print("   ✅ Nougat (academic): LOADED")
    else:
        print("   ⚠️  Nougat (academic): NOT LOADED (optional)")
    
    # TrOCR
    if ocr.trocr_model and ocr.trocr_processor:
        print("   ✅ TrOCR (handwritten): LOADED")
    else:
        print("   ⚠️  TrOCR (handwritten): NOT LOADED (optional)")
    
    # NLTK
    if ocr.nltk_available:
        print("   ✅ NLTK: AVAILABLE")
    else:
        print("   ⚠️  NLTK: NOT AVAILABLE")
    
    print()
    
    # Test GPU
    print("4️⃣ GPU Status...")
    try:
        import torch
        if torch.cuda.is_available():
            print(f"   ✅ GPU: {torch.cuda.get_device_name(0)}")
            print(f"      VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
        else:
            print("   ⚠️  GPU: Not available (CPU mode)")
    except Exception as e:
        print(f"   ❌ Error checking GPU: {e}")
    
    print()
    
    # Test document detection
    print("5️⃣ Testing document type detection...")
    test_pdf = "OCR/Tests files/MC test.pdf"
    if os.path.exists(test_pdf):
        try:
            doc_type = ocr.detect_document_type(test_pdf)
            print(f"   ✅ Test PDF detected as: {doc_type}")
        except Exception as e:
            print(f"   ❌ Detection failed: {e}")
    else:
        print(f"   ⚠️  Test PDF not found: {test_pdf}")
    
    print()
    print("=" * 50)
    print("🎉 Model check complete!")
    print()
    
    # Summary
    models_loaded = []
    models_missing = []
    
    if ocr.summarizer:
        models_loaded.append("BART (summarization)")
    else:
        models_missing.append("BART (summarization)")
        
    if ocr.nougat_model:
        models_loaded.append("Nougat (academic)")
    else:
        models_missing.append("Nougat (academic)")
        
    if ocr.trocr_model:
        models_loaded.append("TrOCR (handwritten)")
    else:
        models_missing.append("TrOCR (handwritten)")
    
    print("📊 Summary:")
    print(f"   ✅ Loaded: {len(models_loaded)} models")
    for model in models_loaded:
        print(f"      - {model}")
    
    if models_missing:
        print(f"   ⚠️  Missing: {len(models_missing)} models (optional)")
        for model in models_missing:
            print(f"      - {model}")
    
    print()
    
    # Recommendations
    if not ocr.nougat_model:
        print("💡 Tip: Download Nougat for better academic PDF processing")
    if not ocr.trocr_model:
        print("💡 Tip: Download TrOCR for handwritten text recognition")
    if not torch.cuda.is_available():
        print("💡 Tip: Use GPU for faster processing")
    
    return True

if __name__ == "__main__":
    try:
        success = test_models()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️  Test interrupted")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
