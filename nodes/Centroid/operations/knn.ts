import type { KNNResult, DistanceMetric } from '../types';
import { calculateDistance } from '../utils/distance';

/**
 * Find K nearest neighbors for a query vector
 */
export function findKNearestNeighbors(
	vectors: number[][],
	queryVector: number[],
	k: number,
	metric: DistanceMetric = 'euclidean',
): KNNResult {
	if (vectors.length === 0) {
		throw new Error('Cannot find neighbors in an empty vector list.');
	}

	if (k <= 0) {
		throw new Error('Number of neighbors (k) must be positive.');
	}

	if (k > vectors.length) {
		throw new Error(
			`Number of neighbors (k=${k}) cannot exceed number of vectors (${vectors.length}).`,
		);
	}

	// Validate query vector dimension
	const dimension = vectors[0].length;

	if (queryVector.length !== dimension) {
		throw new Error(
			`Query vector dimension (${queryVector.length}) must match vectors dimension (${dimension}).`,
		);
	}

	// Calculate distances to all vectors
	const distances: Array<{ vector: number[]; distance: number; index: number }> = vectors.map(
		(vector, index) => ({
			vector,
			distance: calculateDistance(queryVector, vector, metric),
			index,
		}),
	);

	// Sort by distance and take top k
	distances.sort((a, b) => a.distance - b.distance);
	const neighbors = distances.slice(0, k);

	return {
		neighbors,
		queryVector,
	};
}
