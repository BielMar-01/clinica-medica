# 🏥 Clínica Médica

Sistema de gestão para clínicas médicas desenvolvido para centralizar pacientes, profissionais, agendas, atendimentos e informações clínicas em uma única plataforma.

A proposta do projeto é construir uma aplicação moderna, organizada e segura que acompanhe o fluxo completo de uma clínica: desde o cadastro do paciente e agendamento até o atendimento médico, prontuário, prescrições e histórico.

---

## 📋 Sobre o projeto

O **Clínica Médica** foi pensado para atender diferentes profissionais envolvidos na rotina de uma clínica.

A plataforma contará com áreas específicas para:

- Administradores
- Recepcionistas
- Médicos

Cada perfil possui acesso somente às funcionalidades necessárias para suas atividades.

O sistema está sendo desenvolvido de forma modular, permitindo que novas funcionalidades sejam adicionadas gradualmente sem comprometer as funcionalidades existentes.

---

## 🎯 Objetivo

Centralizar a operação da clínica em uma única aplicação.

O sistema busca reduzir controles manuais e informações espalhadas, oferecendo uma visão organizada da jornada do paciente:

```text
Paciente
   ↓
Agendamento
   ↓
Confirmação
   ↓
Atendimento
   ↓
Consulta
   ↓
Prontuário
   ↓
Receitas / Atestados
   ↓
Histórico
```

---

# ✨ Funcionalidades

## 👤 Pacientes

Gerenciamento dos pacientes atendidos pela clínica.

Funcionalidades previstas e/ou disponíveis:

- Cadastro de pacientes
- Consulta de pacientes
- Edição de dados cadastrais
- Ativação e inativação
- Pesquisa por nome
- Pesquisa por CPF
- Pesquisa por telefone
- Filtros por situação
- Paginação de resultados
- Validação de CPF
- Controle de duplicidade
- Informações de contato
- Informações de endereço
- Observações administrativas

O cadastro do paciente será utilizado como base para agendamentos, consultas, prontuários e demais informações clínicas.

---

## 👨‍⚕️ Médicos

Área destinada ao gerenciamento dos profissionais responsáveis pelos atendimentos.

O módulo contempla:

- Cadastro de médicos
- CRM
- UF do CRM
- Dados de contato
- Situação do profissional
- Especialidades
- Especialidade principal
- Tempo padrão de consulta

Cada médico poderá possuir uma ou mais especialidades.

---

## 🩺 Especialidades

Gerenciamento das especialidades oferecidas pela clínica.

Exemplos:

- Clínica Geral
- Cardiologia
- Dermatologia
- Pediatria
- Ortopedia

As especialidades poderão ser associadas aos médicos e utilizadas durante o processo de agendamento.

---

## 📅 Agenda médica

Cada médico poderá possuir sua própria configuração de atendimento.

Será possível definir:

- Dias de atendimento
- Horário inicial
- Horário final
- Duração das consultas
- Períodos de vigência
- Disponibilidade

Isso permitirá que o sistema determine quais horários podem ser utilizados para novos agendamentos.

---

## 🚫 Bloqueios de agenda

Períodos específicos poderão ser bloqueados para impedir novos agendamentos.

Exemplos:

- Férias
- Ausências
- Reuniões
- Feriados
- Eventos
- Compromissos
- Bloqueios manuais

---

## 🗓️ Agendamentos

O módulo de agendamentos será responsável por conectar:

```text
Paciente
+
Médico
+
Especialidade
+
Data e horário
```

O atendimento poderá passar por diferentes situações:

```text
Agendado
↓
Confirmado
↓
Paciente presente
↓
Em atendimento
↓
Concluído
```

Também serão tratados:

- Cancelamentos
- Reagendamentos
- Não comparecimento
- Alterações de horário
- Histórico do agendamento

---

## 🩺 Consultas

Durante o atendimento, o médico poderá registrar informações relacionadas à consulta.

Entre elas:

- Queixa principal
- História da doença atual
- Avaliação
- Diagnóstico
- Conduta
- Observações

A consulta ficará vinculada ao paciente e ao médico responsável.

