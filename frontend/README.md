🏥 Clínica Médica — Frontend

Aplicação web responsável pela interface utilizada pelos profissionais da Clínica Médica — Galera do TI.

← Voltar para o README principal

🧱 Tecnologias

O frontend utiliza principalmente:

React

TypeScript

Vite

CSS

React Router

Fetch API / camada HTTP própria

Vercel

A aplicação está sendo construída com foco em:

Responsividade

Mobile First

Componentização

Segurança

Acessibilidade

Testabilidade

Evolução futura para PWA

🏗️ Arquitetura

O frontend nunca acessa diretamente o banco de dados.

Fluxo:

Usuário
  ↓
React
  ↓
Camada HTTP
  ↓
API Node / Express
  ↓
Prisma
  ↓
PostgreSQL

Todas as regras de negócio relevantes devem ser validadas pelo backend.

O frontend pode aplicar validações e controles visuais para melhorar a experiência do usuário, mas essas validações não substituem as regras implementadas na API.

📂 Estrutura

A estrutura evolui conforme novos módulos são implementados.

Estrutura atual:

frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── patients/
│   │   ├── specialties/
│   │   └── users/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── .env
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

Os módulos devem manter a separação entre:

Componentes
Páginas
Serviços
Tipos
Rotas
Contextos

📋 Pré-requisitos

Para executar o frontend:

Node.js

npm

Git

Verifique:

node -v
npm -v
git --version

📦 Instalação

No Windows:

cd /d C:\Projetos\clinica-medica\frontend
npm install

🔐 Variáveis de ambiente

Crie:

frontend/.env

Exemplo local:

VITE_API_URL=http://localhost:3000

Produção:

VITE_API_URL=https://clinica-medica-api.vercel.app

⚠️ Variáveis VITE

Variáveis iniciadas por:

VITE_

são incorporadas ao frontend durante o build.

Portanto:

Não coloque segredos em variáveis VITE_*.

Nunca utilize no frontend:

DATABASE_URL
DIRECT_URL
JWT_SECRET
senhas
chaves privadas
Resend API Key
Supabase Secret Key

🌐 Camada HTTP

A comunicação com a API fica centralizada na camada de serviços.

Arquivo principal:

src/services/api.ts

Fluxo:

Página / Componente
       ↓
Service do módulo
       ↓
api.ts
       ↓
Backend

Services atuais incluem:

auth.service.ts
patient.service.ts
specialty.service.ts
user.service.ts

Essa estrutura facilita:

tratamento de erros;

autenticação;

renovação de sessão;

configuração de headers;

manutenção;

testes;

evolução dos módulos.

🔐 Autenticação

Fluxo principal:

Tela de Login
     ↓
POST /api/auth/login
     ↓
API valida usuário
     ↓
Sessão criada
     ↓
Frontend recebe autenticação
     ↓
Usuário entra no sistema

A aplicação possui fluxo de autenticação integrado ao backend.

🔄 Renovação da sessão

A camada HTTP trata a expiração do Access Token.

Request
   ↓
401
   ↓
Refresh
   ↓
Novo Access Token
   ↓
Repete Request

Isso evita redirecionar imediatamente o usuário para login quando ainda existe uma sessão válida.

🍪 Cookies

Quando a autenticação utiliza Refresh Token via cookie HttpOnly, requisições relacionadas à sessão precisam enviar credenciais.

Conceitualmente:

credentials: 'include'

O JavaScript do navegador não acessa diretamente o Refresh Token.

🔁 Recuperação de senha

O frontend possui fluxo completo de recuperação de senha.

Rotas:

/forgot-password
/verify-reset-code
/reset-password

Fluxo:

/login
  ↓
/forgot-password
  ↓
Usuário informa e-mail
  ↓
API envia código
  ↓
/verify-reset-code
  ↓
Usuário informa código
  ↓
API retorna resetToken
  ↓
