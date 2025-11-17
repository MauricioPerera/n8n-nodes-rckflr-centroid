# CLAUDE.md - AI Assistant Development Guide

This document provides comprehensive guidance for AI assistants working on the `n8n-nodes-rckflr-centroid` project. It covers codebase structure, development workflows, testing practices, and key conventions to follow.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Development Environment](#development-environment)
5. [Code Architecture](#code-architecture)
6. [Development Workflows](#development-workflows)
7. [Testing Strategy](#testing-strategy)
8. [Code Quality Standards](#code-quality-standards)
9. [Release Process](#release-process)
10. [Common Tasks](#common-tasks)
11. [Important Conventions](#important-conventions)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Name**: n8n-nodes-rckflr-centroid
**Version**: 1.1.0
**Type**: n8n community node
**Purpose**: Calculate centroids of multidimensional numeric vectors with validation and item-level processing

### Key Features
- Processes vectors from parameters or incoming items
- Flexible vector source selection (parameter, item root, item path, or auto)
- Validates dimensional consistency and numeric values
- Supports batch processing with item-level error reporting
- Optional merging of centroid results with original item payload

### Requirements
- n8n >= 1.40.0
- Node.js >= 20.0.0
- pnpm >= 9.1.0

---

## Repository Structure

```
n8n-nodes-rckflr-centroid/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD pipeline
├── .vscode/
│   └── extensions.json         # Recommended VS Code extensions
├── credentials/                # Credentials directory (currently empty)
│   └── .gitkeep
├── dist/                       # Build output (generated, not in repo)
│   ├── nodes/
│   └── credentials/
├── examples/
│   └── centroid-basic.json     # Example n8n workflow
├── nodes/
│   └── Centroid/
│       ├── Centroid.node.ts    # Main node implementation
│       └── utils.ts            # Utility functions and validation logic
├── tests/
│   ├── Centroid.node.test.ts   # Node integration tests
│   └── calculateCentroid.test.ts # Unit tests for utility functions
├── .editorconfig               # Editor configuration
├── .eslintrc.js                # ESLint configuration
├── .eslintrc.prepublish.js     # Pre-publish linting rules (stricter)
├── .gitignore                  # Git ignore patterns
├── .npmignore                  # NPM publish ignore patterns
├── .prettierrc.js              # Prettier formatting configuration
├── CHANGELOG.md                # Version history
├── CODE_OF_CONDUCT.md          # Community guidelines
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE.md                  # MIT License
├── README.md                   # User-facing documentation
├── REQUIREMENTS.md             # Development requirements checklist
├── SECURITY.md                 # Security disclosure policy
├── gulpfile.js                 # Gulp tasks for icon copying
├── index.js                    # Package entry point (empty)
├── package.json                # Package manifest
├── pnpm-lock.yaml              # pnpm lock file
├── tsconfig.json               # TypeScript compiler configuration
├── tsconfig.eslint.json        # TypeScript config for ESLint
└── vitest.config.ts            # Vitest test configuration
```

---

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.5.3 (strict mode enabled)
- **Runtime**: Node.js 20.x LTS
- **Package Manager**: pnpm 9.1.4 (enforced via preinstall script)
- **Module System**: CommonJS

### Development Tools
- **Testing**: Vitest 1.6.0 with @vitest/coverage-v8
- **Linting**: ESLint 8.56.0 with eslint-plugin-n8n-nodes-base
- **Formatting**: Prettier 3.3.2
- **Build**: TypeScript Compiler + Gulp 4.0.2 (for icon copying)
- **CI/CD**: GitHub Actions

### n8n Integration
- **API Version**: 1
- **Peer Dependency**: n8n-workflow (any version)
- **Node Type**: Transform node (group: 'transform')

---

## Development Environment

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/MauricioPerera/n8n-nodes-rckflr-centroid.git
cd n8n-nodes-rckflr-centroid

# Install dependencies (pnpm is enforced)
pnpm install

# Verify setup
pnpm lint
pnpm test
pnpm build
```

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `pnpm build` | `tsc && gulp build:icons` | Compile TypeScript and copy icons to dist/ |
| `pnpm dev` | `tsc --watch` | Watch mode for development |
| `pnpm format` | `prettier --write ...` | Format code with Prettier |
| `pnpm lint` | `eslint ...` | Lint code (non-fixing) |
| `pnpm lintfix` | `eslint --fix ...` | Lint and auto-fix issues |
| `pnpm test` | `vitest run` | Run tests once |
| `pnpm test:watch` | `vitest watch` | Run tests in watch mode |
| `pnpm coverage` | `vitest run --coverage` | Run tests with coverage report |
| `pnpm prepublishOnly` | Combined checks | Pre-publish validation (build, lint, test) |

### VS Code Setup

Recommended extensions (defined in `.vscode/extensions.json`):
- ESLint
- Prettier
- EditorConfig

---

## Code Architecture

### Main Node Implementation

**File**: `nodes/Centroid/Centroid.node.ts`

The Centroid node follows the standard n8n node structure:

```typescript
export class Centroid implements INodeType {
  description: INodeTypeDescription = { /* Node metadata */ };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Main execution logic
  }
}
```

#### Node Parameters

1. **Array of Vectors** (`vectors`): JSON parameter for direct vector input
2. **Merge Output With Input** (`mergeOutput`): Boolean, default true
3. **Vector Source** (`vectorSource`): Options for data source selection
   - `auto`: Parameter first, fallback to item.json or item.json.vectors
   - `parameter`: Use only the parameter
   - `itemRoot`: Read from item.json root (must be array)
   - `itemPath`: Read from dot-separated path under item.json
4. **Vector Path** (`vectorPath`): String, visible when vectorSource is 'itemPath'

#### Execution Flow

```
1. Get input items (or default to 1 if no input)
2. For each item:
   a. Read node parameters
   b. Determine vector source based on vectorSource parameter
   c. Extract vectors according to source
   d. Validate and normalize vector input
   e. Calculate centroid
   f. Merge with original item (if mergeOutput is true)
   g. Preserve binary data and set pairedItem
3. Return processed items
```

#### Error Handling

- Uses `NodeOperationError` for all user-facing errors
- Includes `itemIndex` in error context for batch processing
- Wraps utility function errors to provide context

### Utility Functions

**File**: `nodes/Centroid/utils.ts`

#### `normalizeVectorsInput(rawValue: unknown): number[][]`

Validates and normalizes vector input from various formats:
- Accepts string (JSON), array, or other types
- Validates:
  - Non-empty array
  - All entries are arrays (vectors)
  - All vectors have same dimension
  - All components are finite numbers
- Returns normalized `number[][]`
- Throws descriptive errors for validation failures

#### `calculateCentroid(vectors: number[][]): number[]`

Calculates the centroid (mean point) of vectors:
- Input: Array of numeric vectors with consistent dimensions
- Output: Single vector representing the centroid
- Algorithm: Component-wise averaging
- Throws error for empty input or dimension mismatch

#### `getValueByPath(source: unknown, path: string): unknown`

Retrieves nested values using dot-separated paths:
- Example: `getValueByPath({data: {vectors: [...]}}, "data.vectors")`
- Returns `undefined` for invalid paths or null/undefined sources
- Used for flexible vector path access in 'itemPath' mode

---

## Development Workflows

### Making Changes

1. **Create a feature branch** from `main`
2. **Make changes** following TypeScript conventions
3. **Write or update tests** for new functionality
4. **Run linting**: `pnpm lint` (fix with `pnpm lintfix`)
5. **Run tests**: `pnpm test` or `pnpm coverage`
6. **Build**: `pnpm build`
7. **Update documentation** (README.md, CHANGELOG.md, etc.)
8. **Commit** with clear, imperative messages
9. **Open PR** against `main`

### Adding New Features

When adding new features to the Centroid node:

1. **Update node parameters** in `Centroid.node.ts` (`description.properties`)
2. **Modify execution logic** in the `execute()` method
3. **Add utility functions** to `utils.ts` if needed
4. **Write tests** for both unit (utils) and integration (node) levels
5. **Update documentation**:
   - README.md (usage section)
   - CHANGELOG.md (under [Unreleased])
   - REQUIREMENTS.md (if new requirements added)

### Modifying Validation Logic

Validation logic lives in `nodes/Centroid/utils.ts`:

```typescript
// Add new validation
export function normalizeVectorsInput(rawValue: unknown): number[][] {
  // ... existing validation ...

  // Add your new validation here
  if (/* condition */) {
    throw new Error('Descriptive error message');
  }

  return normalizedVectors;
}
```

**Important**: Always throw descriptive errors that help users understand what went wrong.

---

## Testing Strategy

### Test Framework

- **Framework**: Vitest 1.6.0
- **Coverage Tool**: @vitest/coverage-v8
- **Configuration**: `vitest.config.ts`
- **Test Location**: `tests/` directory

### Coverage Requirements

Minimum 80% coverage for:
- Lines
- Functions
- Branches
- Statements

### Test Structure

#### Unit Tests (`tests/calculateCentroid.test.ts`)

Test utility functions in isolation:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateCentroid, normalizeVectorsInput } from '../nodes/Centroid/utils';

describe('calculateCentroid', () => {
  it('should calculate centroid correctly', () => {
    const result = calculateCentroid([[0,0], [2,2]]);
    expect(result).toEqual([1, 1]);
  });

  // More tests...
});
```

#### Integration Tests (`tests/Centroid.node.test.ts`)

Test the complete node behavior with mock execution context:
```typescript
function createMockExecuteFunctions(params: Record<string, unknown>, inputItems: any[]) {
  return {
    getInputData() { return inputItems; },
    getNodeParameter(name, index, defaultValue) { /* ... */ },
    getNode() { return {}; },
  };
}

describe('Centroid node execute()', () => {
  it('reads vectors from parameter when Vector Source = parameter', async () => {
    const node = new Centroid();
    const params = { vectorSource: 'parameter', vectors: '[[0,0],[2,2]]', mergeOutput: false };
    const mock = createMockExecuteFunctions(params, []);

    const result = await node.execute.call(mock);
    expect(result[0][0].json).toEqual({ centroid: [1, 1] });
  });
});
```

### Testing Best Practices

1. **Test success paths**: Normal operation with valid input
2. **Test edge cases**: Empty arrays, single vectors, high dimensions
3. **Test error paths**: Invalid input, type mismatches, dimension mismatches
4. **Use descriptive test names**: Start with "should" or use action-oriented names
5. **Keep tests focused**: One assertion per test when possible
6. **Mock external dependencies**: Use `createMockExecuteFunctions` for node tests

### Running Tests

```bash
# Run once
pnpm test

# Watch mode (for development)
pnpm test:watch

# With coverage report
pnpm coverage
```

Coverage reports are generated in:
- Text format (console output)
- HTML format (`coverage/` directory)

---

## Code Quality Standards

### TypeScript Configuration

**File**: `tsconfig.json`

Key settings:
- `strict: true` - Enables all strict type checking
- `noImplicitAny: true` - Requires explicit types
- `noImplicitReturns: true` - All code paths must return
- `noUnusedLocals: true` - No unused variables
- `strictNullChecks: true` - Explicit null/undefined handling
- `target: "es2019"` - ECMAScript target
- `module: "commonjs"` - CommonJS modules for n8n compatibility

### ESLint Configuration

**File**: `.eslintrc.js`

Uses two main rule sets:
1. **For package.json**: `plugin:n8n-nodes-base/community`
2. **For node files**: `plugin:n8n-nodes-base/nodes`

Custom overrides:
```javascript
rules: {
  'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
  'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
  'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
}
```

**Pre-publish linting** (`.eslintrc.prepublish.js`): Stricter rules for release validation.

### Prettier Configuration

**File**: `.prettierrc.js`

Formatting standards:
- Single quotes
- Tab width: 2 spaces
- Print width: 100 characters
- Trailing commas: ES5
- Semicolons: always

### Code Style Guidelines

1. **Naming Conventions**:
   - `camelCase` for variables and functions
   - `PascalCase` for classes and types
   - `UPPER_SNAKE_CASE` for constants
   - Descriptive names over short abbreviations

2. **Function Design**:
   - Keep functions small and focused
   - Single responsibility principle
   - Prefer pure functions when possible
   - Use explicit return types

3. **Error Handling**:
   - Always use `NodeOperationError` for node errors
   - Include context: `{ itemIndex }` for batch operations
   - Write descriptive error messages in clear English
   - Avoid generic error messages

4. **Comments**:
   - Use comments for "why", not "what"
   - Document complex algorithms
   - Avoid obvious comments
   - Keep comments up to date

5. **TypeScript**:
   - Use `unknown` instead of `any` when type is truly unknown
   - Leverage type guards (`isFiniteNumber` pattern)
   - Avoid type assertions unless necessary
   - Use interfaces for object shapes

---

## Release Process

### Version Management

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Update CHANGELOG.md**:
   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### Added
   - New feature descriptions

   ### Changed
   - Modified behavior descriptions

   ### Fixed
   - Bug fix descriptions

   ### Removed
   - Removed feature descriptions
   ```

2. **Update package.json version**:
   ```bash
   # Manually edit package.json or use:
   pnpm version major|minor|patch
   ```

3. **Run pre-publish checks**:
   ```bash
   pnpm prepublishOnly
   # This runs: build, lint (strict), and test
   ```

4. **Commit and tag**:
   ```bash
   git add CHANGELOG.md package.json pnpm-lock.yaml
   git commit -m "chore: release vX.Y.Z"
   git tag vX.Y.Z
   git push origin main --tags
   ```

5. **Publish to npm**:
   ```bash
   pnpm publish --access public
   ```

6. **Create GitHub release**:
   - Go to GitHub Releases
   - Create release from tag
   - Copy CHANGELOG.md entry to release notes

### Pre-publish Validation

The `prepublishOnly` script ensures:
- TypeScript compilation succeeds
- All icons are copied to dist/
- ESLint passes with strict rules
- All tests pass
- Coverage thresholds met

**Never skip the prepublishOnly script.**

---

## Common Tasks

### Task 1: Adding a New Node Parameter

1. **Define the parameter** in `Centroid.node.ts`:
```typescript
{
  displayName: 'My Parameter',
  name: 'myParameter',
  type: 'string', // or 'number', 'boolean', 'options', etc.
  default: 'default value',
  description: 'Clear description of what this parameter does',
  displayOptions: { // Optional: conditional display
    show: {
      someOtherParam: ['specificValue'],
    },
  },
}
```

2. **Read the parameter** in the `execute()` method:
```typescript
const myParameter = this.getNodeParameter('myParameter', itemIndex, 'default') as string;
```

3. **Use the parameter** in your logic

4. **Write tests** covering the new parameter

5. **Update README.md** with usage instructions

### Task 2: Adding a New Utility Function

1. **Add function to `utils.ts`**:
```typescript
export function myUtilityFunction(input: SomeType): ReturnType {
  // Implementation
  if (/* validation fails */) {
    throw new Error('Descriptive error message');
  }
  return result;
}
```

2. **Import in `Centroid.node.ts`**:
```typescript
import { calculateCentroid, normalizeVectorsInput, myUtilityFunction } from './utils';
```

3. **Write unit tests** in `tests/calculateCentroid.test.ts` or new test file

4. **Use the function** in node execution logic

### Task 3: Handling a New Error Scenario

1. **Identify the error condition** in your code

2. **Throw descriptive error** from utility function:
```typescript
if (/* error condition */) {
  throw new Error('User-friendly explanation of what went wrong');
}
```

3. **Wrap in NodeOperationError** in node execute:
```typescript
try {
  // ... operation ...
} catch (error) {
  if (error instanceof Error) {
    throw new NodeOperationError(this.getNode(), error.message, { itemIndex });
  }
  throw error;
}
```

4. **Write test** to verify the error is thrown:
```typescript
it('should throw error when ...', async () => {
  await expect(someFunction()).rejects.toThrow('Expected error message');
});
```

### Task 4: Updating Documentation

When changing behavior:

1. **README.md**: Update usage instructions, examples, and feature descriptions
2. **CHANGELOG.md**: Add entry under `[Unreleased]` or version section
3. **REQUIREMENTS.md**: Update if new requirements or standards introduced
4. **Code comments**: Update JSDoc or inline comments if implementation details changed

### Task 5: Debugging Test Failures

1. **Run tests with verbose output**:
```bash
pnpm test -- --reporter=verbose
```

2. **Run specific test file**:
```bash
pnpm test tests/Centroid.node.test.ts
```

3. **Run single test**:
```bash
pnpm test -t "test name pattern"
```

4. **Check coverage** to identify untested code:
```bash
pnpm coverage
# Open coverage/index.html in browser
```

---

## Important Conventions

### File Organization

- **Node implementations**: Always in `nodes/{NodeName}/{NodeName}.node.ts`
- **Utilities**: Co-located with node in `nodes/{NodeName}/utils.ts`
- **Tests**: Mirror source structure in `tests/` directory
- **Icons**: Place `.png` or `.svg` in same directory as node (copied by Gulp)

### Error Messages

**Good error messages**:
```typescript
'No vector data was provided via the parameter or the input item.'
'Vector component at index [2][3] must be a finite number.'
'All vectors must share the same dimension.'
```

**Bad error messages**:
```typescript
'Invalid input'
'Error'
'Something went wrong'
```

Guidelines:
- Be specific about what's wrong
- Include relevant context (indices, values)
- Suggest what the user should do
- Use clear English without jargon

### Git Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test additions/changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

Examples:
```
feat(Centroid): add support for weighted centroid calculation

Adds new 'weights' parameter that allows users to specify
importance weights for each vector in the centroid calculation.

Closes #42
```

```
fix: handle empty string in vector path parameter

Previously threw generic error. Now provides clear message
when vectorPath is empty or whitespace-only.
```

### TypeScript Type Guards

Use type guards for runtime type checking:

```typescript
// Good
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

if (isFiniteNumber(value)) {
  // TypeScript knows value is number here
}

// Avoid
if (typeof value === 'number' && Number.isFinite(value)) {
  // Repeated checks throughout code
}
```

### n8n Node Conventions

1. **Preserve binary data**:
```typescript
if (inputItem?.binary) {
  newItem.binary = inputItem.binary;
}
```

2. **Set pairedItem** for item lineage:
```typescript
if (inputItem) {
  newItem.pairedItem = { item: itemIndex };
}
```

3. **Process all items** even if some fail (when appropriate)

4. **Return format**: Always `Promise<INodeExecutionData[][]>` (array of output arrays)

---

## Troubleshooting

### Issue: pnpm install fails

**Symptoms**: Error about wrong package manager

**Solution**:
- Ensure pnpm is installed: `npm install -g pnpm`
- Use correct version: `pnpm@9.1.4`
- Delete `node_modules` and try again

### Issue: TypeScript compilation errors

**Symptoms**: `tsc` errors during build

**Solution**:
1. Check `tsconfig.json` matches project requirements
2. Ensure all imports use correct types from `n8n-workflow`
3. Verify no `any` types without explicit annotation
4. Run `pnpm install` to ensure types are installed

### Issue: Tests fail with module resolution errors

**Symptoms**: Cannot find module errors in tests

**Solution**:
1. Check imports use correct relative paths
2. Ensure `vitest.config.ts` doesn't exclude test files
3. Verify `tsconfig.json` includes test directory
4. Try clearing Vitest cache: `rm -rf node_modules/.vitest`

### Issue: ESLint errors on valid code

**Symptoms**: ESLint complains about code that seems correct

**Solution**:
1. Check if using correct config: `.eslintrc.js` for dev, `.eslintrc.prepublish.js` for release
2. Review disabled rules in config
3. Some rules may be too strict - consider disabling specific rules with justification
4. Run `pnpm lintfix` to auto-fix formatting issues

### Issue: Node doesn't appear in n8n

**Symptoms**: After installation, node not in palette

**Solution**:
1. Restart n8n completely
2. Check `package.json` has correct `n8n.nodes` entry
3. Verify build succeeded: check `dist/nodes/Centroid/Centroid.node.js` exists
4. Check n8n version compatibility: needs >= 1.40.0
5. Review n8n logs for loading errors

### Issue: Coverage threshold not met

**Symptoms**: Tests pass but coverage report fails

**Solution**:
1. Run `pnpm coverage` to see coverage report
2. Open `coverage/index.html` to identify uncovered lines
3. Add tests for uncovered code paths
4. Ensure error paths are tested (use `.rejects.toThrow()`)
5. Test edge cases and boundary conditions

### Issue: Icons not appearing in n8n

**Symptoms**: Node works but shows generic icon

**Solution**:
1. Add `.png` or `.svg` icon to `nodes/Centroid/` directory
2. Ensure icon naming matches node filename (case-sensitive)
3. Run `pnpm build` to copy icons with Gulp
4. Check `dist/nodes/Centroid/` contains the icon file
5. Restart n8n to pick up new icons

---

## Additional Resources

### Official Documentation
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n API Reference](https://docs.n8n.io/integrations/creating-nodes/code/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vitest Documentation](https://vitest.dev/)

### Project Files
- `README.md` - User-facing documentation and usage examples
- `REQUIREMENTS.md` - Development requirements and quality checklist
- `CONTRIBUTING.md` - Contribution guidelines
- `CHANGELOG.md` - Version history and changes
- `SECURITY.md` - Security disclosure policy

### Package Metadata
- **Author**: Mauricio Perera <support@centoide.dev>
- **Homepage**: https://github.com/MauricioPerera/n8n-nodes-rckflr-centroid
- **Issues**: https://github.com/MauricioPerera/n8n-nodes-rckflr-centroid/issues
- **License**: MIT

---

## Key Takeaways for AI Assistants

1. **Always run tests and linting** before and after changes
2. **Maintain 80% test coverage** for all new code
3. **Use TypeScript strict mode** - no implicit any, proper null checks
4. **Follow n8n conventions** - NodeOperationError, pairedItem, binary data preservation
5. **Write descriptive errors** that help users understand and fix issues
6. **Update documentation** alongside code changes
7. **Use pnpm** exclusively - enforced by preinstall hook
8. **Test both success and error paths** - edge cases matter
9. **Keep functions small and focused** - single responsibility
10. **Commit with clear messages** - follow conventional commits format

When in doubt, refer to existing code patterns in `nodes/Centroid/Centroid.node.ts` and `nodes/Centroid/utils.ts` as canonical examples of project style and structure.

---

*This document should be updated as the project evolves. Last updated: 2025-11-17*
