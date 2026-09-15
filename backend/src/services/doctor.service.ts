import {
  createDoctor,
  findDoctorByCrm,
  findDoctorById,
  findDoctorByUserId,
  findSpecialtiesByIds,
  listDoctors,
  updateDoctor,
  updateDoctorStatus,
} from '../repositories/doctor.repository.js'

import {
  findUserById,
} from '../repositories/user.repository.js'

import type {
  CreateDoctorInput,
  DoctorListQuery,
  UpdateDoctorInput,
} from '../schemas/doctor.schema.js'

import {
  AppError,
} from '../utils/app-error.js'

import {
  isPrismaRecordNotFoundError,
  isPrismaUniqueConstraintError,
} from '../utils/prisma-error.js'

function serializeSpecialties(
  specialties: Array<{
    especialidade_id: bigint
    principal: boolean
    especialidades: {
      id: bigint
      nome: string
      descricao: string | null
      ativo: boolean
    }
  }>,
) {
  return specialties.map(
    (specialty) => ({
      id:
        specialty.especialidade_id.toString(),

      nome:
        specialty.especialidades.nome,

      descricao:
        specialty.especialidades.descricao,

      ativo:
        specialty.especialidades.ativo,

      principal:
        specialty.principal,
    }),
  )
}

function serializeDoctor(
  doctor: Awaited<
    ReturnType<typeof findDoctorById>
  >,
) {
  if (!doctor) {
    return null
  }

  return {
    id:
      doctor.id.toString(),

    usuarioId:
      doctor.usuario_id.toString(),

    nomeCompleto:
      doctor.nome_completo,

    crmNumero:
      doctor.crm_numero,

    crmUf:
      doctor.crm_uf,

    telefone:
      doctor.telefone,

    email:
      doctor.email,

    duracaoConsultaMinutos:
      doctor.duracao_consulta_minutos,

    ativo:
      doctor.ativo,

    usuario: {
      id:
        doctor.usuarios.id.toString(),

      nome:
        doctor.usuarios.nome,

      email:
        doctor.usuarios.email,

      perfil:
        doctor.usuarios.perfil,

      ativo:
        doctor.usuarios.ativo,
    },

    especialidades:
      serializeSpecialties(
        doctor.especialidades,
      ),

    criadoEm:
      doctor.criado_em,

    criadoPor:
      doctor.criado_por
        ?.toString() ??
      null,

    atualizadoEm:
      doctor.atualizado_em,

    atualizadoPor:
      doctor.atualizado_por
        ?.toString() ??
      null,
  }
}

async function validateDoctorUser(
  usuarioId: bigint,
  currentDoctorId?: bigint,
) {
  const user =
    await findUserById(
      usuarioId,
    )

  if (!user) {
    throw new AppError(
      'Usuário não encontrado',
      404,
      'DOCTOR_USER_NOT_FOUND',
    )
  }

  if (!user.ativo) {
    throw new AppError(
      'O usuário informado está inativo',
      409,
      'DOCTOR_USER_INACTIVE',
    )
  }

  if (
    user.perfil !==
    'MEDICO'
  ) {
    throw new AppError(
      'O usuário informado não possui o perfil MEDICO',
      409,
      'DOCTOR_USER_INVALID_ROLE',
    )
  }

  const existingDoctor =
    await findDoctorByUserId(
      usuarioId,
    )

  if (
    existingDoctor &&
    existingDoctor.id !==
      currentDoctorId
  ) {
    throw new AppError(
      'O usuário informado já está vinculado a outro médico',
      409,
      'DOCTOR_USER_ALREADY_LINKED',
    )
  }

  return user
}

async function validateDoctorCrm(
  crmNumero: string,
  crmUf: string,
  currentDoctorId?: bigint,
) {
  const existingDoctor =
    await findDoctorByCrm(
      crmNumero,
      crmUf,
    )

  if (
    existingDoctor &&
    existingDoctor.id !==
      currentDoctorId
  ) {
    throw new AppError(
      'Já existe um médico cadastrado com este CRM e UF',
      409,
      'DOCTOR_CRM_ALREADY_EXISTS',
    )
  }
}

async function validateDoctorSpecialties(
  specialties: Array<{
    especialidadeId: string
    principal: boolean
  }>,
) {
  const specialtyIds =
    specialties.map(
      (specialty) =>
        BigInt(
          specialty.especialidadeId,
        ),
    )

  const databaseSpecialties =
    await findSpecialtiesByIds(
      specialtyIds,
    )

  if (
    databaseSpecialties.length !==
    specialtyIds.length
  ) {
    throw new AppError(
      'Uma ou mais especialidades informadas não foram encontradas',
      404,
      'DOCTOR_SPECIALTY_NOT_FOUND',
    )
  }

  const inactiveSpecialty =
    databaseSpecialties.find(
      (specialty) =>
        !specialty.ativo,
    )

  if (inactiveSpecialty) {
    throw new AppError(
      `A especialidade "${inactiveSpecialty.nome}" está inativa`,
      409,
      'DOCTOR_SPECIALTY_INACTIVE',
    )
  }

  return specialties.map(
    (specialty) => ({
      especialidadeId:
        BigInt(
          specialty.especialidadeId,
        ),

      principal:
        specialty.principal,
    }),
  )
}

