# 🏥 Clínica Médica — Frontend

Aplicação web responsável pela interface utilizada pelos profissionais da Clínica Médica.

[← Voltar para o README principal](../README.md)

---

# 🧱 Tecnologias

O frontend utiliza principalmente:

- React
- TypeScript
- Vite
- CSS
- Fetch API / camada HTTP própria
- Vercel

A aplicação está sendo construída com foco em:

- Responsividade
- Mobile First
- Componentização
- Segurança
- Acessibilidade
- Testabilidade
- Evolução futura para PWA

---

# 🏗️ Arquitetura

O frontend nunca deve acessar diretamente o banco de dados.

Fluxo:

```text
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
```

Todas as regras de negócio relevantes devem ser validadas pelo backend.

O frontend pode aplicar validações e controles visuais para melhorar a experiência do usuário, mas essas validações não substituem as regras implementadas na API.

---

# 📂 Estrutura

A estrutura evolui conforme novos módulos são implementados.

Estrutura atual:

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── patients/
│   │   └── specialties/
│   │
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   │
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
```

Os módulos devem manter a separação entre:

```text
Componentes
Páginas
Serviços
Tipos
Rotas
Contextos
```

---

# 📋 Pré-requisitos

Para executar o frontend:

- Node.js
- npm
- Git

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
cd frontend
```

Instale as dependências:

```bash
npm install
```

---

# 🔐 Variáveis de ambiente

Crie:

```text
frontend/.env
```

Exemplo para desenvolvimento local:

```env
VITE_API_URL=http://localhost:3000
```

Produção utiliza a URL pública da API:

```env
VITE_API_URL=https://clinica-medica-api.vercel.app
```

---

# ⚠️ Variáveis VITE

Variáveis que começam com:

```text
VITE_
```

são incorporadas ao frontend durante o build.

Portanto, **não coloque informações secretas em variáveis `VITE_*`**.

Nunca utilize no frontend:

```text
DATABASE_URL
DIRECT_URL
JWT_SECRET
senhas
chaves privadas
Supabase Secret Key
```

---

# 🌐 Camada HTTP

A comunicação com a API fica centralizada na camada de serviços.

Arquivo principal:

```text
src/services/api.ts
```

Fluxo:

```text
Página / Componente
       ↓
Service do módulo
       ↓
api.ts
       ↓
Backend
```

Exemplos de services:

```text
auth.service.ts
patient.service.ts
specialty.service.ts
```

Essa estrutura evita chamadas HTTP espalhadas pela aplicação e facilita:

- Tratamento de erros
- Autenticação
- Renovação de sessão
- Configuração de headers
- Alteração da URL da API
- Manutenção
- Testes
- Evolução dos módulos

---

# 🔐 Autenticação

Fluxo conceitual:

```text
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
```

A aplicação possui fluxo de autenticação integrado ao backend.

---

# 🔄 Renovação da sessão

A camada HTTP trata a expiração do Access Token.

Fluxo:

```text
Request
   ↓
401
   ↓
Refresh
   ↓
Novo Access Token
   ↓
Repete Request
```

Isso evita que o usuário seja enviado imediatamente para o login quando o Access Token expirar e ainda existir uma sessão válida.

---

# 🍪 Cookies

Quando a autenticação utiliza Refresh Token via cookie HttpOnly, as requisições que dependem dele precisam enviar credenciais.

Conceitualmente:

```typescript
credentials: 'include'
```

O JavaScript do navegador não precisa acessar diretamente o Refresh Token.

Isso reduz a exposição do token no frontend.

---

# 🛡️ Rotas protegidas

Páginas internas verificam se existe um usuário autenticado antes de permitir o acesso.

Rotas atualmente implementadas incluem:

```text
/dashboard
/pacientes
/especialidades
```

Rotas futuras incluem:

```text
/medicos
/agendamentos
/consultas
```

Usuários sem sessão válida devem ser redirecionados para:

```text
/login
```

---

# 👥 Permissões

Além de verificar autenticação, determinadas telas e ações dependem do perfil do usuário.

Perfis:

```text
ADMIN
RECEPCIONISTA
MEDICO
```

Exemplo conceitual:

```text
ADMIN
 └── Administração completa

RECEPCIONISTA
 ├── Pacientes
 └── Agendamentos

MEDICO
 ├── Agenda
 ├── Consultas
 └── Prontuários
```

O frontend pode ocultar ações sem permissão para melhorar a experiência.

Entretanto:

> A autorização real deve sempre continuar sendo validada pelo backend.

Ocultar um botão no frontend não representa uma regra de segurança suficiente.

