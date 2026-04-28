# Ratcheting Principle

## Core Concept

Ratcheting is a **fail-fast enforcement mechanism** that prevents code quality metrics from degrading over time. Like a mechanical ratchet that allows movement in only one direction, ratcheting ensures your codebase can only improve or stay the same—never regress.

Instead of demanding perfection immediately (which blocks progress), ratcheting locks in the current state as the baseline and prevents any new violations from being introduced.

## Key Principles

### 1. Progressive Quality Improvement

Rather than requiring "fix everything now" (often impractical and demoralizing), ratcheting enables incremental improvement:

- **Lock current state**: Measure existing violations (e.g., 47 `any` types)
- **Prevent new violations**: CI fails if count increases to 48
- **Encourage improvement**: Developers can fix old violations to "earn" new ones
- **Celebrate progress**: When violations decrease, tighten the ratchet

### 2. Fail-Fast for New Code

Ratcheting aligns with the [fail-fast principle](./fail-fast.md) by catching quality regressions immediately:

- **Early detection**: CI blocks PRs that worsen metrics
- **Clear feedback**: "Coverage dropped from 73.5% to 71.2%"
- **Actionable**: Fix the new violation or improve an old one
- **Prevents compound debt**: Stop technical debt before it accumulates

### 3. Safe Adoption of Strict Rules

Ratcheting enables applying rigorous standards to new code without massive refactoring:

- **Brownfield-friendly**: Works with existing codebases
- **Non-blocking**: Doesn't halt feature development
- **Gradual migration**: Old code improves over time through natural attrition
- **Team morale**: Progress is visible and celebrated

## Common Ratcheting Targets

### Test Coverage
```bash
# Current: 73.5% coverage
# Ratchet: New changes cannot drop below 73.5%
# Goal: Gradually increase to 80%+
```

### Lint Violations
```json
{
  "no-explicit-any": 47,
  "no-unused-vars": 23,
  "complexity": 15
}
```

### Type Safety
- Number of `@ts-ignore` comments
- Files without strict null checks
- Untyped function parameters

### Performance Budgets
- Bundle size (KB)
- Lighthouse scores
- API response times

### Security Metrics
- Known vulnerabilities count
- Outdated dependencies
- Security lint warnings

## How It Works in Practice

### 1. Establish Baseline
```bash
# Measure current state
bun run eslint . --format json > .eslint-baseline.json
bun test --coverage --coverageThreshold='{"global":{"lines":73.5}}'
```

### 2. Enforce in CI
```yaml
# In CI pipeline
- name: Check ratchet
  run: |
    NEW_VIOLATIONS=$(bun run eslint . --format json | jq '.violations')
    BASELINE=$(cat .eslint-baseline.json | jq '.violations')
    if [ $NEW_VIOLATIONS -gt $BASELINE ]; then
      echo "❌ Ratchet violation: $NEW_VIOLATIONS > $BASELINE"
      exit 1
    fi
```

### 3. Update on Improvement
```bash
# When violations decrease, update baseline
if [ $NEW_VIOLATIONS -lt $BASELINE ]; then
  echo "✅ Quality improved: $BASELINE → $NEW_VIOLATIONS"
  echo $NEW_VIOLATIONS > .eslint-baseline.json
  git add .eslint-baseline.json
fi
```

## Integration with Aegis Development

### Current State
Aegis already uses several ratcheting-like mechanisms:

- **ESLint**: `bun run eslint .` in CI catches new violations
- **TypeScript**: Strict mode prevents new type errors
- **Format-on-edit**: `.claude/hooks/format-on-edit.sh` prevents formatting drift

### Potential Enhancements

1. **Test Coverage Ratcheting**
   ```bash
   # In justfile
   test-ratchet:
       bun test --coverage --coverage.thresholds.lines=current
   ```

2. **Bundle Size Ratcheting**
   ```typescript
   // In vite.config.ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
         },
       },
     },
     chunkSizeWarningLimit: 500, // Ratchet down from current
   }
   ```

