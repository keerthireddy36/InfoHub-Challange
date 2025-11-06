import React, { useState } from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyModule from './components/CurrencyModule';
import QuoteModule from './components/QuoteModule';
import './App.css'; // Import the CSS file

const views = ['Weather', 'Currency', 'Quotes'];

function App() {
  const [activeView, setActiveView] = useState('Weather');

  return (
    <div className="infohub-container">
      <header className="infohub-header">
        <h1>💡 InfoHub Challenge</h1>
        <p>A single-page utility center by ByteXL</p>
      </header>

      <nav className="infohub-nav">
        {views.map((view) => (
          <button
            key={view}
            className={`nav-button ${activeView === view ? 'active' : ''}`}
            onClick={() => setActiveView(view)}
          >
            {view}
          </button>
        ))}
      </nav>

      <main className="infohub-main">
        {activeView === 'Weather' && <WeatherModule />}
        {activeView === 'Currency' && <CurrencyModule />}
        {activeView === 'Quotes' && <QuoteModule />}
      </main>
    </div>
  );
}

export default App;
