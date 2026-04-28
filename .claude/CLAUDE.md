# Claude Configuration

This directory contains Claude-specific configuration and documentation files.

## Structure

```
.claude/
├── settings.json          # Hook configurations and Claude Code settings
├── hooks/                 # Automation scripts (format-on-edit, etc.)
├── philosophy/            # General development philosophy and approaches
├── principles/            # Engineering principles and best practices
├── standards/             # Concrete specifications and guidelines
├── memory/                # Session memories and learnings
└── CLAUDE.md             # This documentation file
```

## Purpose

This `.claude` directory serves as a centralized location for Claude Code
configuration, engineering principles, and compound engineering practices.

## Key Components

### Core Configuration

- **[settings.json](./settings.json)** - Claude Code hooks and automation settings
- **[hooks/](./hooks/)** - Automated scripts for code quality enforcement

### Development Guidelines

- **[philosophy/](./philosophy/)** - High-level development philosophy
- **[principles/](./principles/)** - Specific engineering principles and coding standards
- **[standards/](./standards/)** - Concrete specifications and guidelines
- **[memory/](./memory/)** - Project-specific learnings and institutional knowledge

## Integration with Project

This Claude configuration integrates with the main project documentation:

- **[Main Developer Guide](../CLAUDE.md)** - Complete development instructions
- **[ESLint Configuration](../eslint.config.js)** - Linting rules applied by hooks
- **[Code Formatting](../.prettierrc.yaml)** - Formatting standards enforced automatically

---

## Engineering Principles

- [SOLID Principles](./principles/solid-principles.md) - Code quality enforcement guide
- [Fail-Fast Principle](./principles/fail-fast.md) - Error handling philosophy
- [YAGNI Principle](./principles/yagni-principle.md) - Avoiding over-engineering
- [Ratcheting Principle](./principles/ratcheting.md) - Progressive quality improvement

## Development Philosophy

- [Compounding Engineering](./philosophy/compounding-engineering.md) - Self-improving development systems
- [Architectural Decisions](./memory/decisions-made.md) - Key technical choices and rationale
- [Lessons Learned](./memory/lessons-learnt.md) - Historical patterns and learnings