---

# 🏠 Dashboard

A aplicação possui uma área inicial autenticada disponível em:

```text
/dashboard
```

O Dashboard funciona como ponto inicial para navegação entre os módulos do sistema.

Conforme novos módulos forem implementados, o Dashboard poderá evoluir para apresentar:

- Quantidade de pacientes
- Agendamentos
- Consultas
- Informações de agenda
- Indicadores operacionais
- Atalhos para funcionalidades importantes

---

# 👤 Módulo de Pacientes

O frontend possui o módulo de gerenciamento de pacientes disponível em:

```text
/pacientes
```

O módulo contempla:

- Listagem
- Pesquisa
- Filtros
- Paginação
- Cadastro
- Edição
- Ativação
- Inativação
- Feedback de carregamento
- Feedback de erro
- Estado sem resultados
- Controle visual de permissões

---

## 🔎 Filtros de pacientes

A tela permite combinar critérios de consulta como:

```text
Nome
CPF
Telefone
Status
```

O estado dos filtros é controlado pela aplicação e enviado para a API.

Ao executar uma nova busca, a paginação retorna para:

```text
page = 1
```

---

## 📄 Paginação de pacientes

A interface não carrega todos os pacientes simultaneamente.

Fluxo:

```text
Página
  ↓
API
  ↓
Resultados + paginação
  ↓
Tabela
  ↓
Anterior / Próxima
```

Isso ajuda a preparar a aplicação para bases maiores.

---

## 🔐 Permissões de pacientes

Consulta e listagem podem ser realizadas pelos perfis autorizados pelo backend.

As operações de escrita são controladas conforme RBAC.

Atualmente:

```text
ADMIN
RECEPCIONISTA
```

podem executar operações de gerenciamento de pacientes.

O perfil:

```text
MEDICO
```

possui acesso de consulta, sem permissão de escrita.

---

# 🩺 Módulo de Especialidades

O frontend possui o módulo de gerenciamento de especialidades médicas disponível em:

```text
/especialidades
```

O módulo contempla:

- Listagem de especialidades
- Pesquisa por nome
- Filtro por status
- Paginação
- Cadastro
- Edição
- Ativação
- Inativação
- Confirmação antes da alteração de status
- Tratamento de duplicidade
- Feedback de carregamento
- Feedback de erro
- Estado sem resultados
- Controle visual de permissões

---

## 🔎 Filtros de especialidades

A tela permite consultar especialidades utilizando:

```text
Nome
Status
```

Status disponíveis:

```text
Todos
Ativas
Inativas
```

Ao realizar uma nova busca, a paginação retorna para a primeira página.

---

## 📄 Paginação de especialidades

A listagem utiliza paginação integrada ao backend.

A interface apresenta:

```text
Anterior
Página atual
Total de páginas
Total de especialidades
Próxima
```

---

## ✏️ Cadastro e edição

Usuários autorizados podem cadastrar novas especialidades e editar registros existentes.

Campos atualmente utilizados:

```text
Nome
Descrição
```

O formulário possui tratamento para erros retornados pela API.

Também é tratada a tentativa de cadastro de especialidade com nome já existente.

---

## 🔄 Ativação e inativação

Especialidades podem ser ativadas ou inativadas.

Antes da operação, a interface solicita confirmação.

Fluxo:

```text
Usuário seleciona Inativar
          ↓
Confirmação
          ↓
PATCH /api/especialidades/:id/status
          ↓
Backend atualiza
          ↓
Frontend recarrega a listagem
```

O mesmo fluxo é utilizado para reativação.

---

## 🔐 Permissões de especialidades

As consultas podem ser realizadas pelos perfis:

```text
ADMIN
RECEPCIONISTA
MEDICO
```

As operações de gerenciamento são disponibilizadas somente para:

```text
ADMIN
```

Isso inclui:

- Cadastrar
- Editar
- Ativar
- Inativar

A autorização real continua sendo validada pelo backend.

---

## 🌐 API de Especialidades

O módulo utiliza:

```text
GET    /api/especialidades
GET    /api/especialidades/:id
POST   /api/especialidades
PUT    /api/especialidades/:id
PATCH  /api/especialidades/:id/status
```

---

# ⏳ Estados da interface

Telas que carregam dados devem considerar pelo menos:

```text
Loading
Success
Empty
Error
```

Exemplos:

### Loading

```text
Carregando especialidades...
```

ou:

```text
Carregando pacientes...
```

### Empty

```text
Nenhuma especialidade encontrada.
```

ou:

```text
Nenhum paciente encontrado.
```

### Error

