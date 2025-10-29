import React, { useState } from 'react';
import './App.css';

function App() {
  const [runType, setRunType] = useState('easy');
  const [universe, setUniverse] = useState('game of thrones');
  const [gpxFile, setGpxFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('run_type', runType);
      formData.append('universe', universe);
      if (gpxFile) {
        formData.append('gpx_file', gpxFile);
      }

      const response = await fetch('http://localhost:8000/run', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const fileMessage = data.filename ? ` with file "${data.filename}"` : '';
        setMessage(`Success! Run type "${data.run_type}" and universe "${data.universe}" submitted${fileMessage}.`);
      } else {
        setMessage('Error submitting form. Please try again.');
      }
    } catch (error) {
      setMessage('Error connecting to server. Make sure the backend is running.');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Select your run</h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="run-form">
          <div className="form-section">
            <h2 className="section-header">Select your type of run</h2>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="easy"
                  checked={runType === 'easy'}
                  onChange={(e) => setRunType(e.target.value)}
                />
                Easy
              </label>
              <label>
                <input
                  type="radio"
                  value="interval"
                  checked={runType === 'interval'}
                  onChange={(e) => setRunType(e.target.value)}
                />
                Interval
              </label>
              <label>
                <input
                  type="radio"
                  value="tempo"
                  checked={runType === 'tempo'}
                  onChange={(e) => setRunType(e.target.value)}
                />
                Tempo
              </label>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-header">Select your universe</h2>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="game of thrones"
                  checked={universe === 'game of thrones'}
                  onChange={(e) => setUniverse(e.target.value)}
                />
                Game of Thrones
              </label>
              <label>
                <input
                  type="radio"
                  value="harry potter"
                  checked={universe === 'harry potter'}
                  onChange={(e) => setUniverse(e.target.value)}
                />
                Harry Potter
              </label>
              <label>
                <input
                  type="radio"
                  value="bladerunner"
                  checked={universe === 'bladerunner'}
                  onChange={(e) => setUniverse(e.target.value)}
                />
                Blade Runner
              </label>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-header">Upload GPX/FIT file</h2>
            <div className="file-input-group">
              <input
                type="file"
                id="gpx-file"
                accept=".gpx,.fit"
                onChange={(e) => setGpxFile(e.target.files[0] || null)}
                className="file-input"
              />
              <label htmlFor="gpx-file" className="file-input-label">
                {gpxFile ? gpxFile.name : 'Choose GPX or FIT file...'}
              </label>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="submit-button">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      </main>
    </div>
  );
}

export default App;
