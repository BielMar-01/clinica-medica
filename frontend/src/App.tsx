import { useEffect, useState } from 'react'
import {
  getApiHealth,
  type ApiHealthResponse,
} from './services/api'
import './App.css'

function App() {
  const [health, setHealth] = useState<ApiHealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadApiHealth() {
      try {
        setLoading(true)
        setError('')

        const response = await getApiHealth()

        setHealth(response)
      } catch (error) {
        console.error(error)

        setError('Não foi possível conectar com a API.')
      } finally {
        setLoading(false)
      }
    }

    void loadApiHealth()
  }, [])

  return (
    <main className="app">
      <section className="card">
        <h1>Clínica Médica</h1>

        <p className="description">
          Sistema de gestão para clínica médica.
        </p>

        <hr />

        <h2>Status do sistema</h2>

        {loading && <p>Verificando API...</p>}

        {!loading && health && (
          <div className="status success">
            <p>
              <strong>API:</strong> Online
            </p>

            <p>
              <strong>Status:</strong> {health.status}
            </p>

            <p>
              <strong>Serviço:</strong> {health.service}
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="status error">
            <p>
              <strong>API:</strong> Offline
            </p>

            <p>{error}</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App