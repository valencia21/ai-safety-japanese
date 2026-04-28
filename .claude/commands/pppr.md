---
description: Post-Processing PR
---

# Post-Processing PR (pppr)

Clean up after a PR has been merged to dev. This command handles branch cleanup
and synchronization.

## Workflow

- **Checkout dev**: checkout the up-to-date dev branch from the remote
- **Delete Local Branch**: Remove the merged topic branch locally
- **Delete Remote Branch**: Remove the merged topic branch from origin

## Prerequisites

- The PR must be merged to dev

## Notes

- **Safe**: Only runs after confirming PR is merged
- **Clean state**: Leaves you on an updated dev branch
- **Complete cleanup**: Removes both local and remote branches
