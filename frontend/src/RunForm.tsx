import React, { useState, FormEvent, ChangeEvent } from 'react';
import './App.css';

type RunType = 'easy' | 'interval' | 'tempo';
type Universe = 'game of thrones' | 'harry potter' | 'bladerunner';

interface RunFormProps {
  onSubmit: (runData: { run_type: string; universe: string; filename?: string }) => void;
}

function RunForm({ onSubmit }: RunFormProps): JSX.Element {
  const [runType, setRunType] = useState<RunType>('easy');
  const [universe, setUniverse] = useState<Universe>('game of thrones');
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
        // Fetch the submitted run data and call onSubmit callback
        onSubmit({
          run_type: runType,
          universe: universe,
          filename: gpxFile?.name || undefined,
        });
        // const getResponse = await fetch('http://localhost:8000/run');
        // if (getResponse.ok) {
        //   const runData = await getResponse.json();
        //   if (runData.status === 'success') {
        //     onSubmit({
        //       run_type: runData.run_type,
        //       universe: runData.universe,
        //       filename: runData.filename
        //     });
        //   }
        // }
      } else {
        setMessage('Error submitting form. Please try again.');
        setSubmitting(false);
      }
    } catch (error) {
      setMessage('Error connecting to server. Make sure the backend is running.');
      console.error('Error:', error);
      setSubmitting(false);
    }
  };

  const handleRunTypeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRunType(e.target.value as RunType);
  };

  const handleUniverseChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUniverse(e.target.value as Universe);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setGpxFile(file);
  };

  return (
    <form onSubmit={handleSubmit} className="run-form">
      <div className="form-section">
        <h2 className="section-header">Select your type of run</h2>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="easy"
              checked={runType === 'easy'}
              onChange={handleRunTypeChange}
            />
            Easy
          </label>
          <label>
            <input
              type="radio"
              value="interval"
              checked={runType === 'interval'}
              onChange={handleRunTypeChange}
            />
            Interval
          </label>
          <label>
            <input
              type="radio"
              value="tempo"
              checked={runType === 'tempo'}
              onChange={handleRunTypeChange}
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
              onChange={handleUniverseChange}
            />
            Game of Thrones
          </label>
          <label>
            <input
              type="radio"
              value="harry potter"
              checked={universe === 'harry potter'}
              onChange={handleUniverseChange}
            />
            Harry Potter
          </label>
          <label>
            <input
              type="radio"
              value="bladerunner"
              checked={universe === 'bladerunner'}
              onChange={handleUniverseChange}
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
            onChange={handleFileChange}
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
  );
}

export default RunForm;
