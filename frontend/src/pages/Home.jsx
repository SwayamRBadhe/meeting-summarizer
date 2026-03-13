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
      navigate(`/results/${response.data.session_id}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <span style={styles.logo}>🎙️ MeetingAI</span>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>AI Meeting Summarizer</h1>
        <p style={styles.heroSubtitle}>
          Transform your meetings into structured summaries, 
          action items and insights — powered by AI
        </p>
      </div>

      {/* Main Card */}
      <div style={styles.card}>

        {/* Toggle */}
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

        {/* Text Input */}
        {inputType === 'text' && (
          <textarea
            style={styles.textarea}
            placeholder="Paste your meeting transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={10}
          />
        )}

        {/* Audio Input */}
        {inputType === 'audio' && (
          <div style={styles.audioBox}>
            <p style={styles.audioIcon}>🎵</p>
            <p style={styles.audioText}>Select your audio file</p>
            <input
              type="file"
              accept=".mp3,.wav,.m4a"
              onChange={(e) => setAudioFile(e.target.files[0])}
              style={styles.fileInput}
            />
            {audioFile && (
              <p style={styles.fileName}>✅ {audioFile.name}</p>
            )}
            <p style={styles.audioNote}>Supports .mp3, .wav, .m4a</p>
          </div>
        )}

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <button
          style={loading ? styles.buttonDisabled : styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '⏳ Processing...' : '✨ Generate Summary'}
        </button>
      </div>

      {/* Features */}
      <div style={styles.featuresContainer}>
        {[
          { icon: '🤖', title: 'AI Powered', desc: 'Groq LLaMA 3.1 generates accurate summaries' },
          { icon: '🔍', title: 'RAG Pipeline', desc: 'ChromaDB vector search for context-aware Q&A' },
          { icon: '🎙️', title: 'Audio Support', desc: 'Whisper transcribes audio in under 1 minute' },
        ].map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <p style={styles.featureIcon}>{f.icon}</p>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#ffffff',
    fontFamily: "'Segoe UI', sans-serif",
  },
  navbar: {
    padding: '20px 40px',
    borderBottom: '1px solid #222',
    backgroundColor: '#111',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px 30px',
  },
  heroTitle: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '15px',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: '#888',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  card: {
    maxWidth: '700px',
    margin: '30px auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '30px',
    border: '1px solid #222',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  toggleContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  toggle: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#222',
    color: '#888',
    border: '1px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  toggleActive: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#7c3aed',
    color: 'white',
    border: '1px solid #7c3aed',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    fontSize: '0.95rem',
    borderRadius: '10px',
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
    lineHeight: '1.6',
  },
  audioBox: {
    border: '2px dashed #333',
    borderRadius: '10px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#111',
    marginBottom: '10px',
  },
  audioIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  audioText: {
    color: '#888',
    marginBottom: '15px',
  },
  fileInput: {
    color: '#fff',
    marginBottom: '10px',
  },
  fileName: {
    color: '#7c3aed',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  audioNote: {
    color: '#555',
    fontSize: '0.85rem',
    marginTop: '8px',
  },
  button: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    backgroundColor: '#333',
    color: '#666',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'not-allowed',
  },
  error: {
    color: '#ef4444',
    marginTop: '10px',
    fontSize: '0.9rem',
  },
  featuresContainer: {
    display: 'flex',
    gap: '20px',
    maxWidth: '700px',
    margin: '0 auto 50px',
    padding: '0 20px',
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #222',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '8px',
  },
  featureDesc: {
    fontSize: '0.85rem',
    color: '#666',
    lineHeight: '1.5',
  },
};

export default Home;