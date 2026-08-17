export class AppError extends Error {
  public readonly statusCode: number
  public readonly code?: string
  public readonly details?: unknown

  constructor(
    message: string,
    statusCode = 400,
    code?: string,
    details?: unknown,
  ) {
    super(message)

    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}