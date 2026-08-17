# ⚙️ Clínica Médica — Backend

API responsável pelas regras de negócio, autenticação, autorização, acesso ao banco de dados e integrações do sistema Clínica Médica.

[← Voltar para o README principal](../README.md)

---

# 🧱 Tecnologias

O backend utiliza principalmente:

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Supabase
- JWT
- bcrypt
- Zod
- Swagger / OpenAPI
- Vercel

---

# 🏗️ Arquitetura

A arquitetura da aplicação segue o fluxo:

```text
Frontend React
      │
      │ HTTPS
      ▼
Node.js / Express
      │
      ├── Rotas
      ├── Middlewares
      ├── Validações
      ├── Autenticação
      ├── Autorização
      ├── Regras de negócio
      │
      ▼
    Prisma
      │
      ▼
PostgreSQL
      │
      ▼
   Supabase
```

O frontend não acessa diretamente o banco de dados.

Todas as operações passam pela API.

---

# 📂 Estrutura

A estrutura pode evoluir conforme novos módulos forem implementados, mas o backend segue uma separação baseada em responsabilidades.

Exemplo:

```text
backend/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── docs/
│   ├── errors/
│   ├── middlewares/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

# 🔄 Fluxo de uma requisição

Uma requisição normalmente percorre:

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Validação
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Response
```

Essa separação evita concentrar todas as responsabilidades em um único arquivo.

---

# 📋 Pré-requisitos

Para executar o backend localmente:

- Node.js
- npm
- Git
- acesso ao banco PostgreSQL/Supabase

Verifique:

```bash
node -v
npm -v
git --version
```

---

# 📦 Instalação

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

---

# 🔐 Variáveis de ambiente

Crie:

```text
backend/.env
```

Use o `.env.example` como referência.

Exemplo conceitual:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

JWT_SECRET="altere-esta-chave"

JWT_ACCESS_EXPIRATION_SECONDS=900
REFRESH_TOKEN_EXPIRATION_DAYS=7

FRONTEND_URL=http://localhost:5173

COOKIE_SECURE=false
COOKIE_SAME_SITE=lax

ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@clinica.local
ADMIN_PASSWORD="defina-uma-senha"
```

> Nunca envie o arquivo `.env` para o Git.

---

# 🗄️ Banco de dados

O banco utilizado é PostgreSQL hospedado no Supabase.

Fluxo:

```text
Express
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Supabase
```

O projeto utiliza conexões separadas para runtime e operações administrativas.

---

# 🔌 DATABASE_URL

Utilizada pela aplicação em execução.

Em produção, é utilizada principalmente pelo:

```text
Vercel
↓
Node
↓
Prisma
↓
Supabase
```

É recomendado utilizar o Transaction Pooler disponibilizado pelo Supabase para o ambiente serverless.

---

# 🔌 DIRECT_URL

Utilizada principalmente pelo Prisma CLI para:

- migrations
- introspecção
- operações administrativas

A configuração fica centralizada no:

```text
prisma.config.ts
```

---

# 🔷 Prisma

Validar schema:

```bash
npx prisma validate
```

Formatar:

```bash
npx prisma format
```

Gerar Prisma Client:

```bash
npx prisma generate
```

Consultar estrutura existente do banco:

```bash
npx prisma db pull
```

---

# 🔄 Migrations

O controle atual de migrations é realizado pelo Prisma.

Para desenvolvimento, quando forem realizadas alterações estruturais controladas no schema:

```bash
npx prisma migrate dev --name nome_da_migration
```

Exemplo:

```bash
npx prisma migrate dev --name add_medicos
```

Para aplicar migrations existentes em ambientes de produção:

```bash
npx prisma migrate deploy
```

As migrations devem ser versionadas no Git.

> O projeto não deve criar novas migrations Flyway. A evolução atual do banco é controlada pelo Prisma.

---

# 🗃️ Principais tabelas

A estrutura da aplicação contempla:

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

O Prisma também mantém:

```text
_prisma_migrations
```

---

# 🔐 Autenticação

A autenticação é gerenciada pela própria API.

Fluxo conceitual:

```text
E-mail + senha
      ↓
POST /api/auth/login
      ↓
Validação
      ↓
bcrypt
      ↓
Access Token
+
Refresh Token
```

O Access Token é utilizado para autenticar as requisições protegidas.

O Refresh Token permite renovar a sessão sem exigir um novo login a cada expiração do Access Token.

---

# 🍪 Refresh Token

O Refresh Token é tratado utilizando cookie HttpOnly.

Características esperadas em produção:

```text
HttpOnly
Secure
SameSite=None
```

No banco não deve ser necessário armazenar o token original.

A tabela:

```text
refresh_tokens
```

mantém o hash do token e informações necessárias para gerenciamento da sessão.

---

# 🔑 Senhas

Senhas nunca devem ser armazenadas em texto puro.

O sistema utiliza bcrypt para geração do hash.

Fluxo:

```text
Senha
 ↓
