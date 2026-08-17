declare global {
  namespace Express {
    interface Request {
      user?: {
        id: bigint
        nome: string
        email: string
        perfil: 'ADMIN' | 'RECEPCIONISTA' | 'MEDICO'
      }
    }
  }
}

export {}