3. **Dependency Freshness**
   ```bash
   # Maximum age of dependencies
   bun outdated --depth 0 | grep "Major" && exit 1
   ```

## Contrast with Alternative Approaches

### Big Bang Refactoring
**Traditional:**
- "We need to fix all 500 violations before shipping"
- Blocks features for weeks
- High risk, low morale
- Often abandoned

**Ratcheting:**
- "Lock at 500, chip away over time"
- Features ship normally
- Low risk, visible progress
- Sustainable

### Lax Standards
**Traditional:**
- "We'll fix it later" (never happens)
- Quality degrades continuously
- Technical debt compounds
- Emergency refactors required

**Ratcheting:**
- "Can't make it worse, encouraged to make it better"
- Quality improves or stays constant
- Debt decreases over time
- No emergency firefighting

### Strict Enforcement
**Traditional:**
- "Zero violations allowed"
- Great for greenfield projects
- Impractical for brownfield
- All-or-nothing

**Ratcheting:**
- "Zero new violations allowed"
- Works for any project age
- Pragmatic and incremental
- Progressive improvement

## Connection to Compounding Engineering

Ratcheting is a **foundational mechanism** for [compounding engineering](./compounding-engineering.md):

1. **Memory**: Baseline files capture the current quality state
2. **Self-Improvement**: Each improvement tightens the ratchet automatically
3. **Permanent Knowledge**: Quality gains are locked in and never lost
4. **Acceleration**: As violations decrease, development naturally speeds up

Every time you tighten a ratchet (reduce violations), future developers benefit from:
- Clearer code (fewer `any` types)
- Better test coverage (higher confidence)
- Smaller bundles (faster load times)
- Fewer bugs (stricter linting)

This creates a virtuous cycle where quality improvements compound over time.

## Implementation Checklist

- [ ] Identify metrics to ratchet (coverage, lint violations, bundle size)
- [ ] Measure current baseline for each metric
- [ ] Add baseline files to repository (`.eslint-baseline.json`, etc.)
- [ ] Implement CI checks that fail on regression
- [ ] Add "ratchet tightening" automation when metrics improve
- [ ] Document the process in [Knowledge Base](../../docs/knowledge-base/INDEX.md)
- [ ] Celebrate when ratchets tighten (Slack notifications, etc.)

## Anti-Patterns to Avoid

### 1. Ratcheting Without Visibility
❌ Silent failures in CI logs
✅ Clear messages: "Coverage dropped 73.5% → 71.2%"

### 2. Too Many Ratchets
❌ Ratcheting 20 different metrics
✅ Start with 2-3 high-impact metrics

### 3. No Escape Hatch
❌ Blocking urgent hotfixes because of ratchet violations
✅ Allow temporary bypass with required follow-up task

### 4. Set-and-Forget
❌ Baseline file from 2 years ago
✅ Regularly review and tighten ratchets as quality improves

### 5. Punitive Tone
❌ "You broke the build by adding violations!"
✅ "Let's fix this violation or improve an old one to balance it out"

## Success Metrics

You'll know ratcheting is working when:

1. **Baseline files show steady improvement** over time
2. **Developers proactively fix old violations** to "earn budget" for new code
3. **Quality metrics trend upward** in dashboards
4. **New team members inherit higher quality standards** automatically
5. **Emergency "fix everything" refactors become unnecessary**

---

## See Also

- [Fail-Fast Principle](./fail-fast.md) - Catch issues early before they compound
- [Compounding Engineering](../philosophy/compounding-engineering.md) - How ratcheting enables continuous improvement
- [SOLID Principles](./solid-principles.md) - Quality standards enforced by ratcheting
- [YAGNI Principle](./yagni-principle.md) - Avoiding over-engineering while improving incrementally
- [Lessons Learned](../memory/lessons-learnt.md) - Real examples of ratcheting in action
- [Knowledge Base](../../docs/knowledge-base/INDEX.md) - CI/CD integration patterns
