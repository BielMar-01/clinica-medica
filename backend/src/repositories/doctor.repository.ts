import type {
  Prisma,
} from '@prisma/client'

import {
  prisma,
} from '../database/prisma.js'

type DoctorSpecialtyData = {
  especialidadeId: bigint
  principal: boolean
}

type CreateDoctorData = {
  usuarioId: bigint
  nomeCompleto: string
  crmNumero: string
  crmUf: string
  telefone?: string | null
  email?: string | null
  duracaoConsultaMinutos: number
  especialidades: DoctorSpecialtyData[]
  criadoPor: bigint
}

type UpdateDoctorData = {
  usuarioId: bigint
  nomeCompleto: string
  crmNumero: string
  crmUf: string
  telefone?: string | null
  email?: string | null
  duracaoConsultaMinutos: number
  especialidades: DoctorSpecialtyData[]
  atualizadoPor: bigint
}

type ListDoctorsParams = {
  page: number
  limit: number
  nome?: string
  crm?: string
  crmUf?: string
  especialidadeId?: bigint
  ativo?: boolean
}

export async function findDoctorById(
  id: bigint,
) {
  const doctor =
    await prisma.medicos.findUnique({
      where: {
        id,
      },

      include: {
        usuarios: true,
      },
    })

  if (!doctor) {
    return null
  }

  const specialties =
    await prisma.medicos_especialidades.findMany({
      where: {
        medico_id: id,
      },

      include: {
        especialidades: true,
      },

      orderBy: [
        {
          principal: 'desc',
        },
        {
          especialidades: {
            nome: 'asc',
          },
        },
      ],
    })

  return {
    ...doctor,
    especialidades: specialties,
  }
}

export async function findDoctorByUserId(
  usuarioId: bigint,
) {
  return prisma.medicos.findUnique({
    where: {
      usuario_id: usuarioId,
    },
  })
}

export async function findDoctorByCrm(
  crmNumero: string,
  crmUf: string,
) {
  return prisma.medicos.findUnique({
    where: {
      crm_numero_crm_uf: {
        crm_numero: crmNumero,
        crm_uf: crmUf,
      },
    },
  })
}

export async function findDoctorSpecialties(
  doctorId: bigint,
) {
  return prisma.medicos_especialidades.findMany({
    where: {
      medico_id: doctorId,
    },

    include: {
      especialidades: true,
    },

    orderBy: [
      {
        principal: 'desc',
      },
      {
        especialidades: {
          nome: 'asc',
        },
      },
    ],
  })
}

export async function findSpecialtiesByIds(
  specialtyIds: bigint[],
) {
  return prisma.especialidades.findMany({
    where: {
      id: {
        in: specialtyIds,
      },
    },

    orderBy: {
      nome: 'asc',
    },
  })
}

export async function listDoctors(
  params: ListDoctorsParams,
) {
  const where:
    Prisma.medicosWhereInput =
    {}

  if (params.nome) {
    where.nome_completo = {
      contains:
        params.nome,

      mode:
        'insensitive',
    }
  }

  if (params.crm) {
    where.crm_numero = {
      contains:
        params.crm,

      mode:
        'insensitive',
    }
  }

  if (params.crmUf) {
    where.crm_uf =
      params.crmUf
  }

  if (
    params.ativo !==
    undefined
  ) {
    where.ativo =
      params.ativo
  }

  if (params.especialidadeId) {
    where.id = {
      in:
        (
          await prisma.medicos_especialidades.findMany({
            where: {
              especialidade_id:
                params.especialidadeId,
            },

            select: {
              medico_id: true,
            },
          })
        ).map(
          (specialty) =>
            specialty.medico_id,
        ),
    }
  }

  const skip =
    (params.page - 1) *
    params.limit

  const [
    doctors,
    total,
  ] =
    await prisma.$transaction([
      prisma.medicos.findMany({
        where,

        skip,

        take:
          params.limit,

        include: {
          usuarios: true,
        },

        orderBy: {
          nome_completo:
            'asc',
        },
      }),

      prisma.medicos.count({
        where,
      }),
    ])

  const doctorIds =
    doctors.map(
      (doctor) =>
        doctor.id,
    )

  const specialties =
    doctorIds.length > 0
      ? await prisma.medicos_especialidades.findMany({
          where: {
            medico_id: {
              in: doctorIds,
            },
          },

          include: {
            especialidades: true,
          },

          orderBy: [
            {
              principal:
                'desc',
            },
            {
              especialidades: {
                nome:
                  'asc',
              },
            },
          ],
        })
      : []

  const specialtiesByDoctor =
    new Map<
      bigint,
      typeof specialties
    >()

  for (
    const specialty
    of specialties
  ) {
    const current =
      specialtiesByDoctor.get(
        specialty.medico_id,
      ) ?? []

    current.push(
      specialty,
    )

    specialtiesByDoctor.set(
      specialty.medico_id,
      current,
    )
  }

  return {
    doctors:
      doctors.map(
        (doctor) => ({
          ...doctor,

          especialidades:
            specialtiesByDoctor.get(
              doctor.id,
            ) ?? [],
        }),
      ),

    total,
  }
}

export async function createDoctor(
  data: CreateDoctorData,
) {
  return prisma.$transaction(
    async (tx) => {
      const doctor =
        await tx.medicos.create({
          data: {
            usuario_id:
              data.usuarioId,

            nome_completo:
              data.nomeCompleto,

            crm_numero:
              data.crmNumero,

            crm_uf:
              data.crmUf,

            telefone:
              data.telefone ??
              null,

            email:
              data.email ??
              null,

            duracao_consulta_minutos:
              data.duracaoConsultaMinutos,

            ativo:
              true,

            criado_por:
              data.criadoPor,
          },
        })

      await tx.medicos_especialidades.createMany({
        data:
          data.especialidades.map(
            (specialty) => ({
              medico_id:
                doctor.id,

              especialidade_id:
                specialty.especialidadeId,

              principal:
                specialty.principal,
            }),
          ),
      })

      return doctor
    },
  )
}

export async function updateDoctor(
  id: bigint,
  data: UpdateDoctorData,
) {
  return prisma.$transaction(
    async (tx) => {
      const doctor =
        await tx.medicos.update({
          where: {
            id,
          },

          data: {
            usuario_id:
              data.usuarioId,

            nome_completo:
              data.nomeCompleto,

            crm_numero:
              data.crmNumero,

            crm_uf:
              data.crmUf,

            telefone:
              data.telefone ??
              null,

            email:
              data.email ??
              null,

            duracao_consulta_minutos:
              data.duracaoConsultaMinutos,

            atualizado_em:
              new Date(),

            atualizado_por:
              data.atualizadoPor,
          },
        })

      await tx.medicos_especialidades.deleteMany({
        where: {
          medico_id: id,
        },
      })

      await tx.medicos_especialidades.createMany({
        data:
          data.especialidades.map(
            (specialty) => ({
              medico_id:
                id,

              especialidade_id:
                specialty.especialidadeId,

              principal:
                specialty.principal,
            }),
          ),
      })

      return doctor
    },
  )
}

export async function updateDoctorStatus(
  id: bigint,
  ativo: boolean,
  atualizadoPor: bigint,
) {
  return prisma.medicos.update({
    where: {
      id,
    },

    data: {
      ativo,

      atualizado_em:
        new Date(),

      atualizado_por:
        atualizadoPor,
    },
  })
}