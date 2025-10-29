from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import logging
import base64
from typing import Optional

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

# In-memory storage for runs
stored_run: Optional[dict] = None

@app.post("/run")
async def create_run(
    run_type: str = Form(...),
    universe: str = Form(...),
    gpx_file: UploadFile = File(None)
):
    global stored_run

    logger.info(f"Run type received: {run_type}, Universe: {universe}")

    filename = None
    file_data = None

    if gpx_file and gpx_file.filename:
        filename = gpx_file.filename
        content = await gpx_file.read()
        # Encode file content as base64 for storage/transmission
        file_data = base64.b64encode(content).decode('utf-8')
        logger.info(f"GPX file received: {filename} (size: {len(content)} bytes)")

    # Store the run in memory
    stored_run = {
        "run_type": run_type,
        "universe": universe,
        "filename": filename,
        "file_data": file_data
    }

    return {
        "status": "success",
        "run_type": run_type,
        "universe": universe,
        "filename": filename
    }

@app.get("/run")
async def get_run():
    global stored_run

    if stored_run is None:
        return {
            "status": "not_found",
            "message": "No run has been submitted yet"
        }

    return {
        "status": "success",
        "run_type": stored_run["run_type"],
        "universe": stored_run["universe"],
        "filename": stored_run["filename"],
        "file_data": stored_run["file_data"]
    }

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running"}
