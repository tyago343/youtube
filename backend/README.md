# OpenTube Backend

REST API for the OpenTube platform. For general project information, see the [main README](../README.md).

## Tech Stack

| Category        | Technology            |
| --------------- | --------------------- |
| Framework       | NestJS 11             |
| Language        | TypeScript 5.7        |
| Database        | PostgreSQL 15         |
| ORM             | TypeORM               |
| Object Storage  | MinIO (S3-compatible) |
| Authentication  | Passport + JWT        |
| Validation      | class-validator       |
| Documentation   | Swagger/OpenAPI       |
| Testing         | Jest 30               |
| Package Manager | pnpm                  |

## Architecture

This project follows **Hexagonal Architecture** (Ports and Adapters) combined with **Domain-Driven Design** principles. The architecture ensures:

- Framework independence in the domain layer
- Testability through dependency inversion
- Clear separation of concerns
- Business logic isolated from infrastructure details

### Dependency Rule

Dependencies always point **inward** toward the domain. The domain layer has zero external dependencies and defines the core business logic. Infrastructure implements the ports (interfaces) defined in the application layer.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm
- Docker (for PostgreSQL and MinIO)

### Local Development

```bash
# Install dependencies
pnpm install

# Copy environment file and configure
cp .env.example .env

# Start PostgreSQL and MinIO (required)
docker compose up postgres minio -d

# Start dev server
pnpm start:dev
```

> For running everything with Docker, see the [main README](../README.md#quick-start).

### Environment Variables

| Variable                | Description                    | Default     |
| ----------------------- | ------------------------------ | ----------- |
| `DB_HOST`               | PostgreSQL host                | `localhost` |
| `DB_PORT`               | PostgreSQL port                | `5432`      |
| `DB_USER`               | Database user                  | `admin`     |
| `DB_PASSWORD`           | Database password              | `root`      |
| `DB_NAME`               | Database name                  | `opentube`  |
| `JWT_SECRET`            | Secret key for JWT signing     | (required)  |
| `JWT_ACCESS_TOKEN_TTL`  | Access token TTL in seconds    | `3600`      |
| `JWT_REFRESH_TOKEN_TTL` | Refresh token TTL in seconds   | `603600`    |
| `MINIO_ENDPOINT`        | MinIO/S3 endpoint              | `localhost` |
| `MINIO_PORT`            | MinIO port                     | `9000`      |
| `MINIO_ACCESS_KEY`      | MinIO access key               | (required)  |
| `MINIO_SECRET_KEY`      | MinIO secret key               | (required)  |
| `MINIO_BUCKET`          | Storage bucket name            | `opentube`  |
| `STORAGE_TYPE`          | Storage type (`minio` or `s3`) | `minio`     |
| `AWS_REGION`            | AWS region (for S3)            | `us-east-1` |

## API Documentation

Swagger UI is available at `/api/docs` when running locally:

```
http://localhost:3000/api/docs
```

### Main Endpoints

| Method | Endpoint            | Description          | Auth |
| ------ | ------------------- | -------------------- | ---- |
| POST   | `/auth/signup`      | Register new user    | No   |
| POST   | `/auth/login`       | Login and get tokens | No   |
| POST   | `/auth/refresh`     | Refresh access token | No   |
| GET    | `/users`            | List all users       | Yes  |
| GET    | `/users/:id`        | Get user by ID       | Yes  |
| PATCH  | `/users/:id`        | Update user          | Yes  |
| POST   | `/users/:id/avatar` | Upload avatar        | Yes  |
| GET    | `/videos`           | List public videos   | No   |
| POST   | `/videos`           | Create video         | Yes  |
| GET    | `/videos/:id`       | Get video by ID      | Yes  |
| GET    | `/channels`         | List active channels | No   |
| POST   | `/channels`         | Create channel       | Yes  |

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── seed.ts                 # Database seeding script
└── modules/
    ├── authentication/     # Auth module (JWT, guards, strategies)
    │   ├── application/    # Use cases, services, ports
    │   ├── domain/         # Token entities, exceptions
    │   ├── infrastructure/ # JWT service, guards, strategies
    │   └── presenters/     # Controllers, DTOs
    │
    ├── users/              # User management
    │   ├── application/    # CRUD use cases
    │   ├── domain/         # User entity, VOs (Email, Password, etc.)
    │   ├── infrastructure/ # TypeORM repository
    │   └── presenters/     # REST controller, DTOs
    │
    ├── videos/             # Video management
    │   ├── application/    # Video use cases
    │   ├── domain/         # Video entity, visibility VO
    │   ├── infrastructure/ # TypeORM repository
    │   └── presenters/     # REST controller, DTOs
    │
    ├── channels/           # Channel management
    │   ├── application/    # Channel use cases (CRUD, suspend, reactivate)
    │   ├── domain/         # Channel entity, status VO
    │   ├── infrastructure/ # Repository, suspension scheduler
    │   └── presenters/     # REST controller, DTOs
    │
    └── shared/             # Cross-cutting concerns
        ├── application/    # Shared ports (DB config, storage, hashing)
        ├── infrastructure/ # Implementations (PostgreSQL, MinIO, bcrypt)
        └── presenters/     # Global filters (DomainExceptionFilter)
```

## Available Scripts

| Script             | Description                       |
| ------------------ | --------------------------------- |
| `pnpm start:dev`   | Start in development mode (watch) |
| `pnpm start:debug` | Start with debugger attached      |
| `pnpm start:prod`  | Start production build            |
| `pnpm build`       | Build for production              |
| `pnpm test`        | Run unit tests                    |
| `pnpm test:watch`  | Run tests in watch mode           |
| `pnpm test:cov`    | Run tests with coverage           |
| `pnpm test:e2e`    | Run end-to-end tests              |
| `pnpm lint`        | Run ESLint                        |
| `pnpm format`      | Format code with Prettier         |
| `pnpm seed`        | Seed database with sample data    |

## Testing

The project uses Jest for testing with a focus on:

- **Domain**: Pure unit tests (no mocks needed)
- **Application**: Unit tests with mocked ports
- **Infrastructure**: Integration tests where appropriate

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:cov

# Run specific module tests
pnpm test -- --testPathPattern=users
```

### Test Structure

Tests follow the Arrange-Act-Assert pattern and are co-located with the code they test:

```
application/
├── use-cases/
│   └── create-user.use-case.ts
└── __tests__/
    ├── create-user.use-case.spec.ts
    └── mocks/
        └── user-repository.mock.ts
```

## Code Quality

### ESLint Rules

The project enforces strict complexity limits:

| Rule                   | Limit |
| ---------------------- | ----- |
| Cyclomatic complexity  | 10    |
| Max nesting depth      | 5     |
| Max lines per file     | 300   |
| Max lines per function | 80    |
| Max parameters         | 3     |

### Conventions

- **File naming**: `kebab-case.ts` (enforced by ESLint unicorn plugin)
- **No `any`**: Explicit types required everywhere
- **Validation at boundaries**: All external input validated in presenters
- **Domain purity**: Domain layer has zero framework dependencies

## License

MIT
