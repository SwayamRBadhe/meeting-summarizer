import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const summaryRes = await API.get(`/summary/${sessionId}`);
        setSummary(summaryRes.data.summary);
        const metricsRes = await API.get(`/metrics/${sessionId}`);
        setMetrics(metricsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sessionId]);

  const handleChat = async () => {
    if (!question.trim()) return;
    setChatLoading(true);
    setAnswer('');
    try {
      const response = await API.post('/chat', {
        session_id: sessionId,
        question: question,
      });
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <p style={styles.loadingIcon}>⚡</p>
          <h2 style={styles.loadingTitle}>Generating your summary...</h2>
          <p style={styles.loadingSubtitle}>
            AI is analyzing your meeting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <span style={styles.logo}>🎙️ MeetingAI</span>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← New Meeting
        </button>
      </nav>

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>📋 Meeting Summary</h1>

        {/* Summary Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>✅</span>
            <h2 style={styles.cardTitle}>AI Generated Summary</h2>
          </div>
          <p style={styles.summaryText}>{summary}</p>
        </div>

        {/* Metrics Card */}
        {metrics && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>📊</span>
              <h2 style={styles.cardTitle}>Evaluation Metrics</h2>
            </div>
            <div style={styles.metricsGrid}>
              {[
                { label: 'F1 Score', value: metrics.classifier_metrics.f1_score, color: '#7c3aed' },
                { label: 'Precision', value: metrics.classifier_metrics.precision, color: '#3b82f6' },
                { label: 'Recall', value: metrics.classifier_metrics.recall, color: '#10b981' },
                { label: 'ROUGE-L', value: metrics.summary_metrics.rougeL, color: '#f59e0b' },
              ].map((m, i) => (
                <div key={i} style={styles.metricCard}>
                  <p style={{ ...styles.metricValue, color: m.color }}>{m.value}</p>
                  <p style={styles.metricLabel}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>💬</span>
            <h2 style={styles.cardTitle}>Ask About the Meeting</h2>
          </div>
          <div style={styles.chatInputRow}>
            <input
              style={styles.chatInput}
              type="text"
              placeholder="Ask anything about the meeting..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChat()}
            />
            <button
              style={chatLoading ? styles.chatButtonDisabled : styles.chatButton}
              onClick={handleChat}
              disabled={chatLoading}
            >
              {chatLoading ? '⏳' : '→'}
            </button>
          </div>

          {answer && (
            <div style={styles.answerBox}>
              <p style={styles.answerLabel}>💡 Answer</p>
              <p style={styles.answerText}>{answer}</p>
            </div>
          )}
        </div>

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
  loadingPage: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    textAlign: 'center',
    backgroundColor: '#1a1a1a',
    padding: '50px',
    borderRadius: '16px',
    border: '1px solid #222',
  },
  loadingIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  loadingTitle: {
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '10px',
  },
  loadingSubtitle: {
    color: '#666',
  },
  navbar: {
    padding: '20px 40px',
    borderBottom: '1px solid #222',
    backgroundColor: '#111',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#222',
    color: '#888',
    border: '1px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  container: {
    maxWidth: '750px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '25px',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '20px',
    border: '1px solid #222',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    borderBottom: '1px solid #222',
    paddingBottom: '12px',
  },
  cardIcon: {
    fontSize: '1.3rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
  },
  summaryText: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.8',
    color: '#bbb',
    fontSize: '0.95rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
  },
  metricCard: {
    backgroundColor: '#111',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #222',
  },
  metricValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0 0 5px',
  },
  metricLabel: {
    fontSize: '0.8rem',
    color: '#666',
    margin: 0,
  },
  chatInputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  chatInput: {
    flex: 1,
    padding: '12px 15px',
    backgroundColor: '#111',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
  },
  chatButton: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  chatButtonDisabled: {
    padding: '12px 20px',
    backgroundColor: '#333',
    color: '#666',
    border: 'none',
    borderRadius: '10px',
    cursor: 'not-allowed',
    fontSize: '1.2rem',
  },
  answerBox: {
    backgroundColor: '#111',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid #7c3aed',
  },
  answerLabel: {
    color: '#7c3aed',
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '0.9rem',
  },
  answerText: {
    color: '#bbb',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default Results;