# OpenTube Frontend

React client for the OpenTube platform. For general project information, see the [main README](../README.md).

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** (bundler)
- **Tailwind CSS 4** + **shadcn/ui**
- **Redux Toolkit** + **RTK Query**
- **React Hook Form** + **Zod**
- **React Router 7**
- **i18next** (EN, ES, FR)
- **Vitest** + **Testing Library**

## Project Structure

```
src/
├── core/           # Global config (store, router, providers, theme)
├── modules/        # Feature modules
│   ├── auth/       # Authentication (login, signup)
│   ├── channel/    # Channel management
│   ├── search/     # Search functionality
│   ├── user/       # User profile
│   ├── video/      # Video player, upload, grid
|   ├── .../
└── shared/         # Reusable components, hooks, utils
```

Each module follows this structure:

| Folder       | Purpose                                |
| ------------ | -------------------------------------- |
| `components` | Presentational UI components           |
| `hooks`      | Stateful logic and side effects        |
| `model`      | RTK Query endpoints, slices, selectors |
| `pages`      | Route pages (PascalCase naming)        |
| `schemas`    | Zod schemas for runtime validation     |
| `routes`     | Route configuration                    |

### Path Aliases

```typescript
@/         → src/
@core/     → src/core/
@shared/   → src/shared/
@modules/  → src/modules/
@auth/     → src/modules/auth/
@user/     → src/modules/user/
@video/    → src/modules/video/
@channel/  → src/modules/channel/
@search/   → src/modules/search/
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm

### Local Development

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start dev server
pnpm dev
```

> For running with Docker, see the [main README](../README.md#quick-start).

### Available Scripts

| Script         | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm lint`    | Run ESLint               |
| `pnpm test`    | Run tests with Vitest    |
| `pnpm preview` | Preview production build |

## Code Conventions

### File Naming

- **Default:** `kebab-case.ts` (e.g., `video-card.component.tsx`)
- **Pages:** `PascalCase.tsx` (e.g., `VideoWatch.tsx`)

### ESLint Constraints

The project enforces strict complexity limits:

- Max complexity: 10
- Max depth: 5
- Max lines per file: 300
- Max lines per function: 280
- Max parameters: 3

### API Response Validation

All API responses are validated at runtime using Zod schemas. Never trust server data blindly.

```typescript
// ✅ Correct
const data = UserSchema.parse(response);

// ❌ Wrong
const data = response as User;
```

## License

MIT
