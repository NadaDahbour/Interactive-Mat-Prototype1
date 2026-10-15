import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [ledOn, setLedOn] = useState(false)
  const [connected, setConnected] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const portRef = useRef(null)
  const writerRef = useRef(null)

  // Connect Arduino using Web Serial API
  async function connectArduino() {
    if (!('serial' in navigator)) {
      setError('Please use Google Chrome or Microsoft Edge.')
      return
    }

    setConnecting(true)
    setError('')

    let port = null

    try {
      port = await navigator.serial.requestPort()

      await port.open({ baudRate: 9600 })

      // Wait for Arduino to reset
      await new Promise(resolve => setTimeout(resolve, 2000))

      portRef.current = port
      writerRef.current = port.writable.getWriter()

      // Start with LED off
      await writerRef.current.write(
        new TextEncoder().encode('0')
      )

      setConnected(true)
      setDemoMode(false)
      setLedOn(false)

    } catch (err) {
      console.error(err)

      if (err.name !== 'NotFoundError') {
        setError('Could not connect to Arduino.')

        if (port) {
          try {
            await port.close()
          } catch (e) {
            console.error(e)
          }
        }
      }
    } finally {
      setConnecting(false)
    }
  }

  // Toggle LED
  async function toggleLight() {
    if (busy) return

    const newState = !ledOn

    // Demo mode
    if (demoMode) {
      setLedOn(newState)
      return
    }

    // Arduino mode
    if (!connected || !writerRef.current) return

    setBusy(true)
    setError('')

    try {
      const command = newState ? '1' : '0'

      await writerRef.current.write(
        new TextEncoder().encode(command)
      )

      setLedOn(newState)

    } catch (err) {
      console.error(err)
      setError('Failed to send command to Arduino.')
    } finally {
      setBusy(false)
    }
  }

  // Disconnect Arduino
  async function disconnectArduino() {
    setBusy(true)
    setError('')

    try {
      if (writerRef.current) {
        await writerRef.current.write(
          new TextEncoder().encode('0')
        )

        writerRef.current.releaseLock()
        writerRef.current = null
      }

      if (portRef.current) {
        await portRef.current.close()
        portRef.current = null
      }

      setConnected(false)
      setLedOn(false)

    } catch (err) {
      console.error(err)
      setError('Could not disconnect Arduino.')
    } finally {
      setBusy(false)
    }
  }

  // Toggle Demo Mode
  function toggleDemoMode() {
    if (connected || busy || connecting) return

    setDemoMode(!demoMode)
    setLedOn(false)
    setError('')
  }

  // Detect Arduino disconnection
  useEffect(() => {
    if (!('serial' in navigator)) return

    function handleDisconnect(event) {
      if (event.port === portRef.current) {
        portRef.current = null
        writerRef.current = null

        setConnected(false)
        setLedOn(false)
        setBusy(false)
        setError('Arduino disconnected.')
      }
    }

    navigator.serial.addEventListener(
      'disconnect',
      handleDisconnect
    )

    return () => {
      navigator.serial.removeEventListener(
        'disconnect',
        handleDisconnect
      )
    }
  }, [])

  return (
    <div className="app-container">

      <div className="app-card">

        {/* Header */}
        <header className="header">

          <h1>Home</h1>

          <div className="connection-controls">

            <button
              className={`connection-status ${connected ? 'connected' : ''}`}
              onClick={connected ? disconnectArduino : connectArduino}
              disabled={connecting || busy}
            >
              <span className="status-dot"></span>

              {connecting
                ? 'Connecting...'
                : connected
                  ? 'Disconnect Arduino'
                  : 'Connect Arduino'}
            </button>

          </div>

        </header>

        {/* Main Content */}
        <main className="main-content">

          <button
            className={`light-card ${ledOn ? 'active' : ''}`}
            onClick={toggleLight}
            disabled={(!connected && !demoMode) || busy}
          >

            <div className="light-icon">
              ☀
            </div>

            <h2>Lights</h2>

            <p>
              {!connected && !demoMode
                ? 'Connect Arduino or enable Demo Mode'
                : ledOn
                  ? 'Turn mat lights off'
                  : 'Turn mat lights on'}
            </p>

            <span className="light-status">
              {ledOn ? '● ON' : '○ OFF'}
            </span>

          </button>

        </main>

        {/* Demo Mode */}
        {!connected && (
          <div className="demo-section">

            <button
              className={`demo-button ${demoMode ? 'demo-active' : ''}`}
              onClick={toggleDemoMode}
              disabled={connecting || busy}
            >
              {demoMode ? '✓ Demo Mode Enabled' : 'Try Demo Mode'}
            </button>

            {demoMode && (
              <p className="demo-description">
                Demo Mode is active. The Lights button controls
                the interface only, not a physical LED.
              </p>
            )}

          </div>
        )}

        {/* Error */}
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {/* Footer */}
        <footer className="footer">
          <span>🐾 Paw Unit</span>
        </footer>

      </div>

    </div>
  )
}

export default App