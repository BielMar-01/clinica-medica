import {
  createPatient,
  findPatientByCpf,
  findPatientById,
  listPatients,
  updatePatient,
  updatePatientStatus,
} from '../repositories/patient.repository.js'

import type {
  CreatePatientInput,
  PatientListQuery,
  UpdatePatientInput,
} from '../schemas/patient.schema.js'

import { AppError } from '../utils/app-error.js'

import {
  isPrismaRecordNotFoundError,
  isPrismaUniqueConstraintError,
} from '../utils/prisma-error.js'

function serializePatient(
  patient: Awaited<
    ReturnType<
      typeof findPatientById
    >
  >,
) {
  if (!patient) {
    return null
  }

  return {
    id:
      patient.id.toString(),

    nomeCompleto:
      patient.nome_completo,

    cpf:
      patient.cpf,

    dataNascimento:
      patient.data_nascimento
        .toISOString()
        .split('T')[0],

    sexo:
      patient.sexo,

    telefone:
      patient.telefone,

    telefoneSecundario:
      patient.telefone_secundario,

    email:
      patient.email,

    nomeMae:
      patient.nome_mae,

    cep:
      patient.cep,

    logradouro:
      patient.logradouro,

    numero:
      patient.numero,

    complemento:
      patient.complemento,

    bairro:
      patient.bairro,

    cidade:
      patient.cidade,

    estado:
      patient.estado,

    observacoes:
      patient.observacoes,

    ativo:
      patient.ativo,

    criadoEm:
      patient.criado_em,

    criadoPor:
      patient.criado_por
        ?.toString() ??
      null,

    atualizadoEm:
      patient.atualizado_em,

    atualizadoPor:
      patient.atualizado_por
        ?.toString() ??
      null,
  }
}

export async function getPatients(
  query: PatientListQuery,
) {
  const result =
    await listPatients({
      page:
        query.page,

      limit:
        query.limit,

      nome:
        query.nome,

      cpf:
        query.cpf,

      telefone:
        query.telefone,

      ativo:
        query.ativo,
    })

  const data =
    result.patients.map(
      (patient) => ({
        id:
          patient.id.toString(),

        nomeCompleto:
          patient.nome_completo,

        cpf:
          patient.cpf,

        dataNascimento:
          patient.data_nascimento
            .toISOString()
            .split('T')[0],

        telefone:
          patient.telefone,

        email:
          patient.email,

        ativo:
          patient.ativo,
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

export async function getPatientById(
  id: bigint,
) {
  const patient =
    await findPatientById(id)

  if (!patient) {
    throw new AppError(
      'Paciente não encontrado',
      404,
      'PATIENT_NOT_FOUND',
    )
  }

  return serializePatient(
    patient,
  )
}

export async function registerPatient(
  input: CreatePatientInput,
  userId: bigint,
) {
  const existingPatient =
    await findPatientByCpf(
      input.cpf,
    )

  if (existingPatient) {
    throw new AppError(
      'Já existe um paciente cadastrado com este CPF',
      409,
      'PATIENT_CPF_ALREADY_EXISTS',
    )
  }

  try {
    const patient =
      await createPatient({
        nomeCompleto:
          input.nomeCompleto,

        cpf:
          input.cpf,

        dataNascimento:
          new Date(
            `${input.dataNascimento}T00:00:00.000Z`,
          ),

        sexo:
          input.sexo || null,

        telefone:
          input.telefone,

        telefoneSecundario:
          input.telefoneSecundario ||
          null,

        email:
          input.email || null,

        nomeMae:
          input.nomeMae || null,

        cep:
          input.cep || null,

        logradouro:
          input.logradouro ||
          null,

        numero:
          input.numero || null,

        complemento:
          input.complemento ||
          null,

        bairro:
          input.bairro || null,

        cidade:
          input.cidade || null,

        estado:
          input.estado || null,

        observacoes:
          input.observacoes ||
          null,

        criadoPor:
          userId,
      })

    return serializePatient(
      patient,
    )
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new AppError(
        'Já existe um paciente cadastrado com este CPF',
        409,
        'PATIENT_CPF_ALREADY_EXISTS',
      )
    }

    throw error
  }
}

export async function editPatient(
  id: bigint,
  input: UpdatePatientInput,
  userId: bigint,
) {
  const patient =
    await findPatientById(id)

  if (!patient) {
    throw new AppError(
      'Paciente não encontrado',
      404,
      'PATIENT_NOT_FOUND',
    )
  }

  const patientWithSameCpf =
    await findPatientByCpf(
      input.cpf,
    )

  if (
    patientWithSameCpf &&
    patientWithSameCpf.id !==
      id
  ) {
    throw new AppError(
      'Já existe outro paciente cadastrado com este CPF',
      409,
      'PATIENT_CPF_ALREADY_EXISTS',
    )
  }

  try {
    const updatedPatient =
      await updatePatient(
        id,
        {
          nomeCompleto:
            input.nomeCompleto,

          cpf:
            input.cpf,

          dataNascimento:
            new Date(
              `${input.dataNascimento}T00:00:00.000Z`,
            ),

          sexo:
            input.sexo || null,

          telefone:
            input.telefone,

          telefoneSecundario:
            input.telefoneSecundario ||
            null,

          email:
            input.email || null,

          nomeMae:
            input.nomeMae || null,

          cep:
            input.cep || null,

          logradouro:
            input.logradouro ||
            null,

          numero:
            input.numero || null,

          complemento:
            input.complemento ||
            null,

          bairro:
            input.bairro || null,

          cidade:
            input.cidade || null,

          estado:
            input.estado || null,

          observacoes:
            input.observacoes ||
            null,

          atualizadoPor:
            userId,
        },
      )

    return serializePatient(
      updatedPatient,
    )
  } catch (error) {
    if (
      isPrismaUniqueConstraintError(
        error,
      )
    ) {
      throw new AppError(
        'Já existe outro paciente cadastrado com este CPF',
        409,
        'PATIENT_CPF_ALREADY_EXISTS',
      )
    }

    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Paciente não encontrado',
        404,
        'PATIENT_NOT_FOUND',
      )
    }

    throw error
  }
}

export async function changePatientStatus(
  id: bigint,
  ativo: boolean,
  userId: bigint,
) {
  const patient =
    await findPatientById(id)

  if (!patient) {
    throw new AppError(
      'Paciente não encontrado',
      404,
      'PATIENT_NOT_FOUND',
    )
  }

  if (
    patient.ativo === ativo
  ) {
    throw new AppError(
      ativo
        ? 'Paciente já está ativo'
        : 'Paciente já está inativo',

      409,

      ativo
        ? 'PATIENT_ALREADY_ACTIVE'
        : 'PATIENT_ALREADY_INACTIVE',
    )
  }

  try {
    const updatedPatient =
      await updatePatientStatus(
        id,
        ativo,
        userId,
      )

    return serializePatient(
      updatedPatient,
    )
  } catch (error) {
    if (
      isPrismaRecordNotFoundError(
        error,
      )
    ) {
      throw new AppError(
        'Paciente não encontrado',
        404,
        'PATIENT_NOT_FOUND',
      )
    }

    throw error
  }
}