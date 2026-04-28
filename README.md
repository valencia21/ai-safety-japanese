# Foundation

A full-stack monorepo template for building modern web applications.

## Features

- **TanStack Start** - Modern React framework with file-based routing
- **Convex** - Real-time reactive database with built-in file storage
- **WorkOS** - Enterprise authentication via Convex native integration
- **Mastra** - AI agent framework with example agent
- **Tailwind v4** - Next-generation CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **8 Theme System** - Pre-built color themes with CSS variables
- **Terramate** - Multi-environment infrastructure as code
- **GCP Cloud Run** - Serverless container hosting

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 20 (for some tools)
- [Just](https://github.com/casey/just) (optional, for task runner)

### Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/your-org/foundation.git
   cd foundation
   bun install
   ```

2. **Configure environment:**
   ```bash
   cp .env.local.template .env.local
   # Edit .env.local with your credentials
   ```

3. **Set up Convex:**
   ```bash
   cd apps/foundation
   npx convex dev
   # Follow prompts to create a new project
   ```

4. **Start development:**
   ```bash
   just dev
   # or: bun run dev
   ```

## Project Structure

```
foundation/
├── apps/
│   └── foundation/           # Main web application
│       ├── src/
│       │   ├── routes/       # File-based routing
│       │   ├── lib/          # Shared utilities
│       │   │   ├── utils.ts  # cn() and helpers
│       │   │   └── server/
│       │   │       └── mastra/  # AI agents
│       │   └── styles/
│       │       ├── app.css   # Main styles
│       │       └── themes/   # 8 color themes
│       └── convex/           # Database schema and functions
├── packages/
│   └── logging/              # @foundation/logging - Pino structured logging
├── infra/                    # Terramate + Terraform infrastructure
│   ├── values/               # Environment configs (dev, stg, prd)
│   ├── modules/              # Reusable Terraform modules
│   └── stacks/               # Environment stacks
└── .claude/                  # Claude Code configuration
```

## Configuration

### Convex

1. Create a project at [convex.dev](https://dashboard.convex.dev)
2. Copy the deployment URL to `VITE_CONVEX_URL`
3. Set `WORKOS_CLIENT_ID` in Convex environment variables

### WorkOS

1. Create a project at [workos.com](https://dashboard.workos.com)
2. Set `VITE_WORKOS_CLIENT_ID` and `VITE_WORKOS_REDIRECT_URI`
3. Configure redirect URI in WorkOS dashboard

### AI Keys

For local development, add to `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_GENERATIVE_AI_API_KEY=xxx
OPENAI_API_KEY=sk-xxx
EXA_API_KEY=xxx
```

For production, store in GCP Secret Manager.

## Commands

| Command | Description |
|---------|-------------|
| `just dev` | Start development server |
| `just build` | Build for production |
| `just test` | Run tests |
| `just format` | Format code |
| `just lint` | Lint code |
| `just convex-dev` | Start Convex dev |
| `just convex-deploy` | Deploy Convex |
| `just mastra-dev` | Start Mastra playground |
| `just secrets-fetch` | Fetch AI secrets from GCP |

## Themes

Switch themes by setting `data-theme` on the root element:

```tsx
<html data-theme="kanagawa">
```

Available themes:
- `corporate-blue` (default)
- `ceramic`
- `forest-green`
- `kanagawa`
- `ocean-deep`
- `stone-gray`
- `sunset-orange`
- `warm-earth`

## Infrastructure

See [infra/README.md](infra/README.md) for infrastructure setup.

### Environments

| Environment | Branch | Purpose |
|-------------|--------|---------|
| dev | dev | Development and testing |
| stg | stg | Staging and pre-production |
| prd | main | Production |

## License

MIT