---

## 📋 Prontuário

O prontuário reunirá informações clínicas importantes do paciente.

Entre elas:

- Tipo sanguíneo
- Doenças preexistentes
- Histórico familiar
- Medicamentos em uso
- Observações clínicas
- Histórico de atendimentos

A proposta é permitir que o profissional tenha acesso ao histórico necessário para acompanhar o paciente ao longo do tempo.

---

## ⚠️ Alergias

O sistema permitirá registrar alergias conhecidas do paciente.

Informações como:

- Substância
- Reação
- Gravidade
- Observações
- Situação

Essas informações poderão ser consultadas durante o atendimento.

---

## 💊 Receitas

O médico poderá registrar prescrições relacionadas às consultas.

Cada receita poderá possuir vários medicamentos contendo informações como:

- Medicamento
- Dosagem
- Via de administração
- Frequência
- Duração
- Quantidade
- Orientações

As receitas permanecerão vinculadas ao histórico do paciente.

---

## 📄 Atestados

O sistema também contará com gerenciamento de atestados.

Será possível registrar:

- Data
- Quantidade de dias
- Texto do atestado
- CID, quando aplicável
- Autorização para utilização do CID
- Médico responsável
- Paciente
- Consulta relacionada

---

# 🔐 Controle de acesso

O sistema trabalha inicialmente com três tipos de usuários:

### 👑 Administrador

Responsável pela administração geral da plataforma.

### 🧑‍💼 Recepcionista

Responsável principalmente pela operação administrativa da clínica, pacientes e agendamentos.

### 👨‍⚕️ Médico

Responsável pelos atendimentos e informações clínicas dos pacientes.

As funcionalidades disponíveis são determinadas pelo perfil do usuário.

---

# 🔑 Autenticação

A plataforma possui sistema próprio de autenticação.

O usuário realiza login utilizando suas credenciais e recebe uma sessão segura para acessar as funcionalidades permitidas ao seu perfil.

O sistema também possui mecanismos para:

- Renovação de sessão
- Encerramento de sessão
- Identificação do usuário autenticado
- Controle de permissões
- Proteção de funcionalidades restritas

---

# 🔎 Auditoria

Uma clínica trabalha com informações importantes e sensíveis.

Por isso, o projeto prevê uma camada de auditoria para registrar ações relevantes realizadas dentro da aplicação.

Exemplos:

- Usuário responsável
- Ação realizada
- Registro alterado
- Data e horário
- Informações anteriores
- Novas informações

Isso permitirá maior rastreabilidade das operações realizadas no sistema.

---

# 📱 Experiência da aplicação

A interface está sendo construída pensando em diferentes tamanhos de tela.

O objetivo é oferecer uma experiência adequada em:

- Desktop
- Notebook
- Tablet
- Smartphone

O projeto também prevê evolução para **PWA (Progressive Web App)**.

Isso permitirá aproximar a experiência da aplicação web de um aplicativo instalado no dispositivo.

---

# 🏗️ Organização do sistema

A aplicação é dividida em três grandes partes:

```text
┌─────────────────────┐
│     Aplicação Web   │
│                     │
│ Interface utilizada │
│ pelos usuários      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│         API         │
│                     │
│ Regras e segurança  │
│ da aplicação        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Banco de Dados    │
│                     │
│ Dados da clínica    │
└─────────────────────┘
```

---

# 🚧 Status do projeto

O projeto está em desenvolvimento ativo.

## Fundação do sistema

- [x] Estrutura inicial do projeto
- [x] Aplicação web
- [x] API
- [x] Banco de dados online
- [x] Comunicação entre frontend e backend
- [x] Ambiente de produção
- [x] Documentação interativa da API

## Segurança e acesso

- [x] Login
- [x] Sessão do usuário
- [x] Renovação de sessão
- [x] Logout
- [x] Identificação do usuário autenticado
- [x] Controle de acesso por perfil
- [x] Proteção das funcionalidades

## Pacientes

- [x] Cadastro
- [x] Listagem
- [x] Consulta
- [x] Edição
- [x] Ativação/Inativação
- [x] Pesquisa
- [x] Filtros
- [x] Paginação