bcrypt
 ↓
Hash
 ↓
Banco
```

---

# 👥 Perfis

Perfis inicialmente previstos:

```text
ADMIN
RECEPCIONISTA
MEDICO
```

As rotas podem utilizar middlewares de autorização para limitar operações conforme o perfil autenticado.

---

# 👤 Pacientes

O módulo de pacientes contempla operações como:

- Cadastro
- Listagem
- Busca
- Consulta individual
- Atualização
- Ativação
- Inativação
- Paginação
- Filtros
- Pesquisa
- Validação de dados
- Controle de CPF duplicado

---

# 📑 Paginação

Listagens devem evitar retornar quantidades ilimitadas de registros.

Exemplo conceitual:

```http
GET /api/pacientes?page=1&limit=20
```

Filtros e busca podem ser combinados conforme o contrato da rota implementada.

---

# 🛡️ Segurança

O backend deve manter como princípios:

- Senhas com hash
- Refresh Token protegido
- Validação de entrada
- Autorização por perfil
- CORS controlado
- Não exposição de segredos
- Tratamento centralizado de erros
- Auditoria de operações relevantes
- Limitação das informações retornadas pela API

Nunca coloque em código:

```text
DATABASE_URL
DIRECT_URL
JWT_SECRET
senhas
tokens
chaves privadas
```

---

# 🌐 CORS

O backend deve aceitar somente origens conhecidas.

Desenvolvimento:

```text
http://localhost:5173
```

Produção:

```text
https://clinica-medica-galera-do-ti.vercel.app
```

Ao adicionar novos ambientes, atualize a configuração de origens permitidas.

---

# 🩺 Health Check

A API possui endpoint para verificar se está funcionando:

```http
GET /api/health
```

Produção:

```text
https://clinica-medica-api.vercel.app/api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "clinica-medica-api"
}
```

---

# 🗄️ Database Health

Também existe validação da comunicação da API com o banco de dados.

Essa rota é útil para verificar o fluxo:

```text
API
 ↓
Prisma
 ↓
Supabase
```

---

# 📖 Swagger

A API possui documentação interativa utilizando Swagger/OpenAPI.

Produção:

```text
https://clinica-medica-api.vercel.app/api/docs
```

O Swagger deve acompanhar a evolução das rotas.

Sempre que uma rota for criada ou alterada, sua documentação correspondente também deve ser atualizada.

---

# ▶️ Desenvolvimento

Execute:

```bash
npm run dev
```

A API ficará disponível por padrão em:

```text
http://localhost:3000
```

---

# 🔍 Typecheck

Antes de realizar commit:

```bash
npm run typecheck
```

O comando deve terminar sem erros.

---

# 🏗️ Build

Execute:

```bash
npm run build
```

O TypeScript será compilado para:

```text
dist/
```

---

# ▶️ Produção local

Depois do build:

```bash
npm start
```

---

# 🧪 Fluxo recomendado antes do commit

Execute:

```bash
npm run typecheck
npm run build
```

Depois inicie:

```bash
npm run dev
```

Valide as rotas principais utilizando:

- Postman
- Swagger
- Frontend

---

# 🚀 Deploy

O backend está hospedado na Vercel.

Produção:

```text
https://clinica-medica-api.vercel.app
```

Fluxo:

```text
Código
 ↓
Git
 ↓
GitHub
 ↓
Vercel
 ↓
Build
 ↓
Deploy
```

---

# ⚙️ Variáveis na Vercel

As variáveis de produção devem ser configuradas diretamente no ambiente da Vercel.

Exemplos:

```text
NODE_ENV
DATABASE_URL
DIRECT_URL
JWT_SECRET
JWT_ACCESS_EXPIRATION_SECONDS
REFRESH_TOKEN_EXPIRATION_DAYS
FRONTEND_URL
COOKIE_SECURE
COOKIE_SAME_SITE
```

Nunca copie valores secretos para este README.

---

# 🧪 Postman

Durante o desenvolvimento, as APIs podem ser testadas utilizando Postman.

Ambiente local:

```text
http://localhost:3000
```

Produção:

```text
https://clinica-medica-api.vercel.app
```

É recomendado manter ambientes separados no Postman para evitar alterar URLs manualmente.

---

# 📌 Comandos úteis

Instalar dependências:

```bash
npm install
```

Executar:

```bash
npm run dev
```

Typecheck:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Produção local:

```bash
npm start
```

Prisma:

```bash
npx prisma validate
npx prisma format
npx prisma generate
```

Migrations de produção:

```bash
npx prisma migrate deploy
```

---

# 📚 Documentação relacionada

[← README principal](../README.md)

[🎨 Documentação do Frontend](../frontend/README.md)