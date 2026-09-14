import {
  findUserByEmail,
  findUserById,
  listUsers,
  revokeUserRefreshTokens,
  updateUser,
  updateUserStatus,
} from '../repositories/user.repository.js'

import type {
  UpdateUserInput,
  UserListQuery,
} from '../schemas/user.schema.js'

import {
  AppError,
} from '../utils/app-error.js'

import {
  isPrismaRecordNotFoundError,
  isPrismaUniqueConstraintError,
} from '../utils/prisma-error.js'

function serializeUser(
  user: Awaited<
    ReturnType<
      typeof findUserById
    >
  >,
) {
  if (!user) {
    return null
  }

  return {
    id:
      user.id.toString(),

    nome:
      user.nome,

    email:
      user.email,

    perfil:
      user.perfil,

    ativo:
      user.ativo,

    ultimoLoginEm:
      user.ultimo_login_em,

    criadoEm:
      user.criado_em,

    criadoPor:
      user.criado_por
        ?.toString() ??
      null,

    atualizadoEm:
      user.atualizado_em,

    atualizadoPor:
      user.atualizado_por
        ?.toString() ??
      null,
  }
}

export async function getUsers(
  query: UserListQuery,
) {
  const result =
    await listUsers({
      page:
        query.page,

      limit:
        query.limit,

      nome:
        query.nome,

      email:
        query.email,

      perfil:
        query.perfil,

      ativo:
        query.ativo,
    })

  const data =
    result.users.map(
      (user) => ({
        id:
          user.id.toString(),

        nome:
          user.nome,

        email:
          user.email,

        perfil:
          user.perfil,

        ativo:
          user.ativo,

        ultimoLoginEm:
          user.ultimo_login_em,
      }),
    )

  const totalPages =
    Math.ceil(
      result.total /
        query.limit,
    )

  return {
    data,

    pagination: {
      page:
        query.page,

      limit:
        query.limit,

      total:
        result.total,

      totalPages,
    },
  }
}

export async function getUserById(
  id: bigint,
) {
  const user =
    await findUserById(
      id,
    )

  if (!user) {
    throw new AppError(
      'Usuário não encontrado',
      404,
      'USER_NOT_FOUND',
    )
  }

  return serializeUser(
    user,
  )
}

export async function editUser(
  id: bigint,
  input: UpdateUserInput,
  authenticatedUserId: bigint,
) {
  const user =
    await findUserById(
      id,
    )

  if (!user) {
    throw new AppError(
      'Usuário não encontrado',
      404,
      'USER_NOT_FOUND',
    )
  }

  if (
    id ===
      authenticatedUserId &&
    input.perfil !==
      'ADMIN'
  ) {
    throw new AppError(
      'Você não pode remover o perfil ADMIN da própria conta',
      409,
      'CANNOT_CHANGE_OWN_ADMIN_ROLE',
    )
  }

  const normalizedEmail =
    input.email
      .trim()
      .toLowerCase()

  const userWithSameEmail =
    await findUserByEmail(
      normalizedEmail,
    )

  if (
    userWithSameEmail &&
    userWithSameEmail.id !==
      id
  ) {
    throw new AppError(
      'Já existe um usuário cadastrado com este e-mail',
      409,
      'USER_EMAIL_ALREADY_EXISTS',
    )
  }

  try {
    const updatedUser =
      await updateUser(
        id,
        {
          nome:
            input.nome,

          email:
            normalizedEmail,

          perfil:
            input.perfil,

          atualizadoPor:
            authenticatedUserId,
        },
      )

    return serializeUser(
      updatedUser,
    )
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new AppError(
        'Já existe um usuário cadastrado com este e-mail',
        409,
        'USER_EMAIL_ALREADY_EXISTS',
      )
    }

    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Usuário não encontrado',
        404,
        'USER_NOT_FOUND',
      )
    }

    throw error
  }
}

export async function changeUserStatus(
  id: bigint,
  ativo: boolean,
  authenticatedUserId: bigint,
) {
  const user =
    await findUserById(
      id,
    )

  if (!user) {
    throw new AppError(
      'Usuário não encontrado',
      404,
      'USER_NOT_FOUND',
    )
  }

  if (
    id ===
      authenticatedUserId &&
    !ativo
  ) {
    throw new AppError(
      'Você não pode inativar a própria conta',
      409,
      'CANNOT_DISABLE_OWN_USER',
    )
  }

  if (
    user.ativo ===
      ativo
  ) {
    throw new AppError(
      ativo
        ? 'Usuário já está ativo'
        : 'Usuário já está inativo',
      409,
      ativo
        ? 'USER_ALREADY_ACTIVE'
        : 'USER_ALREADY_INACTIVE',
    )
  }

  try {
    const updatedUser =
      await updateUserStatus(
        id,
        ativo,
        authenticatedUserId,
      )

    if (!ativo) {
      await revokeUserRefreshTokens(
        id,
      )
    }

    return serializeUser(
      updatedUser,
    )
  } catch (error) {
    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Usuário não encontrado',
        404,
        'USER_NOT_FOUND',
      )
    }

    throw error
  }
}