export async function getDoctors(
  query: DoctorListQuery,
) {
  const result =
    await listDoctors({
      page:
        query.page,

      limit:
        query.limit,

      nome:
        query.nome,

      crm:
        query.crm,

      crmUf:
        query.crmUf,

      especialidadeId:
        query.especialidadeId
          ? BigInt(
              query.especialidadeId,
            )
          : undefined,

      ativo:
        query.ativo,
    })

  const data =
    result.doctors.map(
      (doctor) => ({
        id:
          doctor.id.toString(),

        usuarioId:
          doctor.usuario_id.toString(),

        nomeCompleto:
          doctor.nome_completo,

        crmNumero:
          doctor.crm_numero,

        crmUf:
          doctor.crm_uf,

        telefone:
          doctor.telefone,

        email:
          doctor.email,

        duracaoConsultaMinutos:
          doctor.duracao_consulta_minutos,

        ativo:
          doctor.ativo,

        usuario: {
          id:
            doctor.usuarios.id.toString(),

          nome:
            doctor.usuarios.nome,

          email:
            doctor.usuarios.email,

          perfil:
            doctor.usuarios.perfil,

          ativo:
            doctor.usuarios.ativo,
        },

        especialidades:
          serializeSpecialties(
            doctor.especialidades,
          ),
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

export async function getDoctorById(
  id: bigint,
) {
  const doctor =
    await findDoctorById(
      id,
    )

  if (!doctor) {
    throw new AppError(
      'Médico não encontrado',
      404,
      'DOCTOR_NOT_FOUND',
    )
  }

  return serializeDoctor(
    doctor,
  )
}

export async function registerDoctor(
  input: CreateDoctorInput,
  authenticatedUserId: bigint,
) {
  const usuarioId =
    BigInt(
      input.usuarioId,
    )

  await validateDoctorUser(
    usuarioId,
  )

  await validateDoctorCrm(
    input.crmNumero,
    input.crmUf,
  )

  const specialties =
    await validateDoctorSpecialties(
      input.especialidades,
    )

  try {
    const doctor =
      await createDoctor({
        usuarioId,

        nomeCompleto:
          input.nomeCompleto,

        crmNumero:
          input.crmNumero,

        crmUf:
          input.crmUf,

        telefone:
          input.telefone ??
          null,

        email:
          input.email ??
          null,

        duracaoConsultaMinutos:
          input.duracaoConsultaMinutos,

        especialidades:
          specialties,

        criadoPor:
          authenticatedUserId,
      })

    return getDoctorById(
      doctor.id,
    )
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new AppError(
        'Já existe um médico com os dados únicos informados',
        409,
        'DOCTOR_ALREADY_EXISTS',
      )
    }

    throw error
  }
}

export async function editDoctor(
  id: bigint,
  input: UpdateDoctorInput,
  authenticatedUserId: bigint,
) {
  const doctor =
    await findDoctorById(
      id,
    )

  if (!doctor) {
    throw new AppError(
      'Médico não encontrado',
      404,
      'DOCTOR_NOT_FOUND',
    )
  }

  const usuarioId =
    BigInt(
      input.usuarioId,
    )

  await validateDoctorUser(
    usuarioId,
    id,
  )

  await validateDoctorCrm(
    input.crmNumero,
    input.crmUf,
    id,
  )

  const specialties =
    await validateDoctorSpecialties(
      input.especialidades,
    )

  try {
    await updateDoctor(
      id,
      {
        usuarioId,

        nomeCompleto:
          input.nomeCompleto,

        crmNumero:
          input.crmNumero,

        crmUf:
          input.crmUf,

        telefone:
          input.telefone ??
          null,

        email:
          input.email ??
          null,

        duracaoConsultaMinutos:
          input.duracaoConsultaMinutos,

        especialidades:
          specialties,

        atualizadoPor:
          authenticatedUserId,
      },
    )

    return getDoctorById(
      id,
    )
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new AppError(
        'Já existe um médico com os dados únicos informados',
        409,
        'DOCTOR_ALREADY_EXISTS',
      )
    }

    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Médico não encontrado',
        404,
        'DOCTOR_NOT_FOUND',
      )
    }

    throw error
  }
}

export async function changeDoctorStatus(
  id: bigint,
  ativo: boolean,
  authenticatedUserId: bigint,
) {
  const doctor =
    await findDoctorById(
      id,
    )

  if (!doctor) {
    throw new AppError(
      'Médico não encontrado',
      404,
      'DOCTOR_NOT_FOUND',
    )
  }

  if (
    doctor.ativo ===
    ativo
  ) {
    throw new AppError(
      ativo
        ? 'Médico já está ativo'
        : 'Médico já está inativo',
      409,
      ativo
        ? 'DOCTOR_ALREADY_ACTIVE'
        : 'DOCTOR_ALREADY_INACTIVE',
    )
  }

  try {
    await updateDoctorStatus(
      id,
      ativo,
      authenticatedUserId,
    )

    return getDoctorById(
      id,
    )
  } catch (error) {
    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Médico não encontrado',
        404,
        'DOCTOR_NOT_FOUND',
      )
    }

    throw error
  }
}