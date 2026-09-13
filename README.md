# Assignment 02

An assignment focused on database integration with Prisma and Hono, plus background job processing with BullMQ and Redis.

## Tech stack

- TypeScript and Node.js
- Hono
- PostgreSQL and Prisma ORM
- Redis and BullMQ


## Run locally

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL and Redis

```bash
docker compose up -d
```

### 3. Configure the environment

```bash
cp .env.example .env
```

Update `.env`:

```env
DATABASE_URL="postgresql://hono:hono@localhost:55432/hono"
OPENAI_API_KEY="your-api-key"
OPENAI_BASE_URL="your-provider-base-url"
```

`OPENAI_BASE_URL` may be left empty when the default provider endpoint is suitable.

### 4. Create the database tables

```bash
pnpm prisma db init
```

### 5. Start the API

```bash
pnpm run dev
```

The API runs at <http://localhost:3000>.

### 6. Start the worker

In another terminal:

```bash
pnpm run worker:dev
```

Both the API and worker must be running for queued jobs to be processed.

## API examples

### List jobs

```bash
curl http://localhost:3000/jobs
```

A job starts with the `PENDING` status and changes to `COMPLETED` after the worker finishes.

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm run dev` | Run the API in watch mode |
| `pnpm run worker:dev` | Run the queue worker in watch mode |
| `pnpm run contract:emit` | Regenerate the Prisma contract |

## Project structure

```text
src/
├── index.ts              # Hono server
├── llm/                  # AI model configuration
├── modules/job/          # Job routes, validation, and generation service
├── utils/db.ts           # Database client
└── worker/               # BullMQ queue and worker
prisma/
└── schema.prisma         # Database models
docker-compose.yml        # PostgreSQL and Redis services
```
