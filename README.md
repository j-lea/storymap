# Storymap - Run Selector App

A simple single-page React application with a FastAPI backend for selecting run types.

## Project Structure

```
storymap/
├── backend/          # FastAPI backend
│   ├── main.py      # API server with /run endpoint
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   │   ├── App.js   # Main component with run type selector
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Usage

1. Start both the backend and frontend servers (see Setup Instructions above)
2. Open `http://localhost:3000` in your browser
3. Select a run type (Easy, Interval, or Tempo) using the radio buttons
4. Click the "Submit" button
5. The selected run type will be posted to the `/run` endpoint and logged in the backend console

## Features

- Clean, modern UI with centered form
- Three run type options: Easy, Interval, Tempo
- Submit button that sends POST request to FastAPI backend
- Backend logs run type to console
- Success message displayed after submission