A interface deve apresentar uma mensagem compreensível baseada no erro normalizado pela camada HTTP.

---

# ⚠️ Tratamento de erros

A camada HTTP normaliza erros vindos da API.

Isso evita que cada componente precise interpretar formatos diferentes de resposta.

A interface deve:

- Exibir mensagens compreensíveis
- Evitar detalhes internos da API
- Manter o usuário informado
- Preservar o estado da tela quando possível
- Permitir correção de dados inválidos

Exemplos:

```text
Credenciais inválidas
CPF já cadastrado
Especialidade já cadastrada
Registro não encontrado
Usuário sem permissão
Erro de comunicação com a API
```

---

# 📱 Mobile First

As telas devem ser construídas considerando primeiro dispositivos menores.

Evolução:

```text
Smartphone
   ↓
Tablet
   ↓
Notebook
   ↓
Desktop
```

Isso é especialmente importante para futuras possibilidades de utilização da aplicação em tablets ou smartphones dentro da clínica.

---

# 📲 PWA

O projeto prevê evolução para Progressive Web App.

Futuramente poderão ser adicionados:

- Manifest
- Ícones
- Service Worker
- Instalação no dispositivo
- Estratégias de cache
- Página offline

Recursos relacionados a dados clínicos exigirão cuidado especial para evitar armazenamento inadequado de informações sensíveis no dispositivo.

---

# ♿ Acessibilidade

As interfaces devem evoluir considerando:

- HTML semântico
- Labels
- Navegação por teclado
- Foco visível
- Contraste
- Mensagens de erro compreensíveis
- Elementos interativos identificáveis
- Responsividade
- Uso adequado de atributos ARIA quando necessário

---

# ▶️ Desenvolvimento

Execute:

```bash
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em:

```text
http://localhost:5173
```

---

# 🏗️ Build

Antes do commit ou deploy:

```bash
npm run build
```

O build de produção será gerado em:

```text
dist/
```

O build também funciona como uma validação importante de TypeScript antes do código ser enviado ao repositório.

---

# 👀 Preview

Quando disponível nos scripts do projeto:

```bash
npm run preview
```

Isso permite validar localmente o build de produção.

---

# 🧪 Validação recomendada

Antes do commit:

```bash
npm run build
```

Depois valide manualmente:

```text
Login
  ↓
Carregamento do usuário
  ↓
Dashboard
  ↓
Navegação
  ↓
Pacientes
  ↓
Filtros / CRUD / Status
  ↓
Especialidades
  ↓
Filtros / CRUD / Status
  ↓
Logout
```

Também é recomendado validar:

```text
Rota protegida
Sessão após atualização da página
Tratamento de erro
Empty state
Loading
Permissões visuais
```

---

# 🚀 Deploy

O frontend está hospedado na Vercel.

Produção:

```text
https://clinica-medica-galera-do-ti.vercel.app
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

# ⚙️ Configuração na Vercel

A variável principal do frontend é:

```text
VITE_API_URL
```

Produção:

```text
https://clinica-medica-api.vercel.app
```

Depois de alterar variáveis utilizadas pelo Vite, normalmente é necessário realizar um novo deploy para que o novo valor seja incorporado ao build.

---

# 🔗 Ambientes

Frontend local:

```text
http://localhost:5173
```

Backend local:

```text
http://localhost:3000
```

Frontend produção:

```text
https://clinica-medica-galera-do-ti.vercel.app
```

Backend produção:

```text
https://clinica-medica-api.vercel.app
```

Swagger:

```text
https://clinica-medica-api.vercel.app/api/docs
```

---

# 🧪 Fluxo local completo

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Fluxo:

```text
localhost:5173
      ↓
localhost:3000
      ↓
Supabase PostgreSQL
```

---

# 📌 Comandos úteis

Instalar:

```bash
npm install
```

Executar:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

# 🔒 Boas práticas

Nunca:

- Armazenar senhas no frontend
- Colocar JWT Secret no frontend
- Acessar o PostgreSQL diretamente
- Colocar Supabase Secret Key no bundle
- Confiar apenas nas permissões visuais
- Armazenar informações clínicas desnecessariamente no navegador
- Utilizar dados sensíveis diretamente em testes automatizados
- Versionar credenciais

Sempre:

- Utilizar a API
- Tratar erros
- Validar estados de carregamento
- Proteger páginas autenticadas
- Respeitar as permissões do usuário
- Manter a interface responsiva
- Executar o build antes do commit
- Utilizar seletores estáveis para automação

---

# 🧪 Seletores para testes e automação QA

