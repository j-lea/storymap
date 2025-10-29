import React, { useState, FormEvent, ChangeEvent } from 'react';
import './App.css';
import RunForm from './RunForm';

type RunType = 'easy' | 'interval' | 'tempo';
type Universe = 'game of thrones' | 'harry potter' | 'bladerunner';

interface RunData {
  run_type: string;
  universe: string;
  filename?: string;
}

function App(): JSX.Element {
  const [submittedRun, setSubmittedRun] = useState<RunData | null>(null);

  const handleSubmit = async (runData: RunData): Promise<void> => {
    const response = await fetch('http://localhost:8000/run', {
      method: 'GET',
    });
    if (response.ok) {
      const data = await response.json();
      setSubmittedRun(data);
    }
  };

  const handleStartOver = (): void => {
    setSubmittedRun(null);
  };

  // Show results screen if run has been submitted
  if (submittedRun) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Your Journey</h1>
        </header>
        <main className="App-main">
          <div className="results-container">
            <div className="result-section">
              <h2 className="result-label">Run Type</h2>
              <p className="result-value">{submittedRun.run_type}</p>
            </div>
            <div className="result-section">
              <h2 className="result-label">Universe</h2>
              <p className="result-value">{submittedRun.universe}</p>
            </div>
            {submittedRun.filename && (
              <div className="result-section">
                <h2 className="result-label">GPX/FIT File</h2>
                <p className="result-value">{submittedRun.filename}</p>
              </div>
            )}
            <button onClick={handleStartOver} className="submit-button">
              Start Over
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chart Your Journey</h1>
      </header>
      <main className="App-main">
        <RunForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}

export default App;