/reset-password
  ↓
Usuário define nova senha
  ↓
/login

Esqueci minha senha

A tela:

/forgot-password

permite informar o e-mail e solicitar o código de recuperação.

Após sucesso, o e-mail informado é enviado por React Router state para a próxima etapa.

Verificação do código

A tela:

/verify-reset-code

aceita código numérico de 6 dígitos.

Regras visuais:

somente números;

máximo de 6 caracteres;

não permite envio com quantidade incorreta;

trata erros retornados pela API.

Após validação, o resetToken é enviado via estado de navegação para a tela seguinte.

Nova senha

A tela:

/reset-password

permite:

informar nova senha;

confirmar nova senha;

validar mínimo de 8 caracteres;

validar igualdade entre senha e confirmação.

Se não existir resetToken válido no fluxo de navegação, o usuário é redirecionado para:

/forgot-password

🛡️ Rotas protegidas

Rotas internas atualmente implementadas:

/dashboard
/pacientes
/especialidades
/usuarios

Rotas públicas relacionadas à autenticação:

/login
/forgot-password
/verify-reset-code
/reset-password

Rotas futuras incluem:

/medicos
/agendamentos
/consultas

Usuários sem sessão válida que tentarem acessar páginas internas devem ser redirecionados para:

/login

👥 Permissões

Perfis:

ADMIN
RECEPCIONISTA
MEDICO

Visão atual:

ADMIN
 ├── Dashboard
 ├── Pacientes
 ├── Especialidades
 └── Usuários

RECEPCIONISTA
 ├── Dashboard
 └── Pacientes

MEDICO
 ├── Dashboard
 ├── Consulta de pacientes
 └── Consulta de especialidades

As funcionalidades futuras ampliarão as permissões de RECEPCIONISTA e MEDICO conforme os módulos forem implementados.

A autorização real deve sempre continuar sendo validada pelo backend.

Ocultar um botão ou link no frontend não é uma regra de segurança suficiente.

🏠 Dashboard

Disponível em:

/dashboard

O Dashboard é o ponto inicial da área autenticada.

Futuramente poderá apresentar:

quantidade de pacientes;

agendamentos;

consultas;

informações de agenda;

indicadores operacionais;

atalhos.

👤 Módulo de Pacientes

Rota:

/pacientes

O módulo contempla:

listagem;

pesquisa;

filtros;

ordenação;

paginação;

cadastro;

edição;

ativação;

inativação;

loading;

erro;

estado vazio;

controle visual de permissões.

🔎 Filtros de pacientes

A tela permite combinar critérios como:

Nome
CPF
Telefone
Status

Também existe organização por ordenação para facilitar a consulta dos registros.

Ao executar nova busca, a paginação retorna para a primeira página.

📄 Paginação de pacientes

Fluxo:

Página
  ↓
API
  ↓
Resultados + paginação
  ↓
Tabela
  ↓
Anterior / Próxima

🔐 Permissões de pacientes

Operações de gerenciamento são disponibilizadas para:

ADMIN
RECEPCIONISTA

O perfil:

MEDICO

possui acesso de consulta conforme as permissões do backend.

🩺 Módulo de Especialidades

Rota:

/especialidades

Funcionalidades:

listagem;

pesquisa por nome;

filtro por status;

paginação;

cadastro;

edição;

ativação;

inativação;

confirmação de status;

tratamento de duplicidade;

loading;

erro;

estado vazio;

controle visual de permissões.

🔎 Filtros de especialidades

Filtros:

Nome
Status

Status:

Todos
Ativas
Inativas

📄 Paginação de especialidades

A interface apresenta:

Anterior
Página atual
Total de páginas
Total de especialidades
Próxima

✏️ Cadastro e edição de especialidades

Campos atuais:

Nome
Descrição

O formulário trata erros retornados pela API, inclusive duplicidade de nome.

🔄 Ativação e inativação de especialidades

