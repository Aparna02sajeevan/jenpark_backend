# Contributing to JenPark Backend

Thanks for contributing. Please follow the rules below to keep history clean and reviews fast.

## Branch Naming

| Type      | Pattern              | Example                  |
| --------- | -------------------- | ------------------------ |
| Feature   | `feature/<module>`   | `feature/auth-login`     |
| Bugfix    | `bugfix/<module>`    | `bugfix/health-uptime`   |
| Hotfix    | `hotfix/<issue>`     | `hotfix/jwt-expiry`      |
| Docs      | `docs/<topic>`       | `docs/readme-architecture` |
| Refactor  | `refactor/<module>`  | `refactor/user-service`  |

Branch from `main`. Keep branches short-lived.

## Commit Convention

Use **Conventional Commits**:

```
<type>(<scope>): <short summary>
```

| Type       | Use for                                |
| ---------- | -------------------------------------- |
| `feat:`    | New feature                            |
| `fix:`     | Bug fix                                |
| `docs:`    | Documentation only                     |
| `refactor:`| Code restructuring, no behavior change |
| `test:`    | Tests added or updated                 |
| `chore:`   | Tooling, deps, config                  |
| `perf:`    | Performance improvement                |
| `style:`   | Formatting only                        |

Examples:

```
feat(auth): add refresh token rotation
fix(health): correct uptime serialization
docs(readme): document swagger endpoint
```

## Pull Request Process

1. **Sync**: rebase your branch on the latest `main`.
2. **Lint**: `npm run lint` must pass.
3. **Document**: update README / Swagger JSDoc for any new public surface.
4. **Open PR** against `main`. Title follows commit convention.
5. **Description** must include:
   - What changed and why
   - Linked ticket (if any)
   - Testing notes / screenshots (for API responses)
6. **Reviewers**: at least one approval required.
7. **Merge strategy**: squash & merge. Delete branch after merge.

## Code Review Expectations

- Controllers stay thin.
- No business logic in routes or models.
- All public routes validated with Joi.
- No `console.log` — use `logger`.
- No hard-coded secrets, URLs, or keys.

## Local Setup

See [README.md](./README.md#installation).