## Próximos módulos

- [ ] Especialidades
- [ ] Médicos
- [ ] Especialidades dos médicos
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

## Evoluções posteriores

- [ ] Área do Paciente
- [ ] Acesso ao próprio histórico
- [ ] Atualização de dados cadastrais pelo paciente
- [ ] Consulta de receitas e atestados
- [ ] Consulta de agendamentos e atendimentos
- [ ] Notificações e confirmações

---

# 🗺️ Visão futura

Depois da conclusão dos módulos administrativos e clínicos principais, o projeto poderá evoluir para novas funcionalidades voltadas tanto para a equipe da clínica quanto para os próprios pacientes.

Entre as principais evoluções previstas estão:

- Dashboard gerencial
- Indicadores da clínica
- Confirmação de consultas
- Notificações
- Recuperação de senha
- Gerenciamento de usuários
- Histórico completo do paciente
- PWA
- Melhorias de acessibilidade
- Auditoria avançada
- Relatórios
- Exportação de informações
- Observabilidade
- Testes automatizados
- Melhorias relacionadas à LGPD

---

## 👥 Área do Paciente

Em uma etapa futura, depois da conclusão dos módulos internos da clínica, o sistema também poderá disponibilizar um ambiente exclusivo para os pacientes.

A proposta é permitir que cada paciente tenha acesso apenas às próprias informações através de uma conta segura.

O paciente poderá acompanhar sua jornada dentro da clínica sem depender exclusivamente do atendimento administrativo para consultar informações básicas.

### Funcionalidades previstas

O paciente poderá visualizar informações como:

- Dados pessoais
- Dados de contato
- Endereço
- Histórico de atendimentos
- Histórico de consultas
- Consultas futuras
- Consultas anteriores
- Médicos responsáveis pelos atendimentos
- Especialidades relacionadas às consultas
- Receitas médicas
- Medicamentos prescritos
- Orientações médicas disponibilizadas
- Atestados
- Documentos disponibilizados pela clínica
- Informações do próprio prontuário que forem apropriadas para exibição
- Histórico relacionado aos seus atendimentos

---

### ✏️ Atualização de dados

O paciente também poderá alterar determinadas informações cadastrais diretamente pela plataforma.

Exemplos:

- Telefone
- Telefone secundário
- E-mail
- Endereço
- CEP
- Número
- Complemento
- Bairro
- Cidade
- Estado

Informações mais sensíveis ou que exijam validação administrativa poderão possuir regras diferentes para alteração.

Por exemplo:

```text
Paciente solicita alteração
        ↓
Sistema identifica o tipo de informação
        ↓
Alteração direta
ou
Validação pela clínica
```

Isso permitirá manter os dados cadastrais mais atualizados sem comprometer a confiabilidade das informações importantes para a clínica.

---

### 💊 Receitas e documentos

O paciente poderá consultar documentos relacionados aos próprios atendimentos.

Exemplos:

```text
Receitas
Atestados
Orientações
Documentos médicos disponibilizados
```

O objetivo é centralizar essas informações dentro da própria plataforma e facilitar o acesso ao histórico do paciente.

---

### 📅 Consultas e agendamentos

A Área do Paciente também poderá evoluir para permitir:

- Visualizar próximas consultas
- Consultar histórico de consultas
- Visualizar informações do agendamento
- Confirmar presença
- Solicitar cancelamento
- Solicitar reagendamento
- Receber lembretes
- Receber notificações relacionadas ao atendimento

Algumas dessas ações poderão depender das regras administrativas definidas pela clínica.

---

### 🩺 Histórico do paciente

A proposta é oferecer uma linha do tempo organizada da relação do paciente com a clínica.

Exemplo:

```text
Cadastro
   ↓
Agendamento
   ↓
Consulta
   ↓
Receita
   ↓
Atestado
   ↓
Novo atendimento
   ↓
Histórico contínuo
```

O paciente poderá consultar informações permitidas sobre os próprios atendimentos enquanto a equipe médica continuará tendo acesso às funcionalidades profissionais e clínicas correspondentes ao seu perfil.