Fluxo:

Usuário seleciona ação
        ↓
Confirmação
        ↓
PATCH /api/especialidades/:id/status
        ↓
Backend atualiza
        ↓
Frontend recarrega a listagem

🔐 Permissões de especialidades

Consulta:

ADMIN
RECEPCIONISTA
MEDICO

Gerenciamento:

ADMIN

👥 Módulo de Usuários

Rota:

/usuarios

Disponível somente para:

ADMIN

O módulo contempla:

listagem;

paginação;

filtro por nome;

filtro por e-mail;

filtro por perfil;

filtro por status;

cadastro;

edição;

ativação;

inativação;

mensagens de sucesso;

mensagens de erro;

proteção contra auto-inativação.

🔎 Filtros de usuários

Filtros disponíveis:

Nome
E-mail
Perfil
Status

Perfis:

ADMIN
RECEPCIONISTA
MEDICO

Status:

Todos
Ativos
Inativos

➕ Cadastro de usuários

O cadastro é realizado através de modal.

Campos:

Nome
E-mail
Perfil

Não existe cadastro público.

O administrador cria o usuário e o backend envia um código para o fluxo de primeiro acesso.

O administrador não define nem conhece a senha definitiva do novo usuário.

✏️ Edição de usuários

É possível editar:

Nome
E-mail
Perfil

O frontend apresenta mensagens retornadas pela API para situações como:

e-mail duplicado;

usuário não encontrado;

tentativa de remover o perfil ADMIN da própria conta.

🔄 Ativação e inativação de usuários

O usuário ADMIN pode ativar ou inativar outras contas.

Antes da alteração, é exibida confirmação.

Fluxo:

ADMIN seleciona Ativar/Inativar
        ↓
Confirmação
        ↓
PATCH /api/usuarios/:id/status
        ↓
Backend valida regra
        ↓
Frontend atualiza listagem

A própria conta autenticada não pode ser inativada pela interface.

A regra também é validada pelo backend.

📨 Primeiro acesso

Fluxo conceitual:

ADMIN cadastra usuário
        ↓
Backend cria usuário
        ↓
Backend envia código por e-mail
        ↓
Usuário segue recuperação de senha
        ↓
Usuário define a própria senha
        ↓
Login normal

Um usuário com perfil MEDICO não cria automaticamente um registro de médico.

O vínculo com o domínio de Médicos será tratado no módulo correspondente.

🌐 APIs utilizadas pelo módulo de usuários

GET    /api/usuarios
GET    /api/usuarios/:id
POST   /api/usuarios
PUT    /api/usuarios/:id
PATCH  /api/usuarios/:id/status

⏳ Estados da interface

Telas que carregam dados devem considerar:

Loading
Success
Empty
Error

A interface deve apresentar mensagens compreensíveis e evitar expor detalhes internos desnecessários.

⚠️ Tratamento de erros

A camada HTTP normaliza erros vindos da API.

A interface deve:

exibir mensagens compreensíveis;

evitar detalhes internos;

manter o usuário informado;

preservar o estado da tela quando possível;

permitir correção dos dados.

Exemplos:

Credenciais inválidas
Código inválido
Token expirado
Senhas diferentes
CPF já cadastrado
Especialidade já cadastrada
E-mail de usuário já cadastrado
Usuário sem permissão
Registro não encontrado
Erro de comunicação com a API

📱 Mobile First

As telas devem considerar primeiro dispositivos menores.

Smartphone
   ↓
Tablet
   ↓
Notebook
   ↓
Desktop

Isso é importante para uso futuro da aplicação em diferentes dispositivos dentro da clínica.

📲 PWA

O projeto prevê evolução para Progressive Web App.

Futuramente:

Manifest;

ícones;

Service Worker;

instalação;

estratégias de cache;

página offline.

Recursos relacionados a dados clínicos exigirão cuidado especial com armazenamento local.

