# n8n-nodes-rckflr-centroid

[![npm version](https://img.shields.io/npm/v/n8n-nodes-rckflr-centroid?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-rckflr-centroid)
[![CI](https://github.com/MauricioPerera/n8n-nodes-rckflr-centroid/actions/workflows/ci.yml/badge.svg)](https://github.com/MauricioPerera/n8n-nodes-rckflr-centroid/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE.md)
[![Coverage Status](https://img.shields.io/badge/coverage-80%25+-brightgreen?style=flat-square)](#quality)

n8n community node for advanced vector operations including centroid calculation, K-means clustering, normalization, distance calculations, nearest neighbors, and similarity analysis. Perfect for data pipelines working with embeddings, coordinates, or multidimensional data.

## Features

- **Multiple Vector Operations**: Choose from 6 different operations for comprehensive vector analysis
- **Flexible Input Sources**: Read vectors from node parameters, incoming items, or custom paths
- **Robust Validation**: Dimensional consistency and numeric value validation before processing
- **Batch Processing**: Process multiple items independently in a single execution
- **Output Merging**: Optionally combine results with original item data

## Available Operations

### 1. Calculate Centroid
Computes the mean (centroid) of a set of vectors.

**Example Output:**
```json
{
  "centroid": [2.5, 3.5, 4.5]
}
```

### 2. K-Means Clustering
Clusters vectors using the K-means algorithm with k-means++ initialization.

**Parameters:**
- Number of Clusters (k): Number of clusters to create
- Max Iterations: Maximum iterations for convergence
- Tolerance: Convergence tolerance threshold

**Example Output:**
```json
{
  "clusters": [
    {
      "centroid": [1.0, 1.5],
      "vectors": [[0,1], [2,2]],
      "indices": [0, 1],
      "size": 2
    }
  ],
  "labels": [0, 0, 1, 1],
  "iterations": 15,
  "inertia": 2.45
}
```

### 3. Distance Matrix
Calculates pairwise distances between all vectors.

**Distance Metrics:**
- Euclidean: Standard straight-line distance
- Manhattan: Sum of absolute differences
- Cosine: Angular distance between vectors

**Example Output:**
```json
{
  "distanceMatrix": [
    [0, 5.0, 10.0],
    [5.0, 0, 5.0],
    [10.0, 5.0, 0]
  ],
  "metric": "euclidean"
}
```

### 4. Normalize Vectors
Normalizes vectors using various methods.

**Normalization Types:**
- **L1 (Manhattan)**: Scale by sum of absolute values
- **L2 (Euclidean)**: Scale to unit length
- **Min-Max Scaling**: Scale to [0, 1] range
- **Z-Score (Standardization)**: Standardize to mean=0, std=1

**Example Output:**
```json
{
  "normalizedVectors": [[0.6, 0.8], [0, 1]],
  "metadata": {
    "type": "l2",
    "originalNorms": [5.0, 5.0]
  }
}
```

### 5. K-Nearest Neighbors
Finds K nearest neighbors to a query vector.

**Parameters:**
- Query Vector: The reference vector to find neighbors for
- Number of Neighbors: How many neighbors to find
- Distance Metric: Metric for distance calculation

**Example Output:**
```json
{
  "neighbors": [
    { "vector": [1, 2], "distance": 1.41, "index": 0 },
    { "vector": [2, 3], "distance": 2.83, "index": 1 }
  ],
  "queryVector": [0, 0]
}
```

### 6. Similarity Matrix
Calculates pairwise similarity between all vectors.

**Similarity Metrics:**
- **Cosine**: Cosine similarity (1 = identical direction)
- **Pearson Correlation**: Linear correlation (-1 to 1)
- **Jaccard**: Jaccard index for binary vectors

**Example Output:**
```json
{
  "similarities": [
    [1.0, 0.95, 0.12],
    [0.95, 1.0, 0.08],
    [0.12, 0.08, 1.0]
  ],
  "metric": "cosine"
}
```

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

1. **Select Operation**: Choose from centroid, clustering, normalization, distance, KNN, or similarity
2. **Configure Vector Source**:
   - **Auto (Parameter or Item)**: Uses parameter if provided; otherwise reads from incoming item
   - **Parameter**: Read vectors from the **Array of Vectors** parameter
   - **Item JSON (Root Array)**: Read vectors from root of `item.json`
   - **Item JSON (Path)**: Read vectors from custom path (e.g., `data.embeddings`)
3. **Configure Operation-Specific Parameters**: Each operation has its own parameters
4. **Enable/Disable Merge Output**: Choose whether to keep original item data

### Example Workflows

#### Centroid Calculation
```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "centroid",
        "vectors": "[[0,0],[10,10],[5,5]]",
        "vectorSource": "parameter"
      },
      "name": "Centroid",
      "type": "n8n-nodes-rckflr-centroid.centroid"
    }
  ]
}
```

#### K-Means Clustering
```json
{
  "parameters": {
    "operation": "kmeans",
    "k": 3,
    "maxIterations": 100,
    "vectorSource": "itemPath",
    "vectorPath": "embeddings"
  }
}
```

#### Vector Normalization
```json
{
  "parameters": {
    "operation": "normalize",
    "normalizationType": "l2",
    "vectorSource": "auto"
  }
}
```

## Common Use Cases

### 🤖 Machine Learning & AI
- **Embeddings Analysis**: Cluster document/image embeddings
- **Feature Normalization**: Prepare vectors for ML models
- **Similarity Search**: Find similar items using cosine similarity

### 📍 Geospatial Analysis
- **Location Clustering**: Group GPS coordinates into regions
- **Centroid Finding**: Calculate geographic centers
- **Distance Calculations**: Compute distances between locations

### 📊 Data Science
- **Dimensionality Reduction Prep**: Normalize before PCA/t-SNE
- **Outlier Detection**: Use distance metrics to identify outliers
- **Pattern Recognition**: Cluster similar data points

### 🔍 Recommendation Systems
- **User Similarity**: Find similar users based on behavior vectors
- **Item Clustering**: Group similar products or content
- **Collaborative Filtering**: Use KNN for recommendations

## Inputs & Outputs

| Aspect | Description |
| --- | --- |
| **Input** | Array of vectors from parameter, `item.json` root, or custom path |
| **Output** | Operation-specific results. When merging is enabled, results are added to original item JSON |
| **Errors** | Clear error messages with item indices for malformed JSON, non-numeric components, empty vectors, or dimension mismatches |

## Error Handling

The node uses `NodeOperationError` for predictable failures:

- **Validation Errors**: Invalid JSON, non-numeric values, dimension mismatches
- **Operation Errors**: Invalid parameters (e.g., k > number of vectors)
- **Item Context**: Errors include item index for easy debugging

Example error:
```
Number of clusters (k=5) cannot exceed number of vectors (3). [Item 0]
```

## Architecture

```
nodes/Centroid/
├── Centroid.node.ts          # Main node with operation router
├── operations/               # Individual operations
│   ├── centroid.ts
│   ├── kmeans.ts
│   ├── distanceMatrix.ts
│   ├── normalize.ts
│   ├── knn.ts
│   └── similarity.ts
├── utils/                    # Shared utilities
│   ├── distance.ts          # Distance metrics
│   ├── math.ts              # Mathematical operations
│   └── validation.ts        # Input validation
└── types/                    # TypeScript types
    └── index.ts
```

## Development

```bash
pnpm install
pnpm lint        # ESLint rules for nodes and tests
pnpm test        # Vitest unit tests with 80% coverage target
pnpm build       # TypeScript build + icon copy to dist/
```

To run the node locally alongside n8n, follow the [official local development guide](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/).

## Quality

- **Linting**: ESLint with `eslint-n8n-nodes-base` ruleset
- **Formatting**: Prettier with project-specific rules
- **Testing**: Vitest with comprehensive test coverage (65+ tests)
  - Unit tests for all operations
  - Integration tests for node execution
  - Edge case and error handling tests
- **Coverage Thresholds**: 80% for lines, functions, branches, and statements
- **CI/CD**: Automated testing and validation via GitHub Actions

## Performance

- **Efficient Algorithms**: K-means++ initialization for faster clustering convergence
- **Optimized Math**: Direct array operations without external heavy dependencies
- **Zero Heavy Dependencies**: Only peer dependency is `n8n-workflow`
- **Batch Support**: Process multiple items in a single execution

## Release Process

1. Update `CHANGELOG.md` with pending changes
2. Bump the version in `package.json` following [SemVer](https://semver.org/)
3. Tag the release (`git tag vX.Y.Z`) and push tags
4. Publish to npm with `pnpm publish --access public`

See `REQUIREMENTS.md` for the full list of project standards.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Released under the [MIT License](LICENSE.md) © Mauricio Perera.
