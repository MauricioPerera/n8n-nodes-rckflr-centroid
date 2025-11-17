import type { NormalizationResult, NormalizationType } from '../types';
import {
	vectorNorm,
	normalizeVector,
	mean,
	standardDeviation,
	min,
	max,
	getColumn,
} from '../utils/math';

/**
 * Normalize vectors using L1 norm (Manhattan)
 */
function normalizeL1(vectors: number[][]): NormalizationResult {
	const originalNorms: number[] = [];
	const normalizedVectors: number[][] = [];

	for (const vector of vectors) {
		const norm = vectorNorm(vector, 1);
		originalNorms.push(norm);
		normalizedVectors.push(normalizeVector(vector, 1));
	}

	return {
		normalizedVectors,
		metadata: {
			type: 'l1',
			originalNorms,
		},
	};
}

/**
 * Normalize vectors using L2 norm (Euclidean)
 */
function normalizeL2(vectors: number[][]): NormalizationResult {
	const originalNorms: number[] = [];
	const normalizedVectors: number[][] = [];

	for (const vector of vectors) {
		const norm = vectorNorm(vector, 2);
		originalNorms.push(norm);
		normalizedVectors.push(normalizeVector(vector, 2));
	}

	return {
		normalizedVectors,
		metadata: {
			type: 'l2',
			originalNorms,
		},
	};
}

/**
 * Normalize vectors using Min-Max scaling (scale to [0, 1])
 */
function normalizeMinMax(vectors: number[][]): NormalizationResult {
	if (vectors.length === 0) {
		throw new Error('Cannot normalize an empty vector list.');
	}

	const dimension = vectors[0].length;
	const mins: number[] = [];
	const maxs: number[] = [];

	// Find min and max for each dimension
	for (let d = 0; d < dimension; d++) {
		const column = getColumn(vectors, d);
		mins.push(min(column));
		maxs.push(max(column));
	}

	// Normalize each vector
	const normalizedVectors = vectors.map((vector) => {
		return vector.map((value, d) => {
			const range = maxs[d] - mins[d];

			if (range === 0) {
				return 0; // All values in this dimension are the same
			}

			return (value - mins[d]) / range;
		});
	});

	return {
		normalizedVectors,
		metadata: {
			type: 'minmax',
			min: mins,
			max: maxs,
		},
	};
}

/**
 * Normalize vectors using Z-score (standardization)
 */
function normalizeZScore(vectors: number[][]): NormalizationResult {
	if (vectors.length === 0) {
		throw new Error('Cannot normalize an empty vector list.');
	}

	const dimension = vectors[0].length;
	const means: number[] = [];
	const stds: number[] = [];

	// Calculate mean and std for each dimension
	for (let d = 0; d < dimension; d++) {
		const column = getColumn(vectors, d);
		means.push(mean(column));
		stds.push(standardDeviation(column));
	}

	// Normalize each vector
	const normalizedVectors = vectors.map((vector) => {
		return vector.map((value, d) => {
			if (stds[d] === 0) {
				return 0; // All values in this dimension are the same
			}

			return (value - means[d]) / stds[d];
		});
	});

	return {
		normalizedVectors,
		metadata: {
			type: 'zscore',
			mean: means,
			std: stds,
		},
	};
}

/**
 * Normalize vectors using the specified normalization type
 */
export function normalizeVectors(
	vectors: number[][],
	normType: NormalizationType = 'l2',
): NormalizationResult {
	if (vectors.length === 0) {
		throw new Error('Cannot normalize an empty vector list.');
	}

	switch (normType) {
		case 'l1':
			return normalizeL1(vectors);
		case 'l2':
			return normalizeL2(vectors);
		case 'minmax':
			return normalizeMinMax(vectors);
		case 'zscore':
			return normalizeZScore(vectors);
		default:
			throw new Error(`Unknown normalization type: ${normType}`);
	}
}