♿ Acessibilidade

A interface deve evoluir considerando:

HTML semântico;

labels;

navegação por teclado;

foco visível;

contraste;

mensagens de erro compreensíveis;

elementos interativos identificáveis;

responsividade;

ARIA quando necessário.

▶️ Desenvolvimento

No Windows:

cd /d C:\Projetos\clinica-medica\frontend
npm run dev

Por padrão:

http://localhost:5173

🧹 Lint

Antes do commit:

npm run lint

O comando deve terminar sem erros.

🏗️ Build

Antes do commit ou deploy:

npm run build

O build é gerado em:

dist/

👀 Preview

Quando necessário:

npm run preview

🧪 Validação recomendada

Antes do commit:

cd /d C:\Projetos\clinica-medica\frontend
npm run lint
npm run build

Depois valide manualmente:

Login
 ↓
Dashboard
 ↓
Pacientes
 ↓
Especialidades
 ↓
Usuários
 ↓
Logout

Também validar:

Forgot Password
Verify Reset Code
Reset Password
Rota protegida
Refresh de sessão
Permissões
Loading
Empty state
Erros

🚀 Deploy

O frontend está hospedado na Vercel.

Produção:

https://clinica-medica-galera-do-ti.vercel.app

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

⚙️ Configuração na Vercel

Variável principal:

VITE_API_URL

Produção:

https://clinica-medica-api.vercel.app

Depois de alterar variáveis Vite, normalmente é necessário um novo deploy.

🔗 Ambientes

Frontend local:

http://localhost:5173

Backend local:

http://localhost:3000

Frontend produção:

https://clinica-medica-galera-do-ti.vercel.app

Backend produção:

https://clinica-medica-api.vercel.app

Swagger:

https://clinica-medica-api.vercel.app/api/docs

🧪 Fluxo local completo

Terminal 1:

cd /d C:\Projetos\clinica-medica\backend
npm run dev

Terminal 2:

cd /d C:\Projetos\clinica-medica\frontend
npm run dev

Fluxo:

localhost:5173
      ↓
localhost:3000
      ↓
Supabase PostgreSQL

📌 Comandos úteis

Instalar:

npm install

Executar:

npm run dev

Lint:

npm run lint

Build:

npm run build

Preview:

npm run preview

🔒 Boas práticas

Nunca:

armazenar senhas no frontend;

colocar JWT Secret no frontend;

acessar PostgreSQL diretamente;

colocar Supabase Secret Key no bundle;

colocar Resend API Key no frontend;

confiar apenas em permissões visuais;

versionar credenciais;

utilizar dados sensíveis reais em testes automatizados.

Sempre:

utilizar a API;

tratar erros;

validar estados;

proteger páginas;

respeitar permissões;

manter responsividade;

executar lint e build;

utilizar seletores estáveis.

🧪 Seletores para testes e automação QA

O frontend utiliza data-testid nos principais elementos para facilitar:

testes manuais;

Cypress;

Playwright;

evidências;

regressão;

E2E.

A aplicação não adiciona data-testid indiscriminadamente.

Eles são utilizados em elementos relevantes para interação, validação e automação.

📏 Convenção

Padrão:

modulo-elemento-finalidade

Exemplos:

login-email-input
login-password-input
login-submit-button

nav-dashboard-link
nav-patients-link
nav-specialties-link
nav-users-link

patients-new-button
patients-table

specialties-new-button
specialties-table

users-new-button
users-table

🔐 Seletores de Login

login-page
login-email-input
login-password-input
login-submit-button
login-error-message

🔁 Seletores de recuperação de senha

Os elementos das telas de recuperação devem utilizar identificadores estáveis seguindo a mesma convenção.

Exemplos de referência:

forgot-password-page
forgot-password-email-input
forgot-password-submit-button
forgot-password-error-message

verify-reset-code-page
verify-reset-code-input
verify-reset-code-submit-button
verify-reset-code-error-message

