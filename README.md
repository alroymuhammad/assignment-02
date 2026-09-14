# Indonesian Recipe Generator

An AI-powered API that generates up to three Indonesian recipes from a list of ingredients and a cooking goal. Requests are queued with BullMQ, processed in the background using an OpenAI-compatible model, and stored in PostgreSQL with Prisma.

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

> **Why `--harmony-temporal`?** Temporal is not enabled by default in the current Node.js runtime, but Prisma 8's data shape requires it. The development scripts therefore start Node.js with this flag.

## API examples

### Generate recipes

```bash
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "rice", "chili"],
    "goal": "A quick, high-protein dinner"
  }'
```

The request returns a recipe job with a `PENDING` status. The worker generates and stores up to three recipes, then marks the job as `COMPLETED`.

### List recipe jobs

```bash
curl http://localhost:3000/recipes
```

### Get generated recipes

Replace `<job-id>` with the ID returned when creating the job:

```bash
curl http://localhost:3000/recipes/<job-id>
```

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
├── modules/job/          # Recipe job routes, validation, and AI generation
├── utils/db.ts           # Database client
└── worker/               # BullMQ queue and worker
prisma/
└── schema.prisma         # Database models
docker-compose.yml        # PostgreSQL and Redis services
```
