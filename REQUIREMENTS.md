# n8n Node Requirements and Checklist

Reference guide to keep the `n8n-nodes-rckflr-centroid` project professional, documented and ready for publication.

## 1. General Requirements

- Keep the repository lean; remove unused starter assets.
- Maintain an up to date `.gitignore` covering `node_modules`, `dist`, build caches and local packages.
- Ensure `package.json` includes name, description, author, license, keywords, repository, bugs and homepage.
- Follow semantic versioning (`MAJOR.MINOR.PATCH`) and tag every release on GitHub.
- Track changes in `CHANGELOG.md` for each version.
- Support `n8n >= 1.40.0` and Node.js LTS 20.x.
- Audit dependencies regularly (`pnpm audit`, `npm audit`) and unblock issues promptly.

## 2. Documentation

- **README.md**
  - Provide a clear English description of the node.
  - Include a practical example (JSON workflow export or screenshot).
  - Document inputs, outputs and error handling.
  - Display status badges (npm version, CI, coverage, license).
- **Additional files**
  - `LICENSE` (MIT or Apache 2.0).
  - `CONTRIBUTING.md` with collaboration guidelines.
  - `CODE_OF_CONDUCT.md` aligned with the community.
  - `SECURITY.md` describing how to report vulnerabilities.

## 3. Code and Technical Structure

- Follow the `n8n-nodes-base` layout: node code in `/nodes`, credentials in `/credentials`.
- Export `nodeType` and `nodeDescription` correctly for each module.
- Validate parameters before processing data.
- Use `NodeOperationError` or `NodeApiError` for predictable failures.
- Wrap external operations in `try/catch` blocks.
- Provide descriptive, English error messages.
- Maintain unit and integration tests (Jest, Mocha+Chai, Vitest or similar) with coverage at or above 80%, covering success paths, limits and failure scenarios.

## 4. Quality and Automation

- **Linting and formatting**
  - Configure ESLint and Prettier with shared rules.
  - Provide scripts in `package.json`, for example:
    ```json
    {
      "scripts": {
        "lint": "eslint src --ext .ts",
        "format": "prettier --write ."
      }
    }
    ```
- **CI/CD**
  - Add `.github/workflows/ci.yml` to install dependencies and run `lint`, `build` and `test`.
  - Optionally automate npm publishing when the main branch passes checks.
- **Build**
  - Compile with `tsc` or `rollup` and emit artefacts in `/dist`.
  - Ensure `package.json` exposes:
    ```json
    {
      "files": ["dist", "nodes", "credentials"]
    }
    ```

## 5. npm Publication

- Validate the package with `npm pack`.
- Test local installation via `npm install -g ./package.tgz`.
- Publish with:
  ```bash
  npm publish --access public
  ```
- Keep `package.json` and `CHANGELOG.md` aligned for every release.
- Fill in npm metadata (`repository`, `bugs`, `homepage`, `keywords`).

## 6. Optional Improvements

- Provide an `/examples` directory with demo workflows.
- Ship a `docker-compose.yml` that boots a local test environment.
- Configure Dependabot or Renovate to track dependency updates.
- Integrate CodeClimate, SonarCloud or similar for quality metrics.

## 7. Verification Checklist

| Area               | Verification                                                  | Status / Notes                                       |
|--------------------|----------------------------------------------------------------|------------------------------------------------------|
| Structure          | Node generated or adapted with `n8n-node` tooling             | Adapted from starter template; review complete       |
| Source code        | Code is complete and accessible in the repository             | Done                                                 |
| Dependencies       | No unnecessary or heavy dependencies                          | Done                                                 |
| Documentation      | Inputs and outputs documented                                 | Done                                                 |
| Documentation      | Practical example and English description provided            | Done                                                 |
| Errors             | Uses `NodeOperationError` or `NodeApiError`                   | Done                                                 |
| Messages           | Errors and descriptions written in clear English              | Done                                                 |
| System access      | No direct access to `process.env` or filesystem               | Done                                                 |
| Tests              | Unit and integration tests implemented                        | Unit tests in place; integration tests pending       |
| Tests              | Coverage >= 80% including error scenarios                     | Threshold configured; monitor coverage reports       |
| Linter             | ESLint / Prettier pass without errors                         | Done                                                 |
| Compatibility      | Works with `n8n >= 1.40.0` and Node 20.x                      | Done                                                 |
| Publication        | Can be packaged and installed without issues                  | Manual verification pending                          |
| Language           | Code, docs and messages in English                            | Done                                                 |
| License            | LICENSE file present and referenced                           | Done                                                 |
| Manual review      | Meets security and readability guidelines                     | Ongoing                                              |

---

Goal: deliver a verified node aligned with n8n guidelines, backed by documentation, automated quality checks and a repeatable release process.
