import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

function Home() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('transcript', transcript);

      // Upload transcript
      const response = await API.post('/upload', formData);
      const sessionId = response.data.session_id;

      // Go to results page
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
        Paste your meeting transcript and get an instant AI summary
      </p>

      <textarea
        style={styles.textarea}
        placeholder="Paste your meeting transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={12}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button
        style={loading ? styles.buttonDisabled : styles.button}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Generate Summary'}
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
    marginBottom: '30px',
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