O frontend utiliza `data-testid` nos principais elementos da interface para facilitar:

- Testes manuais
- Estudos de QA
- Automação com Cypress
- Automação com Playwright
- Criação de evidências
- Aprendizado de seletores
- Testes de regressão
- Testes E2E

A aplicação não adiciona `data-testid` indiscriminadamente em todos os elementos.

Os identificadores são utilizados principalmente em componentes relevantes para interação, validação ou automação.

---

## 📏 Convenção

O padrão utilizado é:

```text
modulo-elemento-finalidade
```

Exemplos:

```text
login-email-input
login-password-input
login-submit-button

nav-dashboard-link
nav-patients-link
nav-specialties-link

patients-new-button
patients-search-button
patients-table

specialties-new-button
specialties-search-button
specialties-table
```

---

# 🔐 Seletores de Login

Principais seletores:

```text
login-page
login-email-input
login-password-input
login-submit-button
login-error-message
```

Exemplo:

```html
data-testid="login-email-input"
```

---

# 🧭 Seletores de navegação

Principais seletores:

```text
app-layout
app-sidebar
sidebar-brand
sidebar-brand-title
sidebar-brand-description
sidebar-navigation

nav-dashboard-link
nav-patients-link
nav-specialties-link

sidebar-user-section
sidebar-user-name
sidebar-user-role

logout-button
app-content
```

---

# 🏠 Seletores do Dashboard

Principais seletores:

```text
dashboard-page
dashboard-title
dashboard-patients-card
```

Novos elementos do Dashboard devem continuar utilizando a mesma convenção.

---

# 👤 Seletores de Pacientes

## Página

```text
patients-page
patients-new-button
```

## Filtros

```text
patients-filters
patients-name-filter-input
patients-cpf-filter-input
patients-phone-filter-input
patients-status-filter-select
patients-search-button
patients-clear-filters-button
```

## Tabela

```text
patients-table
patients-table-body
```

## Registros dinâmicos

```text
patient-row-{id}
patient-edit-button-{id}
patient-status-button-{id}
```

## Estados

```text
patients-loading
patients-empty-state
patients-error-message
```

## Paginação

```text
patients-pagination
patients-previous-page-button
patients-pagination-info
patients-next-page-button
```

## Formulário

```text
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
```

---

# 🩺 Seletores de Especialidades

## Página

```text
specialties-page
specialties-page-header
specialties-page-title
specialties-page-description
specialties-content
```

## Navegação

```text
nav-specialties-link
```

## Ações principais

```text
specialties-new-button
```

## Filtros

```text
specialties-filters
specialties-filters-fields
specialties-filter-actions

specialties-name-filter-input
specialties-status-filter-select

specialties-search-button
specialties-clear-filters-button
```

## Tabela

```text
specialties-table-card
specialties-table-wrapper
specialties-table
specialties-table-header
specialties-table-body
```

## Registros dinâmicos

O ID da especialidade deve fazer parte do seletor.

```text
specialty-row-{id}
specialty-name-{id}
specialty-description-{id}
specialty-status-{id}
specialty-actions-{id}
specialty-edit-button-{id}
specialty-status-button-{id}
```

Exemplo:

```text
specialty-row-5
specialty-edit-button-5
specialty-status-button-5
```

## Formulário

```text
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
```

## Paginação

```text
specialties-pagination
specialties-previous-page-button
specialties-pagination-info
specialties-next-page-button
```

## Estados

```text
specialties-loading
specialties-empty-state
specialties-error-message
```

---

# 🔄 Elementos dinâmicos

Para elementos relacionados a registros específicos, deve ser utilizado o identificador da entidade.

Pacientes:

```text
patient-row-{id}
patient-name-{id}
patient-edit-button-{id}
patient-status-button-{id}
```

Especialidades:

```text
specialty-row-{id}
specialty-name-{id}
specialty-description-{id}
specialty-status-{id}
specialty-edit-button-{id}
specialty-status-button-{id}
```

Exemplo real:

```text
patient-row-10
patient-edit-button-10

specialty-row-5
specialty-edit-button-5
```

Esse padrão deve continuar sendo utilizado nos próximos módulos.

Exemplos futuros:

```text
doctor-row-{id}
doctor-edit-button-{id}

appointment-row-{id}
appointment-cancel-button-{id}

consultation-row-{id}
consultation-view-button-{id}
```

---

# ✅ Onde utilizar `data-testid`

Deve ser utilizado principalmente em:

