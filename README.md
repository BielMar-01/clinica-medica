# 🏥 Clínica Médica

Sistema web completo para gerenciamento de clínicas médicas.

O projeto está sendo desenvolvido com arquitetura separada entre frontend, backend e banco de dados, priorizando segurança, organização, escalabilidade e facilidade de evolução.

---

## 📌 Visão Geral

A aplicação tem como objetivo centralizar a gestão de uma clínica médica, permitindo administrar:

- Usuários
- Pacientes
- Médicos
- Especialidades
- Agendas
- Bloqueios de agenda
- Agendamentos
- Consultas
- Prontuários
- Alergias
- Receitas
- Atestados
- Auditorias

A aplicação utiliza uma API própria.

O frontend não acessa diretamente o banco de dados.

Arquitetura:

```text
React + TypeScript
        ↓
Node.js + TypeScript + Express
        ↓
Prisma ORM
        ↓
PostgreSQL
        ↓
Supabase
```

---

# 🚀 Tecnologias

## Frontend

- React
- TypeScript
- Vite
- React Router
- Fetch API
- CSS
- Vercel

## Backend

- Node.js
- TypeScript
- Express 5
- Zod
- Prisma ORM
- PostgreSQL
- bcryptjs
- JSON Web Token
- Cookie Parser
- CORS

## Banco de Dados

- PostgreSQL
- Supabase

## Documentação

- OpenAPI 3
- Swagger UI

## Infraestrutura

- Git
- GitHub
- Vercel
- Supabase

---

# 📁 Estrutura do Projeto

```text
clinica-medica/
│
├── backend/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── docs/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── frontend/
│   │
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│
├── .gitignore
└── README.md
```

---

# 🗄️ Banco de Dados

O banco PostgreSQL é hospedado no Supabase.

Principais tabelas:

```text
usuarios
refresh_tokens

pacientes

medicos
especialidades
medicos_especialidades

agendas_medicas
bloqueios_agenda

agendamentos
historicos_agendamento

consultas
prontuarios
alergias

receitas
itens_receita

atestados

auditorias
```

O versionamento do banco é gerenciado pelo Prisma Migrate.

---

# 🔐 Autenticação

A autenticação é própria da aplicação.

Não utilizamos Supabase Auth atualmente.

Fluxo:

```text
Login
↓
Access Token JWT
↓
Refresh Token
↓
Cookie HttpOnly
```

O Access Token possui duração curta.

O Refresh Token:

- É gerado aleatoriamente
- É enviado ao navegador via Cookie HttpOnly
- Não fica disponível para JavaScript
- É armazenado no banco apenas como hash
- Possui expiração
- Pode ser revogado
- Utiliza rotação

O frontend mantém o Access Token apenas em memória.

Quando ele expira:

```text
Request
↓
401
↓
POST /api/auth/refresh
↓
novo Access Token
↓
request original novamente
```

---

# 👥 Perfis

Atualmente existem três perfis:

```text
ADMIN
RECEPCIONISTA
MEDICO
```

As permissões são controladas pela API.

Exemplo:

| Operação | ADMIN | RECEPCIONISTA | MÉDICO |
|---|---:|---:|---:|
| Consultar pacientes | ✅ | ✅ | ✅ |
| Cadastrar paciente | ✅ | ✅ | ❌ |
| Editar paciente | ✅ | ✅ | ❌ |
| Ativar/Inativar | ✅ | ✅ | ❌ |

---

# 👤 Módulo de Pacientes

O módulo de pacientes já possui:

- Cadastro
- Consulta
- Consulta por ID
- Edição
- Ativação
- Inativação
- Paginação
- Filtro por nome
- Filtro por CPF
- Filtro por telefone
- Filtro por status
- Validação de CPF
- Normalização de CPF
- Normalização de telefone
- Normalização de CEP
- Proteção contra CPF duplicado
- Tratamento de concorrência utilizando constraint única no banco

Rotas:

```http
GET /api/pacientes

GET /api/pacientes/:id

POST /api/pacientes

PUT /api/pacientes/:id

PATCH /api/pacientes/:id/status
```

---

# 📖 Swagger / OpenAPI

A API possui documentação interativa.

Produção:

```text
https://clinica-medica-api.vercel.app/api/docs
```

Documento OpenAPI:

```text
https://clinica-medica-api.vercel.app/api/docs.json
```

Local:

```text
http://localhost:3000/api/docs
```

---

# 🌐 Ambientes

## Frontend

Produção:

```text
https://clinica-medica-galera-do-ti.vercel.app
```

## Backend

Produção:

```text
https://clinica-medica-api.vercel.app
```

---

# 💻 Pré-requisitos

Instale:

- Git
- Node.js
- npm
- VS Code ou IDE de preferência

Opcional:

- Postman
- DBeaver

Não é necessário instalar PostgreSQL localmente para utilizar o ambiente Supabase.

---

# 🪟 Instalação no Windows

Clone o projeto:

```cmd
git clone https://github.com/BielMar-01/clinica-medica.git
```

Entre na pasta:

```cmd
cd clinica-medica
```

---

# ⚙️ Backend

Entre no backend:

```cmd
cd backend
```

Instale as dependências:

```cmd
npm install
```

Crie:

```text
backend\.env
```

Baseado em:

```text
backend\.env.example
```

---

# 🔑 Variáveis do Backend

Exemplo:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=""

DIRECT_URL=""

JWT_SECRET=""

JWT_ACCESS_EXPIRATION_SECONDS=900

REFRESH_TOKEN_EXPIRATION_DAYS=7

FRONTEND_URL=http://localhost:5173

COOKIE_SECURE=false

COOKIE_SAME_SITE=lax

ADMIN_NAME=Administrador

