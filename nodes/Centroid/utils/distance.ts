import type { DistanceMetric } from '../types';

/**
 * Calculate Euclidean distance between two vectors
 */
export function euclideanDistance(v1: number[], v2: number[]): number {
	if (v1.length !== v2.length) {
		throw new Error('Vectors must have the same dimension for distance calculation.');
	}

	let sum = 0;
	for (let i = 0; i < v1.length; i++) {
		const diff = v1[i] - v2[i];
		sum += diff * diff;
	}

	return Math.sqrt(sum);
}

/**
 * Calculate Manhattan (L1) distance between two vectors
 */
export function manhattanDistance(v1: number[], v2: number[]): number {
	if (v1.length !== v2.length) {
		throw new Error('Vectors must have the same dimension for distance calculation.');
	}

	let sum = 0;
	for (let i = 0; i < v1.length; i++) {
		sum += Math.abs(v1[i] - v2[i]);
	}

	return sum;
}

/**
 * Calculate Cosine distance between two vectors (1 - cosine similarity)
 */
export function cosineDistance(v1: number[], v2: number[]): number {
	if (v1.length !== v2.length) {
		throw new Error('Vectors must have the same dimension for distance calculation.');
	}

	let dotProduct = 0;
	let norm1 = 0;
	let norm2 = 0;

	for (let i = 0; i < v1.length; i++) {
		dotProduct += v1[i] * v2[i];
		norm1 += v1[i] * v1[i];
		norm2 += v2[i] * v2[i];
	}

	norm1 = Math.sqrt(norm1);
	norm2 = Math.sqrt(norm2);

	if (norm1 === 0 || norm2 === 0) {
		return 1; // Maximum distance for zero vectors
	}

	const similarity = dotProduct / (norm1 * norm2);

	return 1 - similarity;
}

/**
 * Calculate distance between two vectors using the specified metric
 */
export function calculateDistance(
	v1: number[],
	v2: number[],
	metric: DistanceMetric = 'euclidean',
): number {
	switch (metric) {
		case 'euclidean':
			return euclideanDistance(v1, v2);
		case 'manhattan':
			return manhattanDistance(v1, v2);
		case 'cosine':
			return cosineDistance(v1, v2);
		default:
			throw new Error(`Unknown distance metric: ${metric}`);
	}
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(v1: number[], v2: number[]): number {
	if (v1.length !== v2.length) {
		throw new Error('Vectors must have the same dimension for similarity calculation.');
	}

	let dotProduct = 0;
	let norm1 = 0;
	let norm2 = 0;

	for (let i = 0; i < v1.length; i++) {
		dotProduct += v1[i] * v2[i];
		norm1 += v1[i] * v1[i];
		norm2 += v2[i] * v2[i];
	}

	norm1 = Math.sqrt(norm1);
	norm2 = Math.sqrt(norm2);

	if (norm1 === 0 || norm2 === 0) {
		return 0;
	}

	return dotProduct / (norm1 * norm2);
}

/**
 * Calculate Pearson correlation coefficient between two vectors
 */
export function pearsonCorrelation(v1: number[], v2: number[]): number {
	if (v1.length !== v2.length) {
		throw new Error('Vectors must have the same dimension for correlation calculation.');
	}

	const n = v1.length;
	const mean1 = v1.reduce((a, b) => a + b, 0) / n;
	const mean2 = v2.reduce((a, b) => a + b, 0) / n;

	let numerator = 0;
	let sum1 = 0;
	let sum2 = 0;

	for (let i = 0; i < n; i++) {
		const diff1 = v1[i] - mean1;
		const diff2 = v2[i] - mean2;
		numerator += diff1 * diff2;
		sum1 += diff1 * diff1;
		sum2 += diff2 * diff2;
	}

	const denominator = Math.sqrt(sum1 * sum2);

	if (denominator === 0) {
		return 0;
	}

	return numerator / denominator;
}
