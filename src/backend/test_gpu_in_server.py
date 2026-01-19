"""
Quick test to verify GPU is available when server calls Python
Run this to simulate what the server does
"""
import sys
import torch

print("=" * 60, file=sys.stderr)
print("🧪 GPU Test for Server", file=sys.stderr)
print("=" * 60, file=sys.stderr)

# Check PyTorch version
print(f"🐍 Python: {sys.executable}", file=sys.stderr)
print(f"📦 PyTorch: {torch.__version__}", file=sys.stderr)

# Check CUDA
if torch.cuda.is_available():
    print(f"✅ CUDA Available: True", file=sys.stderr)
    print(f"✅ CUDA Version: {torch.version.cuda}", file=sys.stderr)
    print(f"✅ GPU: {torch.cuda.get_device_name(0)}", file=sys.stderr)
    print(f"✅ GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB", file=sys.stderr)
    
    # Test GPU computation
    x = torch.randn(100, 100).cuda()
    y = x @ x.T
    print(f"✅ GPU computation test: PASSED", file=sys.stderr)
else:
    print(f"❌ CUDA Available: False", file=sys.stderr)
    print(f"⚠️  GPU will NOT be used!", file=sys.stderr)

print("=" * 60, file=sys.stderr)

# Return JSON for server (to stdout)
import json
result = {
    "gpu_available": torch.cuda.is_available(),
    "pytorch_version": torch.__version__,
    "cuda_version": torch.version.cuda if torch.cuda.is_available() else None,
    "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
}
print(json.dumps(result))
