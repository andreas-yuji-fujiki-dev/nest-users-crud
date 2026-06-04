# nest-users-crud

API REST para gerenciamento de usuários construída com NestJS, Prisma e SQLite.

## Stack

- **[NestJS](https://nestjs.com/)** v11 — framework Node.js para aplicações server-side
- **[Prisma](https://www.prisma.io/)** v7 — ORM e migrations
- **[SQLite](https://www.sqlite.org/)** — banco de dados via `better-sqlite3`
- **[class-validator](https://github.com/typestack/class-validator)** — validação de DTOs
- **TypeScript** v5

## Pré-requisitos

- Node.js >= 18
- npm

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
```

## Banco de dados

Aplicar as migrations e gerar o client do Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

## Rodando a aplicação

```bash
# desenvolvimento
npm run start

# modo watch (recarrega ao salvar)
npm run start:dev

# produção
npm run start:prod
```

A API estará disponível em `http://localhost:3000`.

## Endpoints

### Usuários

| Método   | Rota          | Descrição              |
|----------|---------------|------------------------|
| `POST`   | `/users`      | Criar usuário          |
| `GET`    | `/users`      | Listar todos usuários  |
| `GET`    | `/users/:id`  | Buscar usuário por ID  |
| `PATCH`  | `/users/:id`  | Atualizar usuário      |
| `DELETE` | `/users/:id`  | Deletar usuário        |

---

### `POST /users`

Cria um novo usuário.

**Body:**
```json
{
  "user_name": "andreas",
  "email": "andreas@email.com"
}
```

**Resposta (`201`):**
```json
{
  "id": 1,
  "user_name": "andreas",
  "email": "andreas@email.com"
}
```

**Erros:**
| Status | Mensagem |
|--------|----------|
| `400`  | `This e-mail is already registered` |
| `409`  | `This user name is not available...` |

---

### `GET /users`

Retorna todos os usuários cadastrados.

**Resposta (`200`):**
```json
[
  {
    "id": 1,
    "user_name": "andreas",
    "email": "andreas@email.com"
  }
]
```

---

### `GET /users/:id`

Retorna um usuário pelo ID.

**Resposta (`200`):**
```json
{
  "id": 1,
  "user_name": "andreas",
  "email": "andreas@email.com"
}
```

**Erro:**
| Status | Mensagem |
|--------|----------|
| `404`  | `Cannot find user with id {id}` |

---

### `PATCH /users/:id`

Atualiza parcialmente um usuário. Todos os campos são opcionais.

**Body (parcial):**
```json
{
  "user_name": "novo_nome"
}
```

**Resposta (`200`):**
```json
{
  "id": 1,
  "user_name": "novo_nome",
  "email": "andreas@email.com"
}
```

**Erros:**
| Status | Mensagem |
|--------|----------|
| `404`  | `Cannot find user with id {id}` |
| `409`  | `This email address is already in use` |
| `409`  | `This username is not available` |

---

### `DELETE /users/:id`

Remove um usuário pelo ID.

**Resposta (`200`):** objeto do usuário deletado.

**Erro:**
| Status | Mensagem |
|--------|----------|
| `404`  | `Cannot find user with id {id}` |

---

## Modelo de dados

```prisma
model User {
  id        Int    @id @default(autoincrement())
  user_name String @unique
  email     String @unique

  @@map("users")
}
```

## Regras de validação

| Campo       | Regras                              |
|-------------|-------------------------------------|
| `user_name` | string, mínimo 3 caracteres, único  |
| `email`     | formato de e-mail válido, único     |

## Scripts disponíveis

```bash
npm run build        # compila o projeto
npm run start:dev    # modo desenvolvimento com watch
npm run start:prod   # inicia build de produção
npm run lint         # lint com auto-fix
npm run format       # formata com Prettier
npm run test         # testes unitários
npm run test:e2e     # testes end-to-end
npm run test:cov     # cobertura de testes
```

## Estrutura do projeto

```
src/
├── app/
│   ├── app.module.ts       # módulo raiz
│   ├── app.controller.ts
│   └── app.service.ts
├── prisma/
│   ├── prisma.module.ts    # módulo global do Prisma
│   └── prisma.service.ts   # client Prisma com ciclo de vida do NestJS
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
└── main.ts
prisma/
├── schema.prisma
├── migrations/
└── dev.db
```