- Páginas
- Formulários
- Inputs
- Selects
- Checkboxes
- Botões
- Menus
- Links de navegação
- Tabelas
- Listas
- Linhas de registros
- Ações sobre registros
- Paginação
- Modais
- Mensagens de erro
- Mensagens de sucesso
- Estados de loading
- Estados sem resultados
- Componentes importantes para validação

---

# 🚫 Onde não é necessário

Não é obrigatório adicionar `data-testid` em:

- Elementos puramente decorativos
- Wrappers sem relevância para teste
- Elementos utilizados apenas para layout
- Textos sem importância funcional
- Elementos internos que não precisam ser identificados diretamente

O objetivo é manter seletores úteis e estáveis, sem poluir desnecessariamente o HTML.

---

# 🧩 Regras para nomes

Os identificadores devem:

- Ser escritos em inglês
- Utilizar `kebab-case`
- Representar claramente o elemento
- Representar sua finalidade
- Permanecer estáveis mesmo quando CSS ou textos mudarem
- Utilizar o ID da entidade quando necessário
- Evitar nomes genéricos

Exemplo correto:

```text
specialties-clear-filters-button
```

Evitar:

```text
button2
```

Também evitar seletores baseados exclusivamente em:

```text
classe CSS
posição do elemento
texto visível
estrutura do DOM
```

quando existir um `data-testid` específico.

---

# 🧪 Exemplo com Cypress

Login:

```ts
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
```

Navegação para Pacientes:

```ts
cy.get(
  '[data-testid="nav-patients-link"]',
).click()

cy.get(
  '[data-testid="patients-page"]',
).should('be.visible')
```

Navegação para Especialidades:

```ts
cy.get(
  '[data-testid="nav-specialties-link"]',
).click()

cy.get(
  '[data-testid="specialties-page"]',
).should('be.visible')
```

Busca de especialidade:

```ts
cy.get(
  '[data-testid="specialties-name-filter-input"]',
).type('Cardio')

cy.get(
  '[data-testid="specialties-search-button"]',
).click()

cy.get(
  '[data-testid="specialties-table"]',
).should('be.visible')
```

Cadastro:

```ts
cy.get(
  '[data-testid="specialties-new-button"]',
).click()

cy.get(
  '[data-testid="specialty-name-input"]',
).type('Geriatria')

cy.get(
  '[data-testid="specialty-description-input"]',
).type(
  'Especialidade médica voltada à saúde da pessoa idosa.',
)

cy.get(
  '[data-testid="specialty-form-submit-button"]',
).click()
```

---

# 🧪 Exemplo com Playwright

```ts
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
```

Especialidades:

```ts
await page
  .getByTestId('nav-specialties-link')
  .click()

await expect(
  page.getByTestId('specialties-page'),
).toBeVisible()

await page
  .getByTestId(
    'specialties-name-filter-input',
  )
  .fill('Cardio')

await page
  .getByTestId(
    'specialties-search-button',
  )
  .click()
```

---

# 📌 Regra para novos módulos

Todo novo módulo do frontend deve ser entregue já preparado para automação.

Antes de considerar uma tela concluída, verificar:

```text
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
Modais                       ✅
Ações                        ✅
data-testid                  ✅
```

O padrão deve ser aplicado durante o desenvolvimento da funcionalidade, e não somente depois que a tela estiver pronta.

---

# 🧪 Objetivo para estudos de QA

O projeto também é estruturado para permitir estudos e práticas de Quality Assurance.

Os módulos podem ser utilizados para praticar:

- Criação de cenários de teste
- BDD / Gherkin
- Testes exploratórios
- Testes funcionais
- Testes de regressão
- Testes negativos
- Testes de API
- Automação E2E
- Cypress
- Playwright
- Postman
- Validação de RBAC
- Validação de autenticação
- Manipulação de massa de teste
- Evidências de teste
- Estratégias de seletores

Por esse motivo, a testabilidade deve ser considerada durante o desenvolvimento de novas funcionalidades.

---

# 🗺️ Evolução

A interface acompanha a implementação dos módulos.

Fluxo planejado:

```text
Autenticação
     ↓
Pacientes
     ↓
Especialidades
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
```

Atualmente:

```text
Autenticação       ✅
Dashboard          ✅
Pacientes          ✅
Especialidades     ✅

Médicos            ⏳
Agenda Médica      ⏳
Agendamentos       ⏳
Consultas          ⏳
Prontuário         ⏳
Receitas           ⏳
Atestados          ⏳
Auditoria          ⏳
```

Todos os próximos módulos deverão seguir o padrão de `data-testid` definido nesta documentação.

---

# 📚 Documentação relacionada

[← README principal](../README.md)

[⚙️ Documentação do Backend](../backend/README.md)