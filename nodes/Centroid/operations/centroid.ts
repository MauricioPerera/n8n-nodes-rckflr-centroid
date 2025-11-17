import { calculateCentroid } from '../utils/math';

/**
 * Calculate the centroid (mean) of a set of vectors
 */
export function calculateVectorCentroid(vectors: number[][]): { centroid: number[] } {
	const centroid = calculateCentroid(vectors);

	return {
		centroid,
	};
}