---

### 🔐 Privacidade e segurança

A Área do Paciente exigirá controles de segurança específicos.

Cada paciente deverá acessar exclusivamente os próprios dados.

A arquitetura deverá garantir separação entre:

```text
Usuário interno da clínica
        ↓
ADMIN
RECEPCIONISTA
MEDICO

e

Usuário paciente
        ↓
PACIENTE
```

O perfil de paciente deverá possuir permissões próprias e significativamente mais restritas que os perfis internos da clínica.

Também deverão ser considerados aspectos como:

- Proteção de dados pessoais
- Proteção de informações médicas
- Controle de sessão
- Auditoria de acessos
- Registro de alterações cadastrais
- Validação de identidade
- Recuperação segura de conta
- Consentimentos quando necessários
- Boas práticas relacionadas à LGPD

---

### 🌐 Evolução da plataforma

Com a Área do Paciente, a aplicação passará a atender dois grandes públicos:

```text
CLÍNICA
│
├── Administradores
├── Recepcionistas
└── Médicos

PACIENTES
│
├── Dados pessoais
├── Consultas
├── Histórico
├── Receitas
├── Atestados
└── Documentos
```

Assim, o sistema deixa de ser apenas uma ferramenta interna de gestão e passa a funcionar também como um canal digital entre a clínica e seus pacientes.

Além dos módulos principais, o projeto poderá evoluir com funcionalidades como:

- Dashboard gerencial
- Indicadores da clínica
- Confirmação de consultas
- Notificações
- Recuperação de senha
- Gerenciamento de usuários
- Histórico completo do paciente
- PWA
- Melhorias de acessibilidade
- Auditoria avançada
- Relatórios
- Exportação de informações
- Observabilidade
- Testes automatizados
- Melhorias relacionadas à LGPD

---

# 🧪 Projeto preparado para estudos de QA

Além da construção do sistema de gestão da clínica, o projeto também foi pensado para servir como ambiente de estudo e prática para profissionais de Quality Assurance.

A aplicação poderá ser utilizada para estudos e exercícios envolvendo:

- Testes manuais
- Testes exploratórios
- Criação de cenários
- BDD / Gherkin
- Testes de API
- Testes de integração
- Testes de regressão
- Validação de regras de negócio
- Criação de evidências
- Testes automatizados
- Playwright
- Cypress
- Postman

Os principais elementos do frontend possuem identificadores estáveis através de `data-testid`, facilitando a criação de automações sem depender de classes CSS ou textos que podem mudar durante a evolução da interface.

Os novos módulos deverão continuar sendo desenvolvidos seguindo esse padrão de testabilidade.

Os detalhes técnicos sobre os seletores utilizados estão disponíveis na documentação do frontend:

[🧪 Padrões de automação e `data-testid`](./frontend/README.md#-seletores-para-testes-e-automação-qa)

# 📚 Documentação técnica

Os detalhes técnicos foram separados da apresentação principal do projeto.

### ⚙️ Backend

Configuração da API, banco de dados, autenticação, Prisma, Swagger, variáveis de ambiente, execução e deploy:

[📘 Documentação técnica do Backend](./backend/README.md)

### 🎨 Frontend

Configuração da aplicação web, comunicação com a API, autenticação, estrutura, execução e deploy:

[📗 Documentação técnica do Frontend](./frontend/README.md)

---

# 📖 API

A documentação interativa da API pode ser acessada através do Swagger:

https://clinica-medica-api.vercel.app/api/docs

---

# 🌐 Ambientes

### Aplicação

https://clinica-medica-galera-do-ti.vercel.app

### API

https://clinica-medica-api.vercel.app

---

# 🤝 Contribuição

O projeto está em evolução e novas funcionalidades serão implementadas gradualmente.

Antes de iniciar uma alteração, consulte a documentação técnica correspondente ao módulo que será modificado.

---

# 🏥 Clínica Médica — Galera do TI

Uma plataforma para centralizar a operação administrativa e clínica, acompanhando a jornada do paciente desde o cadastro até o atendimento e seu histórico médico.