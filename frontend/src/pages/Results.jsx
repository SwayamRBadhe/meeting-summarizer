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

  // Load summary and metrics when page loads
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get summary
        const summaryRes = await API.get(`/summary/${sessionId}`);
        setSummary(summaryRes.data.summary);

        // Get metrics
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

  // Handle chat question
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
      <div style={styles.center}>
        <h2>⏳ Generating your summary...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/')}>
        ← New Meeting
      </button>

      <h1 style={styles.title}>📋 Meeting Summary</h1>

      {/* Summary Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>✅ AI Summary</h2>
        <p style={styles.summaryText}>{summary}</p>
      </div>

      {/* Metrics Section */}
      {metrics && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Evaluation Metrics</h2>
          <div style={styles.metricsGrid}>
            <div style={styles.metric}>
              <h3>F1 Score</h3>
              <p style={styles.metricValue}>
                {metrics.classifier_metrics.f1_score}
              </p>
            </div>
            <div style={styles.metric}>
              <h3>Precision</h3>
              <p style={styles.metricValue}>
                {metrics.classifier_metrics.precision}
              </p>
            </div>
            <div style={styles.metric}>
              <h3>Recall</h3>
              <p style={styles.metricValue}>
                {metrics.classifier_metrics.recall}
              </p>
            </div>
            <div style={styles.metric}>
              <h3>ROUGE-L</h3>
              <p style={styles.metricValue}>
                {metrics.summary_metrics.rougeL}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Section */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>💬 Ask About the Meeting</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Ask a question about the meeting..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleChat()}
        />
        <button
          style={chatLoading ? styles.buttonDisabled : styles.button}
          onClick={handleChat}
          disabled={chatLoading}
        >
          {chatLoading ? 'Thinking...' : 'Ask'}
        </button>

        {answer && (
          <div style={styles.answer}>
            <strong>Answer:</strong> {answer}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '30px auto',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
  },
  center: {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#eee',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #eee',
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: '#444',
    marginBottom: '15px',
  },
  summaryText: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
    color: '#555',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
  },
  metric: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2196F3',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#aaa',
    color: 'white',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
  },
  answer: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    lineHeight: '1.6',
  },
};

export default Results;