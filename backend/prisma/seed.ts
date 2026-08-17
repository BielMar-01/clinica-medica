import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const databaseUrl = process.env.DATABASE_URL
const adminName = process.env.ADMIN_NAME
const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD

if (!databaseUrl) {
  throw new Error('DATABASE_URL não está configurada')
}

if (!adminName) {
  throw new Error('ADMIN_NAME não está configurada')
}

if (!adminEmail) {
  throw new Error('ADMIN_EMAIL não está configurada')
}

if (!adminPassword) {
  throw new Error('ADMIN_PASSWORD não está configurada')
}

if (adminPassword.length < 8) {
  throw new Error(
    'ADMIN_PASSWORD deve possuir pelo menos 8 caracteres',
  )
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
})

const prisma = new PrismaClient({
  adapter,
})

const especialidades = [
  'Clínica Geral',
  'Cardiologia',
  'Dermatologia',
  'Pediatria',
  'Ortopedia',
]

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(
    adminPassword,
    12,
  )

  const admin = await prisma.usuarios.upsert({
    where: {
      email: adminEmail.toLowerCase(),
    },

    update: {
      nome: adminName,
      perfil: 'ADMIN',
      ativo: true,
    },

    create: {
      nome: adminName,
      email: adminEmail.toLowerCase(),
      senha: passwordHash,
      perfil: 'ADMIN',
      ativo: true,
    },
  })

  console.log(
    `ADMIN garantido: ${admin.email}`,
  )
}

async function seedEspecialidades() {
  for (const nome of especialidades) {
    await prisma.especialidades.upsert({
      where: {
        nome,
      },

      update: {
        ativo: true,
      },

      create: {
        nome,
        ativo: true,
      },
    })

    console.log(
      `Especialidade garantida: ${nome}`,
    )
  }
}

async function main() {
  console.log('Iniciando seed...')

  await seedAdmin()

  await seedEspecialidades()

  console.log('Seed concluído com sucesso.')
}

main()
  .catch((error) => {
    console.error('Erro durante o seed:', error)

    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })