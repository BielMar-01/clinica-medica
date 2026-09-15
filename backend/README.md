⚙️ Clínica Médica — Backend

API responsável pelas regras de negócio, autenticação, autorização, acesso ao banco de dados e integrações do sistema Clínica Médica — Galera do TI.

← Voltar para o README principal

🧱 Tecnologias

O backend utiliza principalmente:

Node.js

TypeScript

Express

Prisma ORM

PostgreSQL

Supabase

JWT

bcrypt

Zod

Resend

Swagger / OpenAPI

Vercel

🏗️ Arquitetura

A aplicação segue uma arquitetura baseada em responsabilidades:

Frontend React
│
│ HTTPS
▼
Node.js / Express
│
├── Rotas
├── Middlewares
├── Validações
├── Controllers
├── Services
├── Repositories
├── Autenticação
├── Autorização
└── Regras de negócio
│
▼
Prisma
│
▼
PostgreSQL
│
▼
Supabase

O frontend não acessa diretamente o banco de dados.

Todas as operações passam pela API.

📂 Estrutura

A estrutura evolui conforme novos módulos são implementados.

backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── docs/
│   ├── errors/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md

🔄 Fluxo de uma requisição

Uma requisição normalmente percorre:

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
Repository
↓
Prisma
↓
PostgreSQL
↓
Response

Essa separação ajuda a manter regras de negócio, acesso a dados e transporte HTTP desacoplados.

📋 Pré-requisitos

Para executar o backend localmente:

Node.js

npm

Git

acesso ao banco PostgreSQL/Supabase

Verifique:

node -v
npm -v
git --version

📦 Instalação

No Windows:

cd /d C:\Projetos\clinica-medica\backend
npm install

🔐 Variáveis de ambiente

Crie:

backend/.env

Use o .env.example como referência.

Exemplo conceitual:

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

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME="Clínica Médica"

Nunca envie o arquivo .env para o Git.

Nunca coloque chaves reais em .env.example, README, código-fonte ou commits.

Em produção, o domínio/remetente utilizado pelo Resend deve ser devidamente configurado e validado.

🗄️ Banco de dados

O banco utilizado é PostgreSQL hospedado no Supabase.

Express
↓
Prisma
↓
PostgreSQL
↓
Supabase

O projeto utiliza conexões separadas para runtime e operações administrativas.

🔌 DATABASE_URL

Utilizada pela aplicação em execução.

Em produção:

Vercel
↓
Node.js
↓
Prisma
↓
Supabase

Para ambiente serverless, a conexão deve seguir a configuração apropriada do Supabase.

🔌 DIRECT_URL

Utilizada principalmente pelo Prisma CLI em tarefas administrativas e de introspecção.

A configuração fica centralizada em:

prisma.config.ts

🔷 Prisma

Validar o schema:

npx prisma validate

Formatar:

npx prisma format

Gerar Prisma Client:

npx prisma generate

Consultar a estrutura atual do banco:

npx prisma db pull

🔄 Evolução do banco

No estado atual do projeto, alterações estruturais podem ser realizadas diretamente no PostgreSQL/Supabase e depois refletidas no Prisma por introspecção:

npx prisma db pull
npx prisma generate

Antes de alterar estruturas de banco:

revisar o impacto;

aplicar a alteração de forma controlada no ambiente adequado;

executar prisma db pull;

revisar o schema.prisma;

executar prisma validate;

executar prisma generate;

validar typecheck e build.

Não criar migrations automaticamente sem revisar a estratégia atual do projeto.

🗃️ Principais tabelas

A estrutura contempla, entre outras:

usuarios
refresh_tokens
codigos_redefinicao_senha

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

A tabela codigos_redefinicao_senha dá suporte ao fluxo de recuperação de senha e primeiro acesso.

🔐 Autenticação

A autenticação é gerenciada pela própria API.

Fluxo principal:

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

O Access Token é utilizado no header Authorization das rotas protegidas.

O Refresh Token permite renovar a sessão sem exigir um novo login enquanto a sessão ainda for válida.

🍪 Refresh Token

O Refresh Token é tratado utilizando cookie HttpOnly.

Em produção, a configuração deve considerar:

HttpOnly
Secure
SameSite

No banco, é armazenada uma representação segura do token, e não é necessário persistir o token original em texto puro.

A tabela responsável é:

refresh_tokens

Ao redefinir a senha ou inativar um usuário, sessões existentes relacionadas ao usuário podem ser revogadas.

🔑 Senhas

Senhas nunca devem ser armazenadas em texto puro.

O sistema utiliza bcrypt para geração do hash.

Senha
↓
bcrypt
↓
Hash
↓
Banco

A senha informada durante login também é comparada através do bcrypt.

🔁 Recuperação de senha

O sistema possui fluxo de recuperação de senha por código enviado por e-mail.

Fluxo:

Usuário informa e-mail
↓
POST /api/auth/forgot-password
↓
Código de 6 dígitos
↓
Hash do código no banco
↓
Envio pelo Resend
↓
POST /api/auth/verify-reset-code
↓
resetToken temporário
↓
POST /api/auth/reset-password
↓
Nova senha
↓
Sessões anteriores revogadas

Regras atuais

código numérico de 6 dígitos;

validade do código: 10 minutos;

máximo de 5 tentativas;

código de uso único;

código armazenado com hash;

novo código invalida códigos anteriores ativos;

resetToken temporário;

resetToken de uso único;

senha mínima de 8 caracteres;

confirmação de senha obrigatória;

redefinição de senha revoga refresh tokens ativos;

resposta do forgot-password não revela se o e-mail está cadastrado.

Endpoints

POST /api/auth/forgot-password
POST /api/auth/verify-reset-code
POST /api/auth/reset-password

✉️ Resend

O Resend é utilizado para envio de e-mails relacionados à recuperação de senha e primeiro acesso.

Variáveis relacionadas:

RESEND_API_KEY
RESEND_FROM_EMAIL
RESEND_FROM_NAME

A chave da API é um segredo e deve existir apenas nos ambientes autorizados.

Nunca versione:

API keys
tokens
senhas
credenciais SMTP
segredos de autenticação

👥 Perfis

Perfis internos atuais:

ADMIN
RECEPCIONISTA
MEDICO

As rotas utilizam middlewares de autenticação e autorização para restringir operações conforme o perfil autenticado.

A autorização real deve sempre acontecer no backend.

👥 Gerenciamento de usuários

O gerenciamento de usuários internos é restrito ao perfil:

ADMIN

Funcionalidades implementadas:

listagem;

paginação;

filtro por nome;

filtro por e-mail;

filtro por perfil;

filtro por status;

consulta por ID;

cadastro;

edição;

ativação;

inativação.

Endpoints

GET   /api/usuarios
GET   /api/usuarios/
POST  /api/usuarios
PUT   /api/usuarios/
PATCH /api/usuarios//status

Cadastro

O cadastro não é público.

Somente um administrador pode criar contas internas.

Campos:

nome
email
perfil

Perfis aceitos:

ADMIN
RECEPCIONISTA
MEDICO

📨 Primeiro acesso

Ao criar um usuário:

ADMIN cadastra usuário
↓
API gera senha interna aleatória
↓
Senha interna é armazenada com hash
↓
API gera código de redefinição
↓
Resend envia o código
↓
Usuário define a própria senha

O administrador não recebe e não conhece a senha definitiva do novo usuário.

Se o envio do e-mail de primeiro acesso falhar, o cadastro criado é removido e a operação retorna erro.

Um usuário com perfil MEDICO ainda não cria automaticamente um registro no domínio de médicos. Essa associação será tratada no módulo de Médicos.

🛡️ Regras de gerenciamento de usuários

E-mail duplicado

Não é permitido criar ou editar um usuário utilizando um e-mail já associado a outro usuário.

Código de erro:

USER_EMAIL_ALREADY_EXISTS

Auto-inativação

Um administrador não pode inativar a própria conta.

Código:

CANNOT_DISABLE_OWN_USER

Alteração do próprio perfil ADMIN

Um administrador não pode remover o perfil ADMIN da própria conta.

Código:

CANNOT_CHANGE_OWN_ADMIN_ROLE

Status repetido

Tentar ativar um usuário já ativo ou inativar um usuário já inativo retorna conflito.

Possíveis códigos:

USER_ALREADY_ACTIVE
USER_ALREADY_INACTIVE

Usuário inexistente

USER_NOT_FOUND

Inativação

Ao inativar um usuário, os refresh tokens ativos relacionados a ele são revogados.

👤 Pacientes

O módulo de pacientes contempla:

cadastro;

listagem;

consulta;

atualização;

ativação;

inativação;

paginação;

filtros;

pesquisa;

validação de dados;

controle de CPF duplicado.

🩺 Especialidades

O módulo de especialidades contempla:

cadastro;

listagem;

consulta por ID;

atualização;

ativação;

inativação;

paginação;

filtro por nome;

filtro por status;

prevenção de nomes duplicados.

Consultas são permitidas aos perfis autorizados.

Operações administrativas de escrita são restritas conforme RBAC.

🩺 Médicos

O módulo de médicos gerencia o cadastro profissional dos usuários com perfil MEDICO.

O cadastro de autenticação e o cadastro profissional são entidades distintas:

usuarios
   ↓ 1:1
medicos
   ↓ N:N
medicos_especialidades
   ↓
especialidades

Um usuário deve ser criado primeiro pelo módulo de Usuários. O cadastro de um usuário com perfil MEDICO não cria automaticamente o registro profissional em medicos.

Funcionalidades

cadastro de médico;

listagem;

consulta por ID;

atualização;

ativação e inativação;

paginação;

filtro por nome;

filtro por CRM;

filtro por UF do CRM;

filtro por especialidade;

filtro por status;

associação de múltiplas especialidades;

definição de uma especialidade principal.

Endpoints

GET   /api/medicos
GET   /api/medicos/:id
POST  /api/medicos
PUT   /api/medicos/:id
PATCH /api/medicos/:id/status

RBAC

Consultas (GET) são permitidas para:

ADMIN;

RECEPCIONISTA;

MEDICO.

Cadastro, edição e alteração de status são restritos ao perfil:

ADMIN.

Regras de negócio

Para cadastrar ou editar um médico:

o usuário vinculado deve existir;

o usuário deve estar ativo;

o usuário deve possuir perfil MEDICO;

um usuário não pode estar vinculado a mais de um médico;

a combinação CRM + UF deve ser única;

deve existir pelo menos uma especialidade;

deve existir exatamente uma especialidade principal;

uma mesma especialidade não pode ser informada duas vezes;

novas associações somente podem utilizar especialidades existentes e ativas.

A inativação do registro profissional não inativa automaticamente a conta em usuarios. Os dois status possuem responsabilidades diferentes.

Exemplo de cadastro

{
  "usuarioId": "2",
  "nomeCompleto": "Dr. João da Silva",
  "crmNumero": "123456",
  "crmUf": "SP",
  "telefone": "11999999999",
  "email": "medico@clinica.local",
  "duracaoConsultaMinutos": 30,
  "especialidades": [
    {
      "especialidadeId": "1",
      "principal": true
    }
  ]
}

Filtros e paginação

Exemplo:

GET /api/medicos?page=1&limit=20&nome=João&crmUf=SP&especialidadeId=1&ativo=true

Os filtros disponíveis são:

nome;

crm;

crmUf;

especialidadeId;

ativo;

page;

limit.

Arquitetura do módulo

doctor.schema.ts
      ↓
doctor.controller.ts
      ↓
doctor.service.ts
      ↓
doctor.repository.ts
      ↓
Prisma
      ↓
PostgreSQL

O schema valida o formato da entrada; o service concentra as regras de negócio; o repository concentra o acesso aos dados e utiliza transações nas operações que alteram médico e especialidades.

📑 Paginação

Listagens devem evitar retornar quantidades ilimitadas de registros.

Exemplos:

GET /api/pacientes?page=1&limit=20
GET /api/especialidades?page=1&limit=20
GET /api/usuarios?page=1&limit=20
GET /api/medicos?page=1&limit=20

Filtros podem ser combinados conforme o contrato de cada rota.

🛡️ Segurança

Princípios adotados:

senhas com hash;

códigos de redefinição com hash;

reset token protegido;

refresh token protegido;

validação de entrada com Zod;

autorização por perfil;

CORS controlado;

não exposição de segredos;

tratamento centralizado de erros;

revogação de sessões quando necessário;

