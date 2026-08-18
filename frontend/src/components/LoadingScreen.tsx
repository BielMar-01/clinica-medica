export function LoadingScreen() {
  return (
    <main
      className="loading-screen"
      data-testid="app-loading-screen"
    >
      <div
        className="loading-card"
        data-testid="app-loading-card"
      >
        <h1 data-testid="app-loading-title">
          Clínica Médica
        </h1>

        <p data-testid="app-loading-message">
          Carregando sessão...
        </p>
      </div>
    </main>
  )
}