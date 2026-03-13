import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

function Home() {
  const [transcript, setTranscript] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [inputType, setInputType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (inputType === 'text' && !transcript.trim()) {
      setError('Please enter a transcript');
      return;
    }
    if (inputType === 'audio' && !audioFile) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      if (inputType === 'audio') {
        formData.append('file', audioFile);
      } else {
        formData.append('transcript', transcript);
      }

      const response = await API.post('/upload', formData);
      const sessionId = response.data.session_id;
      navigate(`/results/${sessionId}`);

    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎙️ AI Meeting Summarizer</h1>
      <p style={styles.subtitle}>
        Upload audio or paste transcript to get an AI summary
      </p>

      {/* Toggle buttons */}
      <div style={styles.toggleContainer}>
        <button
          style={inputType === 'text' ? styles.toggleActive : styles.toggle}
          onClick={() => setInputType('text')}
        >
          📝 Paste Transcript
        </button>
        <button
          style={inputType === 'audio' ? styles.toggleActive : styles.toggle}
          onClick={() => setInputType('audio')}
        >
          🎵 Upload Audio
        </button>
      </div>

      {/* Text input */}
      {inputType === 'text' && (
        <textarea
          style={styles.textarea}
          placeholder="Paste your meeting transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={12}
        />
      )}

      {/* Audio input */}
      {inputType === 'audio' && (
        <div style={styles.audioContainer}>
          <input
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={(e) => setAudioFile(e.target.files[0])}
            style={styles.fileInput}
          />
          {audioFile && (
            <p style={styles.fileName}>
              ✅ Selected: {audioFile.name}
            </p>
          )}
          <p style={styles.audioNote}>
            Supported formats: .mp3, .wav, .m4a
          </p>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <button
        style={loading ? styles.buttonDisabled : styles.button}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Processing... (may take a minute for audio)' : 'Generate Summary'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px',
  },
  toggleContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  toggle: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#eee',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  toggleActive: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  audioContainer: {
    padding: '30px',
    border: '2px dashed #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  fileInput: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  fileName: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  audioNote: {
    color: '#999',
    fontSize: '0.9rem',
  },
  button: {
    width: '100%',
    padding: '15px',
    marginTop: '15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    width: '100%',
    padding: '15px',
    marginTop: '15px',
    backgroundColor: '#aaa',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Home;