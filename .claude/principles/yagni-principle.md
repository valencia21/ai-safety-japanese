# YAGNI (You Aren't Gonna Need It)

## Core Principle

**Don't implement functionality until you actually need it.**

YAGNI is a fundamental development principle that prevents over-engineering by
focusing on current requirements rather than hypothetical future needs.

## Why YAGNI Matters

- **Reduces complexity**: Less code means fewer bugs and easier maintenance
- **Saves time**: Focus on current requirements instead of speculative futures
- **Prevents over-engineering**: Avoid building abstractions for unclear use
  cases
- **Improves focus**: Keep the codebase lean and purpose-driven
- **Faster delivery**: Ship working features sooner

## When to Apply YAGNI

### ✅ Do This

- Implement only what the current user story requires
- Add features when they're actually requested
- Create abstractions when you have 2-3 concrete use cases
- Build minimal viable solutions first
- Start with simple data structures

### ❌ Avoid This

- "We might need this later" implementations
- Complex configuration systems for single use cases
- Generic solutions without specific requirements
- Premature abstractions based on assumptions
- Building plugin architectures before having plugins

## Code Examples

### Over-engineered vs. Simple

```typescript
// ❌ Over-engineered (YAGNI violation)
interface UserRepository {
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
  findByRole(role: string): Promise<User[]>
  findByDateRange(start: Date, end: Date): Promise<User[]>
  findByCustomQuery(query: QueryBuilder): Promise<User[]>
  findByComplexCriteria(criteria: SearchCriteria): Promise<User[]>
}

// ✅ Start simple (YAGNI compliant)
interface UserRepository {
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
}
// Add more methods only when actually needed
```

### Configuration Systems

```typescript
// ❌ Over-abstracted
class ConfigurableEmailService {
  private providers: Map<string, EmailProvider>
  private templates: Map<string, Template>
  private middleware: Middleware[]
  private fallbackStrategies: FallbackStrategy[]

  send(config: EmailConfig): Promise<void>
  addProvider(name: string, provider: EmailProvider): void
  setTemplate(type: string, template: Template): void
  // ... complex system for simple email sending
}

// ✅ Simple solution first
const sendWelcomeEmail = async (user: User): Promise<void> => {
  const html = `<h1>Welcome ${user.name}!</h1>`
  await emailClient.send({
    to: user.email,
    subject: 'Welcome to Aegis',
    html,
  })
}
// Build email system only when multiple email types emerge
```

## Balancing YAGNI with Good Design

### When to Bend YAGNI

- **Security**: Always implement proper security from the start
- **Performance**: Address known bottlenecks early
- **Data integrity**: Set up proper validation and constraints
- **Testing**: Write tests for current functionality
- **Error handling**: Handle expected error cases

### YAGNI + Clean Code

```typescript
// ✅ Good: Simple but clean
export const calculateTax = (amount: number): number => {
  const TAX_RATE = 0.08
  return amount * TAX_RATE
}

// Later, when business rules actually change:
export const calculateTax = (amount: number, jurisdiction: string): number => {
  const TAX_RATES = {
    CA: 0.08,
    NY: 0.1,
    TX: 0.06,
  } as const
  return amount * (TAX_RATES[jurisdiction] || 0)
}
```

## Red Flags (YAGNI Violations)

- Adding configuration options "just in case"
- Building plugin systems before having plugins
- Creating complex hierarchies for simple data
- Implementing caching before measuring performance
- Adding database indexes for unused queries
- Building generic "frameworks" for single use cases
- Creating abstractions for 1-2 similar pieces of code

## YAGNI Workflow

1. **Understand the requirement**: What exactly is needed now?
2. **Implement the simplest solution**: Solve the current problem directly
3. **Test thoroughly**: Ensure current functionality works correctly
4. **Refactor when needed**: Add complexity only when requirements change
5. **Repeat**: Apply YAGNI to each new requirement

## Project-Specific Applications

### In Aegis Platform

- **Analysis types**: Start with basic analysis before building extensibility
- **File processing**: Implement simple upload before adding batch processing
- **Reports**: Build standard reports before creating custom report builders
- **User management**: Add basic roles before implementing fine-grained
  permissions
- **API design**: Create specific endpoints before building generic query
  systems

### Code Review Questions

When reviewing code, ask:

- Is this solving a current requirement or a hypothetical one?
- Can we simplify this without losing functionality?
- Are we building for 1 use case or imagining 10?
- What's the simplest thing that could work?

## Remember

**The best code is the code you don't have to write.**

Focus on solving today's problems well, and let tomorrow's problems inform
tomorrow's solutions.

---

## See Also

- [SOLID Principles](./solid-principles.md) - Balancing simplicity with good design
- [Architecture Principles](../../docs/knowledge-base/protocols/ARCHITECTURE.md) - When to apply architectural patterns
- [Lessons Learned](../memory/lessons-learnt.md#2025-11-11---use-tsx-for-cli-tools-instead-of-complex-build-configurations) - YAGNI examples from the project
