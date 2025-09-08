# Library API

API REST para gestão de biblioteca escolar com autenticação JWT, controle de papéis (TEACHER/STUDENT), cadastro de livros e fluxo de empréstimos. Construída com Node.js, Express 5, Prisma e PostgreSQL, validação com Zod e testes com Jest.

> API em Node/Express + Prisma para biblioteca, com autenticação JWT, RBAC (Teacher/Student), CRUD de livros e empréstimos, validação Zod e testes com Jest.

## Sumário
- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Requisitos](#requisitos)
- [Configuração](#configuração)
- [Execução](#execução)
- [Banco de dados](#banco-de-dados)
- [Rotas e Endpoints](#rotas-e-endpoints)
- [Autenticação](#autenticação)
- [Formato de respostas](#formato-de-respostas)
- [Testes](#testes)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Scripts](#scripts)
- [Licença](#licença)

## Visão geral
Esta API permite:
- Criar contas e autenticar usuários com JWT
- Diferenciar permissões por papel: `TEACHER` e `STUDENT`
- Gerenciar livros (CRUD para TEACHER; listagem/leitura pública)
- Registrar e finalizar empréstimos de livros, respeitando regras de negócio (limite por usuário, indisponibilidade de livro já emprestado etc.)

## Stack
- Runtime: Node.js + TypeScript
- Framework HTTP: Express 5
- Segurança: Helmet, CORS
- ORM: Prisma Client (PostgreSQL)
- Validação: Zod
- Auth: JWT (jsonwebtoken)
- Criptografia: bcrypt
- Testes: Jest, Supertest

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Configuração
1) Clone o repositório e instale dependências:
```bash
npm install
```

2) Crie o arquivo `.env` na raiz com as variáveis:
```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
JWT_SECRET="uma_chave_segura_aqui"
NODE_ENV=development
```

3) Execute as migrações do Prisma (criar tabelas):
```bash
npx prisma migrate dev
```

Opcional: gerar o client do Prisma manualmente
```bash
npx prisma generate
```

## Execução
Ambiente de desenvolvimento (hot reload):
```bash
npm run dev
```

Build e produção:
```bash
npm run build
npm start
```

O servidor lê a porta de `PORT` e inicializa a aplicação em `src/server.ts`.

## Banco de dados
Modelos principais (resumo):
- `User`: id, name, email (único), password (hash), role (`TEACHER` | `STUDENT`), createdAt
- `Book`: id, title, author, category, isbn (único), createdAt
- `Loan`: id, userId → User, bookId → Book, loanDate, returnDate (nulo enquanto ativo)

Regras de negócio destacadas:
- Um livro não pode ser emprestado se já existir um empréstimo ativo (returnDate = null)
- Um usuário não pode ter o mesmo livro ativo duas vezes
- Limite de empréstimos ativos por usuário: 3

## Rotas e Endpoints
Base path: `/`

Saúde do serviço:
- GET `/health` → status do serviço

Auth (`/api/auth`):
- POST `/signup` (body validado por Zod)
  - body exemplo:
    ```json
    {
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "password": "SenhaForte1",
      "role": "TEACHER"
    }
    ```
  - resposta: `{ success, data: { newUser, token }, message }`
- POST `/signin`
  - body exemplo:
    ```json
    { "email": "ada@example.com", "password": "SenhaForte1" }
    ```
  - resposta: `{ success, data: { responseData, token }, message }`

Usuário (`/api/users`) — requer Bearer token:
- GET `/me` → usuário atual
- PUT `/edit/me` → edita `name` e/ou `email`
- DELETE `/delete/me` → remove o usuário atual
- GET `/:id/loans` → histórico completo de empréstimos do usuário (apenas `TEACHER`)

Livros (`/api/books`):
- GET `/` → lista livros
- GET `/:id` → detalhes
- POST `/` → cria livro (requer `TEACHER` + token; body validado por Zod)
  - body exemplo:
    ```json
    {
      "author": "J. K. Rowling",
      "title": "Harry Potter",
      "category": "Fantasia",
      "isbn": "9781234567890"
    }
    ```
- PUT `/edit/:id` → atualiza livro (requer `TEACHER`)
- DELETE `/delete/:id` → remove livro (requer `TEACHER`)

Empréstimos (`/api/loans`):
- GET `/` → lista todos os empréstimos
- POST `/` → cria empréstimo (requer token)
  - body exemplo: `{ "bookId": "<uuid-do-livro>" }`
- PUT `/:id/return` → finaliza empréstimo (requer token)

## Autenticação
- Após `signup`/`signin`, utilize o token JWT no header:
  - `Authorization: Bearer <token>`
- O token expira em 7 dias (configurado em `src/utils/jwt.ts`).

## Formato de respostas
Sucesso (padrão):
```json
{
  "success": true,
  "data": { ... },
  "message": "Opcional"
}
```

Erro (padrão):
```json
{
  "success": false,
  "error": "AUTHENTICATION_ERROR",
  "message": "Unauthorized",
  "details": { "fieldErrors": "opcional" }
}
```
Erros comuns tratados: validação (Zod), duplicidade/uniqueness (Prisma P2002), não encontrado (P2025), e internos.

## Testes
- Rodar testes:
```bash
npm test
```
- Cobertura:
```bash
npm run test:coverage
```
- Configuração do Jest em `jest.config.js`. Ambiente de testes carrega variáveis via `tests/env-setup.ts` e `tests/setup.ts`. Você pode usar `.env.test` para base dedicada de testes.

## Estrutura do projeto
```
src/
  app.ts           # Middlewares, CORS, Helmet, rotas, error handler
  server.ts        # Bootstrap do servidor
  routes/          # Definição de rotas (auth, users, books, loans)
  controllers/     # Controladores HTTP
  services/        # Regras de negócio e acesso a dados (Prisma)
  middleware/      # Auth JWT, validação (Zod), RBAC (isTeacher), erros
  schemas/         # Schemas Zod
  types/           # Tipos/Interfaces
  utils/           # JWT, Prisma, respostas helper
prisma/
  schema.prisma    # Modelos do banco (User, Book, Loan)
  migrations/      # Migrações
```

## Scripts
- `npm run dev` — desenvolvimento com watch (tsx)
- `npm run build` — build TypeScript
- `npm start` — inicia build (dist)
- `npm test` — roda Jest
- `npm run test:watch` — testes em watch
- `npm run test:coverage` — cobertura
- `npm run test:ci` — CI com cobertura

## Licença
MIT

## Autoria

Feito com 💚 por vinnytherobot.