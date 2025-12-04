# Contributing — Sistema de Chamados (Frontend)

Welcome! Thank you for helping improve the project.

## Local setup
1. Clone repository
2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev -- --host
```

4. Lint before sending PRs

```bash
npm run lint
```

## Branching & PRs
- Create feature branches off `main` or `develop` depending on repo workflow: `feature/<short-description>`
- Keep PRs focused and small
- Describe the purpose, important files changed and how to test

## Code style
- Follow the existing code style (ESLint rules). Keep components small and memoize where appropriate.

## Tests
- Add unit tests for new functionality and consider e2e tests for critical flows.

## Release & versioning
- Use semantic versioning for built artifacts (if applicable)

## Review checklist for reviewers
- Verify lint passes
- Verify behavior works on multiple roles
- Check for any hardcoded URLs or secrets

---

If you want CI checks or a GitHub Actions template added, I can scaffold a `.github/workflows` pipeline for lint/build/test.
