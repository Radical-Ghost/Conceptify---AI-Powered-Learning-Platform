#!/usr/bin/env python3
"""
Test BART summarization with GPU
"""
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def test_summarization():
    print("🧪 Testing BART Summarization")
    print("=" * 60)
    print()
    
    try:
        from src.backend.ocr_wrapper import OCRPipeline
        
        print("1️⃣ Initializing OCR Pipeline...")
        ocr = OCRPipeline()
        print("   ✅ Pipeline initialized")
        print()
        
        if not ocr.summarizer:
            print("❌ Summarizer not loaded")
            return False
        
        model_name = getattr(ocr, 'summarizer_model_name', 'unknown')
        print(f"2️⃣ Model: {model_name}")
        print(f"   Strategy: {ocr.summarizer_strategy.upper()}")
        print()
        
        # Test text from your PDF
        test_text = """
Experiment-07 Roll No: A3-754 Aim: To study and implement the Random Forest algorithm 
for classification & regression tasks in ML Theory: Random Forest is an ensemble learning 
technique that combines multiple decision trees to produce a more accurate and robust model. 
It reduces overfitting and improves generalization compared to a single decision tree. 
It is a supervised machine learning algorithm that builds multiple decision trees and merges 
them to get a more accurate and stable prediction. It can be used for both classification 
and regression tasks. Importance: Handles high-dimensional data efficiently. Reduces 
overfitting by averaging multiple trees. Works well with large datasets and maintains 
accuracy even if a large portion of data is missing.
"""
        
        print("3️⃣ Testing summarization...")
        print(f"   Input: {len(test_text.split())} words")
        print()
        
        summary = ocr.summarize_text(test_text)
        details = ocr.last_summary_details
        
        print("4️⃣ Results:")
        print("=" * 60)
        
        if summary:
            print("✅ Summary Generated Successfully!")
            print()
            print(f"📝 Summary ({len(summary.split())} words):")
            print("-" * 60)
            print(summary)
            print("-" * 60)
            print()
            print(f"⏱️  Time: {details.get('duration', 0):.2f}s")
            print(f"📊 Strategy: {details.get('strategy', 'unknown').upper()}")
            print(f"📦 Chunks: {details.get('chunks', 0)}")
            return True
        else:
            print("❌ Summary Generation Failed")
            print()
            print(f"Reason: {details.get('reason', 'unknown')}")
            print(f"Strategy: {details.get('strategy', 'unknown')}")
            print(f"Duration: {details.get('duration', 0):.2f}s")
            if 'error_detail' in details:
                print(f"Error: {details['error_detail'][:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    try:
        success = test_summarization()
        print()
        print("=" * 60)
        if success:
            print("🎉 Summarization test PASSED!")
        else:
            print("⚠️  Summarization test FAILED")
        print("=" * 60)
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️  Test interrupted")
        sys.exit(1)
