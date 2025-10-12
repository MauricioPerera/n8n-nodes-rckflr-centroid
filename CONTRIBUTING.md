# Contributing Guidelines

Thank you for your interest in improving `n8n-nodes-rckflr-centroid`. This document outlines the process to propose changes and keep the project healthy.

## Getting Started

1. Fork the repository and create a feature branch from `main`.
2. Install dependencies with `pnpm install`.
3. Run `pnpm lint` and `pnpm test` to ensure the baseline is green before starting your work.

## Development Workflow

- Follow the existing TypeScript conventions and keep functions small and focused.
- Reuse helper utilities located in `nodes/Centroid/utils.ts` when possible.
- Add unit tests for new logic or bug fixes.
- Update documentation (`README.md`, `CHANGELOG.md`, `REQUIREMENTS.md`) when behaviour changes.

## Commit & Pull Request Guidelines

- Write clear, descriptive commit messages (imperative mood).
- Keep pull requests focused; open separate PRs for unrelated changes.
- Ensure `pnpm lint`, `pnpm test`, and `pnpm build` pass locally before opening the PR.
- Include workflow context, screenshots, or sample payloads when relevant.

## Code of Conduct

Please review the [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to uphold its standards.

## Security Disclosures

If you discover a vulnerability, follow the instructions in [SECURITY.md](SECURITY.md) instead of opening a public issue.
