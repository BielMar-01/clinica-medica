# 🎨 Clínica Médica — Frontend

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

---

# 📂 Estrutura

A estrutura evolui conforme novos módulos são implementados.

Exemplo:

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   └── patients/
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

---

# 📋 Pré-requisitos

Para executar:

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

Instale:

```bash
npm install
```

---

# 🔐 Variáveis de ambiente

Crie:

```text
frontend/.env
```

Exemplo:

```env
VITE_API_URL=http://localhost:3000
```

Produção utiliza a URL pública da API.

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

A comunicação com a API deve ficar centralizada na camada de serviços.

Exemplo:

```text
src/services/api.ts
```

Fluxo:

```text
Component
   ↓
Service
   ↓
api.ts
   ↓
Backend
```

Isso evita chamadas HTTP espalhadas pela aplicação e facilita:

- tratamento de erros
- autenticação
- renovação de sessão
- configuração de headers
- alteração da URL da API
- manutenção

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

---

# 🔄 Renovação da sessão

A camada HTTP deve conseguir tratar a expiração do Access Token.

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

Isso evita que o usuário seja enviado para o login imediatamente sempre que o Access Token expirar.

---

# 🍪 Cookies

Quando a autenticação utiliza Refresh Token via cookie HttpOnly, as requisições que dependem dele precisam enviar credenciais.

Conceitualmente:

```typescript
credentials: 'include'
```

O JavaScript do navegador não precisa acessar diretamente o Refresh Token.

---

# 🛡️ Rotas protegidas

Páginas internas devem verificar se existe um usuário autenticado antes de permitir o acesso.

Exemplos de páginas protegidas:

```text
/pacientes
/medicos
/agendamentos
/consultas
```

Usuários sem sessão devem ser redirecionados para o login.

---

# 👥 Permissões

Além de verificar autenticação, determinadas telas e ações podem depender do perfil.

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

O frontend pode ocultar ações sem permissão para melhorar a experiência, mas a autorização real deve continuar sendo validada pelo backend.

---

# 👤 Módulo de pacientes

O frontend do módulo de pacientes contempla recursos como:

- Listagem
- Pesquisa
- Filtros
- Paginação
- Cadastro
- Visualização
- Edição
- Ativação
- Inativação
- Feedback de carregamento
- Feedback de erro
- Estado sem resultados

---

# 🔎 Busca e filtros

A tela de pacientes permite combinar critérios de consulta.

O estado dos filtros deve ser controlado pela aplicação e enviado para a API.

Ao alterar filtros, normalmente a paginação deve retornar para:

```text
page = 1
```

---

# 📑 Paginação

A interface não deve carregar todos os pacientes simultaneamente.

Fluxo:

```text
Página 1
 ↓
API
 ↓
Resultados + informações de paginação
 ↓
Controles da interface
```

Isso ajuda a manter a aplicação preparada para bases maiores.

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
Carregando pacientes...
```

### Empty

```text
Nenhum paciente encontrado.
```

### Error

```text
Não foi possível carregar os pacientes.
```

---

# ⚠️ Tratamento de erros

A camada HTTP deve normalizar erros vindos da API.

Isso evita que cada componente precise interpretar formatos diferentes de resposta.

A interface deve exibir mensagens compreensíveis para o usuário e evitar apresentar detalhes internos da API.

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

Recursos relacionados a dados clínicos exigirão cuidado para evitar armazenamento inadequado de informações sensíveis no dispositivo.

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
Navegação
 ↓
Pacientes
 ↓
Busca
 ↓
Filtros
 ↓
Paginação
 ↓
Logout
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

- armazenar senhas no frontend
- colocar JWT Secret no frontend
- acessar o PostgreSQL diretamente
- colocar Supabase Secret Key no bundle
- confiar apenas nas permissões visuais
- armazenar informações clínicas desnecessariamente no navegador

Sempre:

- utilizar a API
- tratar erros
- validar estados de carregamento
- proteger páginas autenticadas
- respeitar as permissões do usuário
- manter a interface responsiva
- executar o build antes do commit

---

# 🗺️ Evolução

A interface deverá acompanhar a implementação dos módulos:

```text
Autenticação
     ↓
Pacientes
     ↓
Especialidades
     ↓
Médicos
     ↓
Agenda
     ↓
Agendamentos
     ↓
Consultas
     ↓
Prontuário
     ↓
Receitas
     ↓
Atestados
     ↓
Dashboard
```

---

# 📚 Documentação relacionada

[← README principal](../README.md)

[⚙️ Documentação do Backend](../backend/README.md)