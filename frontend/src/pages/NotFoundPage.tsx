import {
  Link,
} from 'react-router'

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>404</h1>

      <p>
        Página não encontrada.
      </p>

      <Link to="/dashboard">
        Voltar ao sistema
      </Link>
    </main>
  )
}