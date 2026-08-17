import type { Request, Response } from 'express'

import { env } from '../config/env.js'
import { loginSchema } from '../schemas/auth.schema.js'
import {
  login,
  refreshSession,
  logout,
} from '../services/auth.service.js'

function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
) {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge:
      env.REFRESH_TOKEN_EXPIRATION_DAYS *
      24 *
      60 *
      60 *
      1000,
    path: '/api/auth',
  })
}

export async function loginController(
  req: Request,
  res: Response,
) {
  const parsedBody = loginSchema.safeParse(req.body)

  if (!parsedBody.success) {
    res.status(400).json({
      status: 'error',
      message: 'Dados de login inválidos',
      errors:
        parsedBody.error.flatten().fieldErrors,
    })

    return
  }

  const result = await login(parsedBody.data, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })

  if (!result) {
    res.status(401).json({
      status: 'error',
      message: 'E-mail ou senha inválidos',
    })

    return
  }

  setRefreshTokenCookie(
    res,
    result.refreshToken,
  )

  res.status(200).json({
    status: 'ok',

    accessToken: result.accessToken,

    user: result.user,
  })
}

export async function refreshController(
  req: Request,
  res: Response,
) {
  const refreshToken =
    req.cookies?.refresh_token

  if (!refreshToken) {
    res.status(401).json({
      status: 'error',
      message: 'Refresh token não informado',
    })

    return
  }

  const result = await refreshSession(
    refreshToken,
    {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    },
  )

  if (!result) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAME_SITE,
      path: '/api/auth',
    })

    res.status(401).json({
      status: 'error',
      message: 'Sessão inválida ou expirada',
    })

    return
  }

  setRefreshTokenCookie(
    res,
    result.refreshToken,
  )

  res.status(200).json({
    status: 'ok',

    accessToken: result.accessToken,

    user: result.user,
  })
}

export async function logoutController(
  req: Request,
  res: Response,
) {
  const refreshToken =
    req.cookies?.refresh_token

  if (refreshToken) {
    await logout(refreshToken)
  }

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/api/auth',
  })

  res.status(204).send()
}

export async function meController(
  req: Request,
  res: Response,
) {
  if (!req.user) {
    res.status(401).json({
      status: 'error',
      message: 'Usuário não autenticado',
    })

    return
  }

  res.status(200).json({
    status: 'ok',

    user: {
      id: req.user.id.toString(),
      nome: req.user.nome,
      email: req.user.email,
      perfil: req.user.perfil,
    },
  })
}