# SOLID Principles - Enforcement Guide

## Overview

Every piece of code written in this project MUST follow SOLID principles. These
are non-negotiable standards that ensure maintainability, testability, and
scalability.

## Code Review Checklist

Before approving ANY code, verify

- Each class has a single, clear purpose (SRP)
- New features added through extension, not modification (OCP)
- Subclasses can replace parents without issues (LSP)
- Interfaces are small and focused (ISP)
- Dependencies are injected, not instantiated (DIP)
- No tight coupling between modules
- Easy to test with mocks

---

## Related Documentation

### Architecture & Philosophy
- [Architecture Principles](../../docs/knowledge-base/protocols/ARCHITECTURE.md) - Server-side patterns and type safety
- [Compounding Engineering](../philosophy/compounding-engineering.md) - How SOLID enables compound growth
- [Lessons Learned](../memory/lessons-learnt.md#2025-11-12---solid-architecture-enables-code-reuse-in-document-processing) - Real-world SOLID examples

### Complementary Principles
- [Fail-Fast Principle](./fail-fast.md) - Error handling philosophy
- [YAGNI Principle](./yagni-principle.md) - Balancing SOLID with simplicity

### Implementation Examples
- [Info-Juicer Architecture](../memory/decisions-made.md#2025-11-12---info-juicer-solid-document-processing-architecture) - SOLID in practice
- [Architectural Decisions](../memory/decisions-made.md) - SOLID-driven design choices

### Quick References
- [Main Quick Reference](../../CLAUDE.md) - Tech stack and critical rules
