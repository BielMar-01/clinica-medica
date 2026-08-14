const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL não está configurada')
}

export type ApiHealthResponse = {
  status: string
  service: string
}

export async function getApiHealth(): Promise<ApiHealthResponse> {
  const response = await fetch(`${API_URL}/api/health`)

  if (!response.ok) {
    throw new Error(
      `Erro ao consultar a API. Status HTTP: ${response.status}`,
    )
  }

  const data: ApiHealthResponse = await response.json()

  return data
}