reset-password-page
reset-password-new-password-input
reset-password-confirm-password-input
reset-password-submit-button
reset-password-error-message

Os nomes efetivos devem permanecer alinhados ao código da aplicação.

🧭 Seletores de navegação

Principais:

app-layout
app-sidebar
sidebar-brand
sidebar-brand-title
sidebar-brand-description
sidebar-navigation

nav-dashboard-link
nav-patients-link
nav-specialties-link
nav-users-link

sidebar-user-section
sidebar-user-name
sidebar-user-role
logout-button
app-content

O link de Usuários é exibido somente para ADMIN.

🏠 Seletores do Dashboard

dashboard-page
dashboard-title
dashboard-patients-card

Novos elementos devem seguir a mesma convenção.

👤 Seletores de Pacientes

Página

patients-page
patients-new-button

Filtros

patients-filters
patients-name-filter-input
patients-cpf-filter-input
patients-phone-filter-input
patients-status-filter-select
patients-search-button
patients-clear-filters-button

Tabela

patients-table
patients-table-body

Registros dinâmicos

patient-row-{id}
patient-edit-button-{id}
patient-status-button-{id}

Estados

patients-loading
patients-empty-state
patients-error-message

Paginação

patients-pagination
patients-previous-page-button
patients-pagination-info
patients-next-page-button

Formulário

patient-form-*
patient-name-input
patient-cpf-input
patient-birth-date-input
patient-sex-select
patient-phone-input
patient-secondary-phone-input
patient-email-input
patient-mother-name-input
patient-zip-code-input
patient-state-input
patient-address-input
patient-address-number-input
patient-address-complement-input
patient-neighborhood-input
patient-city-input
patient-notes-input

🩺 Seletores de Especialidades

Página

specialties-page
specialties-page-header
specialties-page-title
specialties-page-description
specialties-content

Navegação

nav-specialties-link

Ações

specialties-new-button

Filtros

specialties-filters
specialties-filters-fields
specialties-filter-actions
specialties-name-filter-input
specialties-status-filter-select
specialties-search-button
specialties-clear-filters-button

Tabela

specialties-table-card
specialties-table-wrapper
specialties-table
specialties-table-header
specialties-table-body

Registros dinâmicos

specialty-row-{id}
specialty-name-{id}
specialty-description-{id}
specialty-status-{id}
specialty-actions-{id}
specialty-edit-button-{id}
specialty-status-button-{id}

Formulário

specialty-form-modal-backdrop
specialty-form-modal
specialty-form-header
specialty-form-title
specialty-form-description
specialty-form
specialty-form-fields
specialty-name-input
specialty-description-input
specialty-form-error-message
specialty-form-actions
specialty-form-cancel-button
specialty-form-submit-button
specialty-form-close-button

Paginação

specialties-pagination
specialties-previous-page-button
specialties-pagination-info
specialties-next-page-button

Estados

specialties-loading
specialties-empty-state
specialties-error-message

👥 Seletores de Usuários

Página

users-page
users-page-header
users-page-title
users-page-description

Ações

users-new-button

Mensagens

users-success-message
users-error-message

Filtros

users-filters
users-name-filter
users-email-filter
users-role-filter
users-status-filter
users-search-button
users-clear-filters-button

Tabela

users-table-card
users-table
users-loading
users-empty-message

Registros dinâmicos

users-row-{id}
users-name-{id}
users-email-{id}
users-role-{id}
users-last-login-{id}
users-status-{id}
users-actions-{id}
users-edit-button-{id}
users-status-button-{id}

Paginação

users-pagination
users-pagination-info
users-previous-page-button
users-next-page-button

🔄 Elementos dinâmicos

Para registros específicos, utilizar o ID da entidade.

Exemplos:

patient-row-{id}
specialty-row-{id}
users-row-{id}

