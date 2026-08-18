import {
  Link,
} from 'react-router'

export function NotFoundPage() {
  return (
    <main
      className="not-found-page"
      data-testid="not-found-page"
    >
      <h1 data-testid="not-found-code">
        404
      </h1>

      <p data-testid="not-found-message">
        Página não encontrada.
      </p>

      <Link
        to="/dashboard"
        data-testid="not-found-back-button"
      >
        Voltar ao sistema
      </Link>
    </main>
  )
}