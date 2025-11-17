import type { DistanceMatrixResult, DistanceMetric } from '../types';
import { calculateDistance } from '../utils/distance';

/**
 * Calculate pairwise distance matrix for a set of vectors
 */
export function calculateDistanceMatrix(
	vectors: number[][],
	metric: DistanceMetric = 'euclidean',
): DistanceMatrixResult {
	if (vectors.length === 0) {
		throw new Error('Cannot calculate distance matrix for an empty vector list.');
	}

	const n = vectors.length;
	const distanceMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

	// Calculate pairwise distances
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			const distance = calculateDistance(vectors[i], vectors[j], metric);
			distanceMatrix[i][j] = distance;
			distanceMatrix[j][i] = distance; // Symmetric matrix
		}
	}

	return {
		distanceMatrix,
		metric,
	};
}