A mesma ideia deve ser aplicada aos próximos módulos:

doctor-row-{id}
appointment-row-{id}
consultation-row-{id}

✅ Onde utilizar data-testid

Principalmente em:

páginas;

formulários;

inputs;

selects;

checkboxes;

botões;

menus;

links;

tabelas;

listas;

linhas;

ações;

paginação;

modais;

mensagens de erro;

mensagens de sucesso;

loading;

empty state.

🚫 Onde não é necessário

Não é obrigatório em:

elementos decorativos;

wrappers sem relevância funcional;

layout puro;

textos sem importância para o teste;

elementos internos sem necessidade de identificação direta.

🧩 Regras para nomes

Os identificadores devem:

estar em inglês;

utilizar kebab-case;

representar o elemento;

representar sua finalidade;

permanecer estáveis;

usar ID da entidade quando necessário;

evitar nomes genéricos.

Evitar seletores baseados exclusivamente em:

classe CSS
posição do elemento
texto visível
estrutura do DOM

quando existir data-testid específico.

🧪 Exemplo com Cypress

cy.get(
  '[data-testid="login-email-input"]',
).type('admin@clinica.local')

cy.get(
  '[data-testid="login-password-input"]',
).type('senha')

cy.get(
  '[data-testid="login-submit-button"]',
).click()

cy.get(
  '[data-testid="dashboard-page"]',
).should('be.visible')

🧪 Exemplo com Playwright

await page
  .getByTestId('login-email-input')
  .fill('admin@clinica.local')

await page
  .getByTestId('login-password-input')
  .fill('senha')

await page
  .getByTestId('login-submit-button')
  .click()

await expect(
  page.getByTestId('dashboard-page'),
).toBeVisible()

Usuários:

await page
  .getByTestId('nav-users-link')
  .click()

await expect(
  page.getByTestId('users-page'),
).toBeVisible()

await page
  .getByTestId('users-name-filter')
  .fill('QA')

await page
  .getByTestId('users-search-button')
  .click()

📌 Regra para novos módulos

Todo novo módulo do frontend deve ser entregue preparado para automação.

Checklist:

Página principal             ✅
Inputs principais            ✅
Botões                       ✅
Filtros                      ✅
Tabela/listagem              ✅
Registros dinâmicos          ✅
Paginação                    ✅
Loading                      ✅
Empty state                  ✅
Erros                        ✅
Mensagens de sucesso         ✅
Modais                       ✅
Ações                        ✅
data-testid                  ✅

🧪 Objetivo para estudos de QA

O projeto também serve como ambiente para prática de:

cenários de teste;

BDD / Gherkin;

testes exploratórios;

testes funcionais;

regressão;

testes negativos;

API;

banco de dados;

automação E2E;

Cypress;

Playwright;

Postman;

RBAC;

autenticação;

massa de teste;

evidências.

🗺️ Evolução

Fluxo planejado:

Autenticação
     ↓
Recuperação de senha
     ↓
Pacientes
     ↓
Especialidades
     ↓
Usuários
     ↓
Médicos
     ↓
Médico x Especialidade
     ↓
Agenda Médica
     ↓
Bloqueios de Agenda
     ↓
Agendamentos
     ↓
Histórico de Agendamentos
     ↓
Consultas
     ↓
Prontuário
     ↓
Alergias
     ↓
Receitas
     ↓
Atestados
     ↓
Auditoria

Atualmente:

Autenticação       ✅
Dashboard          ✅
Pacientes          ✅
Especialidades     ✅
Usuários           ✅
Médicos            ⏳
Agenda Médica      ⏳
Agendamentos       ⏳
Consultas          ⏳
Prontuário         ⏳
Receitas           ⏳
Atestados          ⏳
Auditoria          ⏳

Todos os próximos módulos devem continuar seguindo o padrão de data-testid.

📚 Documentação relacionada

← README principal

⚙️ Documentação do Backend