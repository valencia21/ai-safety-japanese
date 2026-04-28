# Fail-Fast Principle

## Philosophy

**Detect and report errors immediately at the point of failure, rather than
allowing invalid states to propagate through the system.**

## Core Tenets

1. **Validate early, fail immediately**
2. **Make bugs obvious and loud**
3. **Prevent corruption from spreading**
4. **Fail at compile time > runtime > silent corruption**
5. **Invalid states should be unrepresentable**

## Agent Instructions

### Before writing any function

- Define preconditions
- Add validation at entry point
- Throw exceptions for violations

### When designing types

- Make invalid states unrepresentable
- Use discriminated unions
- Avoid optional properties when possible

### When handling errors

- Let exceptions bubble up
- Don't return null/undefined for errors
- Add context to error messages

### When reviewing code

- Identify points where validation is missing
- Flag defensive returns
- Suggest stronger types

## When NOT to Fail Fast

Rare exceptions where graceful degradation is acceptable:

1. **Non-critical features** (analytics, ads)
2. **Third-party API failures** (try alternative)
3. **User-facing forms** (show validation errors, don't crash)
4. **Background jobs** (retry with exponential backoff)

Even then: Log errors, alert monitoring, and plan to fix root cause.

---

## See Also

- [SOLID Principles](./solid-principles.md) - Complementary code quality patterns
- [Architecture Principles](../../docs/knowledge-base/protocols/ARCHITECTURE.md) - Type safety and validation patterns
- [Lessons Learned](../memory/lessons-learnt.md) - Real-world fail-fast examples
