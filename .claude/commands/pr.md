---
description: Create a PR to a target branch (default: auto-detect parent)
argument-hint: "[branch-name]"
---

# PR to Target Branch

Rebase the current branch onto a target branch, commit changes, and create a PR
targeting that branch.

## Usage

- `/pr` - Auto-detect parent branch and create PR to it
- `/pr dev` - Create PR to dev
- `/pr staging` - Create PR to staging
- `/pr <branch-name>` - Create PR to any specified branch

## Workflow

- **Determine Target Branch**:
  - **If $1 (first argument) is provided**, use `$1` as the target branch.
  - **If no argument is provided**, auto-detect the parent branch from the
    upstream tracking branch:
    `git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null | cut -d'/' -f2-`
  - **If upstream cannot be determined**, fail with an error message asking the
    user to either:
    - Set upstream: `git branch --set-upstream-to=origin/<branch>`
    - Specify target explicitly: `/pr <branch-name>`

- **Fetch and Rebase**: Fetch origin and rebase the current branch onto the
  **target branch**.

- **Stage and Commit**: Stage and commit all changes with a clear commit message
  (if not already committed).

- **Push**: Push the current branch to origin.

- **Create PR**: Create a Pull Request targeting the **target branch**.

## Notes

- **Compact commit message**: The message is a one-liner and max 80 characters
- **Branch naming**: Use `feat/`, `fix/`, `refactor/`, etc. prefixes
- **Clean state**: This command handles uncommitted changes by committing them
- **Rebase conflicts**: Handle conflicts carefully during the rebase step
- **Fail-fast**: If target cannot be determined, the command fails rather than
  guessing
