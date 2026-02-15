from fastapi import FastAPI
import traceback
import sys
import os

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok", "service": "diagnostic-mode"}

@app.get("/diagnose")
def diagnose_import():
    """Attempt to import the main application and report content/errors."""
    results = {}
    
    # 1. Check System Deps (optional, e.g. libGL)
    # We can't easy check libs, but we can check env
    results["env"] = dict(os.environ)
    results["sys_path"] = sys.path
    
    # 2. Try importing main module
    try:
        import src.api
        results["import_src_api"] = "SUCCESS"
    except Exception:
        results["import_src_api"] = "FAILED"
        results["traceback"] = traceback.format_exc()
        
    return results
