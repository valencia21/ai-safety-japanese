# Foundation Template

## Project Overview

Foundation is a full-stack monorepo template for building modern web applications with:

- **Frontend**: TanStack Start + React 19
- **Database**: Convex (real-time, reactive)
- **Auth**: Better Auth via Convex integration
- **AI**: Mastra beta with example agent
- **Infra**: GCP Cloud Run + Secret Manager
- **UI**: Tailwind v4 + shadcn/ui + 8 themes

## Quick Start

```bash
# Initialize from template (if cloning foundation)
./scripts/init-project.sh     # Prompts for project name, GCP project, region

# Setup (first time)
just setup                    # Creates .env.local from template
# Edit .env.local with your Convex URLs
just auth                     # Authenticate with GCP (for AI secrets)
direnv allow                  # Load devenv environment

# Development
just start                    # Start Vite + Convex + OTEL (detached)
just watch                    # Tail logs
just stop                     # Stop all processes
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Framework | TanStack Start |
| Database | Convex |
| Auth | Better Auth (via Convex) |
| AI | Mastra beta |
| Styling | Tailwind v4 |
| UI Components | shadcn/ui |
| Logging | @foundation/logging (Pino) |
| Infra | Terramate + Terraform |
| Hosting | GCP Cloud Run |

## Project Structure

```
foundation/
├── apps/
│   └── foundation/           # Main application
│       ├── src/
│       │   ├── routes/       # TanStack Router pages
│       │   ├── lib/          # Utilities and server code
│       │   │   └── server/
│       │   │       └── mastra/  # AI agents and tools
│       │   └── styles/       # Tailwind + themes
│       └── convex/           # Convex functions
├── packages/
│   └── logging/              # Pino structured logging
├── infra/                    # Terramate infrastructure
└── .claude/                  # Claude Code configuration
```

## Development

### Commands

```bash
# Process Management (devenv)
just start        # Start Vite + Convex + OTEL (detached)
just stop         # Stop all processes
just watch        # Tail logs
just monitor      # Process-compose TUI dashboard
just trace        # Interactive OTEL trace viewer
just restart      # Restart Vite process

# Build & Test
just build        # Build for production
just test         # Run tests
just format       # Format code
just lint         # Lint code
just typecheck    # Type check

# Convex
just convex-dev   # Start Convex dev (standalone)
just convex-deploy # Deploy Convex

# Mastra
just mastra-dev   # Start Mastra playground (standalone, with secrets)

# Secrets (via secretspec + GCP Secret Manager)
just secrets-status   # Show secrets status
just secrets-check    # Check secrets via secretspec
just secrets-migrate  # Migrate .env.secrets to GCP
```

### Environment Variables

**`.env.local`** (non-secret config):
- `VITE_CONVEX_URL` - Convex deployment URL
- `VITE_CONVEX_SITE_URL` - Convex site URL (ends in .site)
- `VITE_WORKOS_CLIENT_ID` - WorkOS client ID

**GCP Secret Manager** (AI secrets, loaded at runtime via secretspec):
- `ANTHROPIC_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `OPENAI_API_KEY`
- `EXA_API_KEY`

**Convex Dashboard**:
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `SITE_URL` - Your app URL (e.g., http://localhost:3001)

## Coding Rules

- [Compounding Engineering](.claude/philosophy/compounding-engineering.md)
- [SOLID Principles](.claude/principles/solid-principles.md)
- [Fail-Fast Principle](.claude/principles/fail-fast.md)
- [YAGNI Principle](.claude/principles/yagni-principle.md)
- [Ratcheting](.claude/principles/ratcheting.md)

## Themes

8 built-in themes available:
- Corporate Blue (default)
- Ceramic
- Forest Green
- Kanagawa
- Ocean Deep
- Stone Gray
- Sunset Orange
- Warm Earth

Set via `data-theme` attribute on root element.

## Workflows

### Plan
1. Check project status
2. Identify issues to solve
3. Design solution
4. Create GitHub issue with design doc

### Implement
1. Create feature branch
2. Write code with tests
3. Run tests and linting
4. Create PR with `/pr` command
5. Review and merge

### Document
Run `/compound` to capture learnings.
