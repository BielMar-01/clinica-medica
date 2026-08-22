import {
  createSpecialty,
  findSpecialtyById,
  findSpecialtyByName,
  listSpecialties,
  updateSpecialty,
  updateSpecialtyStatus,
} from '../repositories/specialty.repository.js'

import type {
  CreateSpecialtyInput,
  SpecialtyListQuery,
  UpdateSpecialtyInput,
} from '../schemas/specialty.schema.js'

import { AppError } from '../utils/app-error.js'

import {
  isPrismaRecordNotFoundError,
  isPrismaUniqueConstraintError,
} from '../utils/prisma-error.js'

function serializeSpecialty(
  specialty: Awaited<
    ReturnType<typeof findSpecialtyById>
  >,
) {
  if (!specialty) {
    return null
  }

  return {
    id: specialty.id.toString(),
    nome: specialty.nome,
    descricao: specialty.descricao,
    ativo: specialty.ativo,
    criadoEm: specialty.criado_em,
    criadoPor:
      specialty.criado_por?.toString() ?? null,
    atualizadoEm: specialty.atualizado_em,
    atualizadoPor:
      specialty.atualizado_por?.toString() ?? null,
  }
}

export async function getSpecialties(
  query: SpecialtyListQuery,
) {
  const result = await listSpecialties({
    page: query.page,
    limit: query.limit,
    nome: query.nome,
    ativo: query.ativo,
  })

  const data = result.specialties.map(
    (specialty) => ({
      id: specialty.id.toString(),
      nome: specialty.nome,
      descricao: specialty.descricao,
      ativo: specialty.ativo,
    }),
  )

  const totalPages = Math.ceil(
    result.total / query.limit,
  )

  return {
    data,

    pagination: {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages,
    },
  }
}

export async function getSpecialtyById(
  id: bigint,
) {
  const specialty =
    await findSpecialtyById(id)

  if (!specialty) {
    throw new AppError(
      'Especialidade não encontrada',
      404,
      'SPECIALTY_NOT_FOUND',
    )
  }

  return serializeSpecialty(
    specialty,
  )
}

export async function registerSpecialty(
  input: CreateSpecialtyInput,
  userId: bigint,
) {
  const existingSpecialty =
    await findSpecialtyByName(
      input.nome,
    )

  if (existingSpecialty) {
    throw new AppError(
      'Já existe uma especialidade cadastrada com este nome',
      409,
      'SPECIALTY_NAME_ALREADY_EXISTS',
    )
  }

  try {
    const specialty =
      await createSpecialty({
        nome: input.nome,
        descricao:
          input.descricao || null,
        criadoPor: userId,
      })

    return serializeSpecialty(
      specialty,
    )
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new AppError(
        'Já existe uma especialidade cadastrada com este nome',
        409,
        'SPECIALTY_NAME_ALREADY_EXISTS',
      )
    }

    throw error
  }
}

export async function editSpecialty(
  id: bigint,
  input: UpdateSpecialtyInput,
  userId: bigint,
) {
  const specialty =
    await findSpecialtyById(id)

  if (!specialty) {
    throw new AppError(
      'Especialidade não encontrada',
      404,
      'SPECIALTY_NOT_FOUND',
    )
  }

  const sameName =
    await findSpecialtyByName(
      input.nome,
    )

  if (
    sameName &&
    sameName.id !== id
  ) {
    throw new AppError(
      'Já existe outra especialidade cadastrada com este nome',
      409,
      'SPECIALTY_NAME_ALREADY_EXISTS',
    )
  }

  try {
    const updatedSpecialty =
      await updateSpecialty(
        id,
        {
          nome: input.nome,
          descricao:
            input.descricao || null,
          atualizadoPor: userId,
        },
      )

    return serializeSpecialty(
      updatedSpecialty,
    )
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new AppError(
        'Já existe outra especialidade cadastrada com este nome',
        409,
        'SPECIALTY_NAME_ALREADY_EXISTS',
      )
    }

    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Especialidade não encontrada',
        404,
        'SPECIALTY_NOT_FOUND',
      )
    }

    throw error
  }
}

export async function changeSpecialtyStatus(
  id: bigint,
  ativo: boolean,
  userId: bigint,
) {
  const specialty =
    await findSpecialtyById(id)

  if (!specialty) {
    throw new AppError(
      'Especialidade não encontrada',
      404,
      'SPECIALTY_NOT_FOUND',
    )
  }

  if (specialty.ativo === ativo) {
    throw new AppError(
      ativo
        ? 'Especialidade já está ativa'
        : 'Especialidade já está inativa',
      409,
      ativo
        ? 'SPECIALTY_ALREADY_ACTIVE'
        : 'SPECIALTY_ALREADY_INACTIVE',
    )
  }

  try {
    const updatedSpecialty =
      await updateSpecialtyStatus(
        id,
        ativo,
        userId,
      )

    return serializeSpecialty(
      updatedSpecialty,
    )
  } catch (error) {
    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Especialidade não encontrada',
        404,
        'SPECIALTY_NOT_FOUND',
      )
    }

    throw error
  }
}