limitação das informações retornadas pela API;

proteção contra reutilização de token de redefinição;

auditoria prevista para operações relevantes.

Nunca coloque em código ou documentação:

DATABASE_URL real
DIRECT_URL real
JWT_SECRET real
senhas
tokens
API keys
chaves privadas

🌐 CORS

O backend deve aceitar somente origens conhecidas.

Desenvolvimento:

http://localhost:5173

Produção:

https://clinica-medica-galera-do-ti.vercel.app

Ao adicionar novos ambientes, atualize a configuração de origens permitidas.

🩺 Health Check

Endpoint:

GET /api/health

Produção:

https://clinica-medica-api.vercel.app/api/health

Resposta esperada:

{
"status": "ok",
"service": "clinica-medica-api"
}

🗄️ Database Health

A API também possui validação da comunicação com o banco de dados.

API
↓
Prisma
↓
Supabase

📖 Swagger

A API possui documentação interativa utilizando Swagger/OpenAPI.

Produção:

https://clinica-medica-api.vercel.app/api/docs

Atualmente a documentação contempla:

Health
Database
Authentication
Pacientes
Especialidades
Usuários
Médicos
Internal

O Swagger deve acompanhar a evolução das rotas.

Sempre que uma rota for criada ou alterada, a documentação correspondente deve ser atualizada.

▶️ Desenvolvimento

No Windows:

cd /d C:\Projetos\clinica-medica\backend
npm run dev

Por padrão:

http://localhost:3000

🔍 Typecheck

Antes de realizar commit:

npm run typecheck

O comando deve terminar sem erros.

🏗️ Build

Execute:

npm run build

O TypeScript será compilado para:

dist/

▶️ Produção local

Depois do build:

npm start

🧪 Fluxo recomendado antes do commit

Execute:

cd /d C:\Projetos\clinica-medica\backend
npm run typecheck
npm run build

Depois:

npm run dev

Valide as rotas principais usando:

Postman;

Swagger;

frontend.

Para alterações de autenticação ou usuários, validar também:

login;

refresh;

logout;

recuperação de senha;

redefinição de senha;

listagem de usuários;

criação de usuário;

edição;

ativação/inativação;

permissões por perfil.

Para alterações no módulo de médicos, validar também:

cadastro com usuário MEDICO ativo;

CRM + UF duplicado;

vínculo de usuário já utilizado;

especialidades existentes e ativas;

exatamente uma especialidade principal;

edição;

ativação/inativação;

filtros e paginação;

permissões por perfil.

🚀 Deploy

O backend está hospedado na Vercel.

Produção:

https://clinica-medica-api.vercel.app

Fluxo:

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

⚙️ Variáveis na Vercel

As variáveis de produção devem ser configuradas diretamente no ambiente da Vercel.

Exemplos:

NODE_ENV
DATABASE_URL
DIRECT_URL

JWT_SECRET
JWT_ACCESS_EXPIRATION_SECONDS
REFRESH_TOKEN_EXPIRATION_DAYS

FRONTEND_URL

COOKIE_SECURE
COOKIE_SAME_SITE

RESEND_API_KEY
RESEND_FROM_EMAIL
RESEND_FROM_NAME

Nunca copie valores secretos para este README.

🧪 Postman

As APIs podem ser testadas utilizando Postman.

Local:

http://localhost:3000

Produção:

https://clinica-medica-api.vercel.app

É recomendado manter ambientes separados no Postman.

📌 Comandos úteis

Instalar dependências:

npm install

Executar:

npm run dev

Typecheck:

npm run typecheck

Build:

npm run build

Produção local:

npm start

Prisma:

npx prisma validate
npx prisma format
npx prisma generate
npx prisma db pull

🗺️ Estado dos módulos

Autenticação       ✅
Dashboard          ✅
Pacientes          ✅
Especialidades     ✅
Usuários           ✅
Médicos            ✅
Agenda Médica      ⏳
Agendamentos       ⏳
Consultas          ⏳
Prontuário         ⏳
Receitas           ⏳
Atestados          ⏳
Auditoria          ⏳

A próxima grande etapa de domínio é o módulo de Agenda Médica.

📚 Documentação relacionada

← README principal

🎨 Documentação do Frontend