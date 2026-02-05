# 🐾 RPPT — Registro Público de Pets e Tutores

Sistema web para gerenciamento de **Tutores** e **Pets**, permitindo cadastro, edição, visualização e **vinculação/desvinculação de pets a tutores**, com arquitetura moderna baseada em **Angular 21 + tailwind**.

---

## 📌 Visão Geral

O RPPT é uma aplicação frontend desenvolvida em Angular com foco em:

- Componentização clara e reutilizável
- Gerenciamento de estado previsível com **Signals**
- Comunicação desacoplada entre componentes -standalone
- Integração com backend REST
- Interface responsiva com TailwindCSS

---


### Principais conceitos utilizados:
- **Standalone Components**
- **Signals (`signal`, `computed`)**
- **State centralizado por feature**
- **Services como única camada de acesso à API**
- **Componentes burros vs componentes de orquestração**

---

## 🧩 Estrutura de Pastas

src/app
│
├── dashboard
│   ├── dashboard.ts
│   ├── dashboard.html
│   └── dashboard-router
│
├── login
│   └── (fluxo de autenticação)
│
├── pet
│   ├── pet.ts
│   └── components
│       ├── pet-detail-modal
│       └── pet-form-modal
│
├── tutor
│   ├── tutor.ts
│   └── components
│       ├── tutor-card
│       ├── tutor-detail-modal
│       └── tutor-form-modal
│
├── shared
│   └── components
│       ├── header
│       ├── menu-superior
│       └── pagination
│
├── core
│   ├── guards
│   │   └── auth.guard.ts
│   │
│   ├── services
│   │   └── autenticacao.service.ts
│   │
│   └── auth-interceptor
│       └── auth-interceptor.ts
│
├── interfaces
│   ├── pet.interfaces.ts
│   └── tutor.interfaces.ts
│
└── services
    ├── pet.service.ts
    └── tutor.service.ts



## 🛠️ Requisitos

- Node.js >= 18
- Angular CLI >= 21
- NPM ou Yarn
- Backend REST

## ▶️ Como executar o projeto (Local)

```bash
# Clone o repositório
git clone https://github.com/rubenstr/rubensteixeiraraimundo002972.git

# Acesse o diretório
git checkout -b feature/desenvolvimento-funcionalidades

# Acesse o diretório raiz - onde há o package.json
cd diretorio raiz

# Instale as dependências
npm install

# Execute o projeto
ng run start


## ▶️ arquivos de configuração do projeto
src/environments/
├── environment.ts
└── environment.prod.ts

## 🔐 Autenticação e Segurança
- Autenticação baseada em **JWT**
- Token armazenado no `localStorage`
- `AuthInterceptor` adiciona o token automaticamente nas requisições
- `AuthGuard` protege rotas privadas

## 🧠 Gerenciamento de Estado
O estado da aplicação é gerenciado utilizando **Angular Signals**, com:
- `signal()` para estado mutável
- `computed()` para derivação de estado
- State centralizado por feature
- Comunicação via Inputs/Outputs e Signals

🧪 Executando os Testes
Para executar os testes unitarios:
- npm run test


🐳 Executando com Docker Compose