ADMIN_EMAIL=admin@clinica.local

ADMIN_PASSWORD=""
```

Nunca envie valores reais ao Git.

---

# 🧬 Prisma

Validar schema:

```cmd
npx prisma validate
```

Gerar Prisma Client:

```cmd
npx prisma generate
```

Executar migrations:

```cmd
npx prisma migrate deploy
```

Executar seed:

```cmd
npx prisma db seed
```

---

# ▶️ Rodar Backend

Modo desenvolvimento:

```cmd
npm run dev
```

API:

```text
http://localhost:3000
```

Health:

```text
http://localhost:3000/api/health
```

Swagger:

```text
http://localhost:3000/api/docs
```

---

# 🧪 Validar Backend

TypeScript:

```cmd
npm run typecheck
```

Build:

```cmd
npm run build
```

Produção local:

```cmd
npm start
```

---

# 🎨 Frontend

Abra outro terminal.

Entre:

```cmd
cd frontend
```

Instale:

```cmd
npm install
```

Crie:

```text
frontend\.env
```

Baseado em:

```text
frontend\.env.example
```

---

# 🔑 Variáveis do Frontend

Ambiente local:

```env
VITE_API_URL=http://localhost:3000
```

Produção:

```env
VITE_API_URL=https://clinica-medica-api.vercel.app
```

Variáveis `VITE_*` ficam disponíveis no navegador.

Nunca coloque segredos nelas.

---

# ▶️ Rodar Frontend

```cmd
npm run dev
```

Acesse:

```text
http://localhost:5173
```

---

# 🏗️ Build Frontend

```cmd
npm run build
```

Arquivos de produção serão gerados em:

```text
frontend/dist
```

---

# 🧪 Testando a Aplicação

Para desenvolvimento local, utilize dois terminais.

## Terminal 1 — Backend

```cmd
cd /d C:\Projetos\clinica-medica\backend

npm run dev
```

## Terminal 2 — Frontend

```cmd
cd /d C:\Projetos\clinica-medica\frontend

npm run dev
```

Depois:

```text
http://localhost:5173
```

---

# 🔄 Fluxo da Aplicação

```text
Usuário
↓
React
↓
Express API
↓
Prisma
↓
PostgreSQL
↓
Supabase
```

O navegador nunca acessa diretamente o banco.

---

# 🚀 Deploy

O projeto utiliza dois projetos na Vercel.

## Frontend

Root Directory:

```text
frontend
```

Build:

```text
npm run build
```

Output:

```text
dist
```

## Backend

Root Directory:

```text
backend
```

O backend Express é executado utilizando a infraestrutura Serverless da Vercel.

---

# 🔐 Segurança

Algumas decisões adotadas:

- Senhas armazenadas usando bcrypt
- JWT de curta duração
- Refresh Token separado
- Refresh Token em Cookie HttpOnly
- Refresh Token armazenado como hash
- Rotação de Refresh Token
- Revogação de sessão
- Controle por perfil
- CORS com allowlist
- Validação com Zod
- Backend como única camada de acesso ao banco
- Variáveis sensíveis fora do Git
- Proteção contra duplicidade no banco
- Erros internos não expostos diretamente ao cliente

---

# 🚫 Arquivos que não devem ir para o Git

```text
.env
node_modules
dist
```

Nunca commitar:

- Senhas
- JWT_SECRET
- DATABASE_URL
- DIRECT_URL
- Credenciais Supabase
- Tokens de usuário

---

# 🌿 Git

Branch principal:

```text
main
```

Fluxo atual:

```text
alteração
↓
teste local
↓
typecheck
↓
build
↓
git add
↓
commit
↓
push
↓
deploy automático Vercel
```

Antes de qualquer commit:

```cmd
git status
```

---

# 📝 Padrão de Commits

Exemplos:

```text
feat: add patient management
fix: handle refresh token rotation
refactor: organize api architecture
docs: update project documentation
chore: update dependencies
test: add authentication tests
```

---

# 🗺️ Roadmap

## Fundação

- [x] Repositório
- [x] React + Vite
- [x] Node + Express
- [x] Deploy Vercel
- [x] PostgreSQL Supabase
- [x] Prisma
- [x] Swagger

## Autenticação

- [x] Login
- [x] Access Token
- [x] Refresh Token
- [x] Cookie HttpOnly
- [x] Refresh rotation
- [x] Logout
- [x] `/auth/me`
- [x] RBAC
- [x] Refresh automático no frontend

## Pacientes

- [x] Backend
- [x] Listagem frontend
- [x] Cadastro frontend
- [x] Edição frontend
- [x] Filtros
- [x] Paginação
- [x] Ativação/Inativação

## Próximos módulos

- [ ] Especialidades
- [ ] Médicos
- [ ] Médico × Especialidade
- [ ] Agenda médica
- [ ] Bloqueios de agenda
- [ ] Agendamentos
- [ ] Histórico de agendamentos
- [ ] Consultas
- [ ] Prontuários
- [ ] Alergias
- [ ] Receitas
- [ ] Atestados
- [ ] Auditoria

## Evoluções futuras

- [ ] PWA
- [ ] Mobile First completo
- [ ] Testes automatizados
- [ ] CI/CD
- [ ] Observabilidade
- [ ] LGPD
- [ ] Recuperação de senha
- [ ] Gerenciamento de usuários
- [ ] Auditoria completa
- [ ] Dashboard com indicadores

---

# 🏥 Clínica Médica — Galera do TI

Projeto desenvolvido para estudo, evolução técnica e construção de uma aplicação completa utilizando práticas modernas de desenvolvimento web.

```text
React
+
Node.js
+
Express
+
Prisma
+
PostgreSQL
+
Supabase
+
Vercel
```