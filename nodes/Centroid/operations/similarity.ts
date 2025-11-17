import type { SimilarityResult, SimilarityMetric } from '../types';
import { cosineSimilarity, pearsonCorrelation } from '../utils/distance';

/**
 * Calculate Jaccard similarity between two binary vectors
 */
function jaccardSimilarity(v1: number[], v2: number[]): number {
	if (v1.length !== v2.length) {
		throw new Error('Vectors must have the same dimension for similarity calculation.');
	}

	let intersection = 0;
	let union = 0;

	for (let i = 0; i < v1.length; i++) {
		const a = v1[i] !== 0 ? 1 : 0;
		const b = v2[i] !== 0 ? 1 : 0;

		intersection += a * b;
		union += a + b - a * b;
	}

	if (union === 0) {
		return 0;
	}

	return intersection / union;
}

/**
 * Calculate pairwise similarity matrix for a set of vectors
 */
export function calculateSimilarityMatrix(
	vectors: number[][],
	metric: SimilarityMetric = 'cosine',
): SimilarityResult {
	if (vectors.length === 0) {
		throw new Error('Cannot calculate similarity matrix for an empty vector list.');
	}

	const n = vectors.length;
	const similarities: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

	// Calculate pairwise similarities
	for (let i = 0; i < n; i++) {
		similarities[i][i] = 1; // Self-similarity is always 1

		for (let j = i + 1; j < n; j++) {
			let similarity: number;

			switch (metric) {
				case 'cosine':
					similarity = cosineSimilarity(vectors[i], vectors[j]);
					break;
				case 'pearson':
					similarity = pearsonCorrelation(vectors[i], vectors[j]);
					break;
				case 'jaccard':
					similarity = jaccardSimilarity(vectors[i], vectors[j]);
					break;
				default:
					throw new Error(`Unknown similarity metric: ${metric}`);
			}

			similarities[i][j] = similarity;
			similarities[j][i] = similarity; // Symmetric matrix
		}
	}

	return {
		similarities,
		metric,
	};
}
