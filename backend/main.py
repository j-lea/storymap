from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run")
async def create_run(
    run_type: str = Form(...),
    universe: str = Form(...),
    gpx_file: UploadFile = File(None)
):
    logger.info(f"Run type received: {run_type}, Universe: {universe}")

    filename = None
    if gpx_file and gpx_file.filename:
        filename = gpx_file.filename
        logger.info(f"GPX file received: {filename} (size: {gpx_file.size if hasattr(gpx_file, 'size') else 'unknown'})")
        # Read the file content (you can save it or process it here)
        # content = await gpx_file.read()

    return {
        "status": "success",
        "run_type": run_type,
        "universe": universe,
        "filename": filename
    }

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running"}
