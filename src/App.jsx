import { useState } from 'react'
import './App.css'

function App() {
  const [ledOn, setLedOn] = useState(false)

  return (
    <div className="app-container">

      <div className="app-card">

        <header className="header">
          <h1>Home</h1>

          <div className="connection-status">
            <span className="status-dot"></span>
            Demo Mode
          </div>
        </header>

        <div className="main-content">

          <button
            className={`light-card ${ledOn ? 'active' : ''}`}
            onClick={() => setLedOn(!ledOn)}
          >
            <div className="light-icon">
              ☀
            </div>

            <h2>Lights</h2>

            <p>
              {ledOn ? 'Turn mat lights off' : 'Turn mat lights on'}
            </p>

            <span className="light-status">
              {ledOn ? '● ON' : '○ OFF'}
            </span>
          </button>

        </div>

        <footer className="footer">
          <span>🐾 Paw Unit</span>
        </footer>

      </div>

    </div>
  )
}

export default App