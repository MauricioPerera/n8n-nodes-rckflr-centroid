# n8n-nodes-rckflr-centroid

[![npm version](https://img.shields.io/npm/v/n8n-nodes-rckflr-centroid?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-rckflr-centroid)
[![CI](https://github.com/MauricioPerera/n8n-nodes-rckflr-centroid/actions/workflows/ci.yml/badge.svg)](https://github.com/MauricioPerera/n8n-nodes-rckflr-centroid/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE.md)
[![Coverage Status](https://img.shields.io/badge/coverage-80%25+-brightgreen?style=flat-square)](#quality)

n8n community node that calculates the centroid of a list of numeric vectors. It is built for data pipelines that require averaging coordinates, embeddings or any multidimensional numeric representation.

## Features

- Accepts vectors provided directly in the node or via incoming items.
- Validates dimensional consistency and numeric values before processing.
- Supports batch processing: each incoming item is evaluated independently.
- Optionally merges the calculated centroid with the original item payload.

## Requirements

- n8n `>= 1.40.0`
- Node.js `>= 20.0.0`
- pnpm `>= 9.1.0`

## Installation

```bash
pnpm add n8n-nodes-rckflr-centroid
```

After installing, restart your n8n instance and add **Centroid** from the node palette.

## Usage

1. Provide the vectors directly in the **Array of Vectors** parameter (e.g. `[[1,2,3],[4,5,6]]`) or pass them in the incoming item as `item.json.vectors`.
2. Enable or disable **Merge Output With Input** depending on whether you want to keep the original item data.
3. Execute the workflow. The node outputs a centroid array under the `centroid` key.

### Example Workflow

An example workflow is available at `examples/centroid-basic.json`. Import it into n8n to see the node in action.

```json
{
  "nodes": [
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "vectors",
              "value": "[[0,0],[10,10],[5,5]]"
            }
          ]
        },
        "options": {}
      },
      "name": "Set Vectors",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [280, 300]
    },
    {
      "parameters": {},
      "name": "Centroid",
      "type": "n8n-nodes-rckflr-centroid.centroid",
      "typeVersion": 1,
      "position": [540, 300]
    }
  ]
}
```

## Inputs & Outputs

| Aspect | Description |
| --- | --- |
| **Input** | Optional array of vectors. Provide via node parameter or `item.json.vectors`. |
| **Output** | Each item contains a centroid array. When merging is enabled, the centroid is added to the original item JSON. |
| **Errors** | The node throws clear messages for malformed JSON, non-numeric components, empty vectors or mismatched dimensions. |

## Error Handling

The node uses `NodeOperationError` for predictable failures. Errors include an item index (when available) to help you pinpoint problematic entries quickly.

## Development

```bash
pnpm install
pnpm lint        # ESLint rules for nodes and tests
pnpm test        # Vitest unit tests with 80% coverage target
pnpm build       # TypeScript build + icon copy to dist/
```

To run the node locally alongside n8n, follow the [official local development guide](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/).

## Quality

- Linting powered by ESLint (`eslint-n8n-nodes-base` ruleset).
- Formatting enforced through Prettier.
- Unit tests executed with Vitest with coverage thresholds at 80% for lines, functions, branches and statements.
- Continuous integration configured in `.github/workflows/ci.yml`.

## Release Process

1. Update `CHANGELOG.md` with pending changes.
2. Bump the version in `package.json` following [SemVer](https://semver.org/).
3. Tag the release (`git tag vX.Y.Z`) and push tags.
4. Publish to npm with `pnpm publish --access public`.

See `REQUIREMENTS.md` for the full list of project standards.

## License

Released under the [MIT License](LICENSE.md) (c) Mauricio Perera.
