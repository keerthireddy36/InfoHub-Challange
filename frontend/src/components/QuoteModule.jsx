import React, { useState, useEffect } from 'react';

const QuoteModule = () => {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/quote');
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setQuote(data.quote);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load quote.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial quote on component load
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="module-box">
      <h2>💬 Motivational Quote Generator</h2>
      
      {loading && <p className="loading">Generating inspiration...</p>}
      {error && <div className="error-message">Error: {error}</div>}

      {quote && (
        <blockquote className="quote-display">
          "{quote}"
        </blockquote>
      )}

      <button onClick={fetchQuote} disabled={loading}>
        {loading ? 'Thinking...' : 'Get New Quote'}
      </button>
    </div>
  );
};

export default QuoteModule;
