# Foundation Development Tasks
# Code is the document - commands are self-explanatory
# Keep tasks short, sweet, and idempotent

# List all commands
default:
  @just --list

# ============================================================================
# Primary Commands
# ============================================================================

# Start dev server
dev:
  @just _ensure-deps
  @cd apps/foundation && bun run dev

# Format all code
format:
  @bun run eslint --fix 'apps/**/*.{ts,tsx}' 'packages/**/*.{ts,tsx}'
  @bun run prettier --write '**/*.{md,json}'

# Run tests
test:
  @bun test

# Lint all code
lint:
  @bun run eslint 'apps/**/*.{ts,tsx}' 'packages/**/*.{ts,tsx}'

# Build for production
build:
  @cd apps/foundation && bun run build

# Type check
typecheck:
  @cd apps/foundation && bun run typecheck

# ============================================================================
# Setup
# ============================================================================

# Setup development environment
setup:
  @just _create-env-local

# ============================================================================
# Internal: Setup Checks
# ============================================================================

_ensure-deps:
  #!/usr/bin/env bash
  if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    bun install
  else
    echo "✅ Dependencies"
  fi

_create-env-local:
  #!/usr/bin/env bash
  set -euo pipefail

  if [ -f .env.local ]; then
    echo "✅ .env.local already exists"
    exit 0
  fi

  cp .env.local.template .env.local
  echo "✅ Created .env.local from template"
  echo ""
  echo "📝 Next steps:"
  echo "   1. Run: just dev"
