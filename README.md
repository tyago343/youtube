# OpenTube

A YouTube clone built for practicing **clean architecture patterns** and **Domain-Driven Design** principles.

## Tech Stack Overview

| Layer    | Technologies                                            |
| -------- | ------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit |
| Backend  | NestJS 11, TypeScript, PostgreSQL, TypeORM              |
| Storage  | MinIO (S3-compatible)                                   |
| Auth     | JWT with refresh tokens                                 |

## Project Structure

```
├── frontend/    # React SPA client
├── backend/     # NestJS REST API
└── docker-compose.yml
```

See each folder's README for detailed documentation:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js >= 20 (for local development)
- pnpm

### Run with Docker Compose (Recommended)

```bash
# Start all services (frontend, backend, PostgreSQL, MinIO)
docker compose up

# Or start specific services
docker compose up frontend
docker compose up backend
```

| Service  | URL                            |
| -------- | ------------------------------ |
| Frontend | http://localhost:5173          |
| Backend  | http://localhost:3000          |
| API Docs | http://localhost:3000/api/docs |
| MinIO    | http://localhost:9001          |

### Local Development

For local development without Docker, see the individual READMEs:

- [Frontend Setup](./frontend/README.md#getting-started)
- [Backend Setup](./backend/README.md#getting-started)

## Features

- User authentication (signup, login, JWT refresh)
- Video upload and streaming
- Channel management
- Search functionality
- Internationalization (EN, ES, FR)

## Architecture Highlights

- **Hexagonal Architecture** in the backend with clear separation between domain, application, and infrastructure layers
- **Feature-based modules** in the frontend with isolated state management
- **Runtime validation** using Zod (frontend) and class-validator (backend)
- **Strict code quality** rules enforced via ESLint

## Current Status

🚧 **In active development** — This is a learning project and may have incomplete features.

## License

MIT
