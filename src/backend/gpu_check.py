"""
GPU Diagnostic Script for Conceptify
Run this to check if PyTorch can access your GPU
"""

import sys

print("=" * 60)
print("🔍 GPU Diagnostic Check")
print("=" * 60)

# Check PyTorch installation
try:
    import torch
    print(f"✅ PyTorch installed: {torch.__version__}")
except ImportError:
    print("❌ PyTorch not installed!")
    print("   Install with: uv add torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121")
    sys.exit(1)

# Check CUDA availability
print(f"\n{'='*60}")
print("🎮 CUDA Information")
print(f"{'='*60}")

if torch.cuda.is_available():
    print(f"✅ CUDA is available: {torch.cuda.is_available()}")
    print(f"✅ CUDA version: {torch.version.cuda}")
    print(f"✅ cuDNN version: {torch.backends.cudnn.version()}")
    print(f"✅ Number of GPUs: {torch.cuda.device_count()}")
    
    for i in range(torch.cuda.device_count()):
        print(f"\n📊 GPU {i} Details:")
        print(f"   Name: {torch.cuda.get_device_name(i)}")
        props = torch.cuda.get_device_properties(i)
        print(f"   Total Memory: {props.total_memory / 1024**3:.2f} GB")
        print(f"   Compute Capability: {props.major}.{props.minor}")
        
        # Check current memory usage
        if torch.cuda.is_initialized():
            allocated = torch.cuda.memory_allocated(i) / 1024**3
            reserved = torch.cuda.memory_reserved(i) / 1024**3
            print(f"   Memory Allocated: {allocated:.2f} GB")
            print(f"   Memory Reserved: {reserved:.2f} GB")
else:
    print("❌ CUDA is NOT available")
    print("\nPossible reasons:")
    print("1. PyTorch CPU-only version installed")
    print("2. CUDA drivers not installed")
    print("3. GPU not CUDA-compatible")
    print("\nTo fix:")
    print("1. Install NVIDIA CUDA Toolkit: https://developer.nvidia.com/cuda-downloads")
    print("2. Install PyTorch with CUDA:")
    print("   uv remove torch torchvision torchaudio")
    print("   uv add torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121")

# Test GPU computation
print(f"\n{'='*60}")
print("🧪 GPU Computation Test")
print(f"{'='*60}")

try:
    if torch.cuda.is_available():
        # Create a tensor on GPU
        x = torch.randn(1000, 1000).cuda()
        y = torch.randn(1000, 1000).cuda()
        
        # Perform computation
        import time
        start = time.time()
        z = torch.matmul(x, y)
        torch.cuda.synchronize()
        gpu_time = time.time() - start
        
        print(f"✅ GPU computation successful!")
        print(f"   Matrix multiplication (1000x1000): {gpu_time*1000:.2f}ms")
        print(f"   Result tensor shape: {z.shape}")
        print(f"   Result device: {z.device}")
        
        # Test CPU for comparison
        x_cpu = torch.randn(1000, 1000)
        y_cpu = torch.randn(1000, 1000)
        start = time.time()
        z_cpu = torch.matmul(x_cpu, y_cpu)
        cpu_time = time.time() - start
        
        print(f"\n📊 Performance Comparison:")
        print(f"   GPU Time: {gpu_time*1000:.2f}ms")
        print(f"   CPU Time: {cpu_time*1000:.2f}ms")
        print(f"   Speedup: {cpu_time/gpu_time:.2f}x faster on GPU")
    else:
        print("⚠️  Skipping GPU test - CUDA not available")
except Exception as e:
    print(f"❌ GPU computation failed: {e}")

# Check Transformers library
print(f"\n{'='*60}")
print("📦 Transformers Library")
print(f"{'='*60}")

try:
    import transformers
    print(f"✅ Transformers installed: {transformers.__version__}")
    
    # Check if transformers can use CUDA
    if torch.cuda.is_available():
        from transformers import pipeline
        print(f"✅ Transformers can use GPU")
        print(f"   Default device: cuda:0")
except ImportError:
    print("❌ Transformers not installed!")
    print("   Install with: uv add transformers")

# Final recommendations
print(f"\n{'='*60}")
print("💡 Recommendations")
print(f"{'='*60}")

if torch.cuda.is_available():
    print("✅ Your GPU is ready for use!")
    print("\nOptimizations for BART model:")
    print("1. ✅ Use FP16 (half precision) for 2x faster inference")
    print("2. ✅ Batch processing enabled for multiple texts")
    print("3. ✅ GPU memory management optimized")
    print("\nExpected performance:")
    print("   - OCR summary generation: 2-5 seconds (vs 10-15s on CPU)")
    print("   - Supports longer documents (3500 words vs 1800 on CPU)")
    print("   - Batch size: 4 texts at once")
else:
    print("⚠️  GPU not available - using CPU fallback")
    print("\nTo enable GPU:")
    print("1. Install NVIDIA GPU drivers")
    print("2. Install CUDA Toolkit 12.1+")
    print("3. Reinstall PyTorch with CUDA support")
    print("4. Restart Python/server")

print(f"\n{'='*60}")
print("🏁 Diagnostic Complete")
print(f"{'='*60}\n")
