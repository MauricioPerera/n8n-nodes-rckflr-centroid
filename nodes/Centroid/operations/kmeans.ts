import type { KMeansResult } from '../types';
import { calculateDistance } from '../utils/distance';
import { calculateCentroid } from '../utils/math';

/**
 * Initialize centroids using k-means++ algorithm for better convergence
 */
function initializeCentroidsKMeansPlusPlus(vectors: number[][], k: number): number[][] {
	const centroids: number[][] = [];
	const n = vectors.length;

	// Choose first centroid randomly
	const firstIndex = Math.floor(Math.random() * n);
	centroids.push([...vectors[firstIndex]]);

	// Choose remaining centroids
	for (let i = 1; i < k; i++) {
		const distances: number[] = [];

		// Calculate distance from each point to nearest centroid
		for (const vector of vectors) {
			let minDistance = Infinity;

			for (const centroid of centroids) {
				const distance = calculateDistance(vector, centroid, 'euclidean');
				minDistance = Math.min(minDistance, distance);
			}

			distances.push(minDistance * minDistance); // Squared distance
		}

		// Choose next centroid with probability proportional to distance squared
		const totalDistance = distances.reduce((sum, d) => sum + d, 0);
		let random = Math.random() * totalDistance;
		let chosenIndex = 0;

		for (let j = 0; j < distances.length; j++) {
			random -= distances[j];
			if (random <= 0) {
				chosenIndex = j;
				break;
			}
		}

		centroids.push([...vectors[chosenIndex]]);
	}

	return centroids;
}

/**
 * Assign each vector to the nearest centroid
 */
function assignToClusters(vectors: number[][], centroids: number[][]): number[] {
	return vectors.map((vector) => {
		let minDistance = Infinity;
		let closestCluster = 0;

		for (let i = 0; i < centroids.length; i++) {
			const distance = calculateDistance(vector, centroids[i], 'euclidean');

			if (distance < minDistance) {
				minDistance = distance;
				closestCluster = i;
			}
		}

		return closestCluster;
	});
}

/**
 * Update centroids based on current cluster assignments
 */
function updateCentroids(vectors: number[][], labels: number[], k: number): number[][] {
	const newCentroids: number[][] = [];

	for (let i = 0; i < k; i++) {
		const clusterVectors = vectors.filter((_, index) => labels[index] === i);

		if (clusterVectors.length === 0) {
			// If cluster is empty, keep the old centroid or choose a random point
			const randomIndex = Math.floor(Math.random() * vectors.length);
			newCentroids.push([...vectors[randomIndex]]);
		} else {
			newCentroids.push(calculateCentroid(clusterVectors));
		}
	}

	return newCentroids;
}

/**
 * Calculate inertia (sum of squared distances to nearest centroid)
 */
function calculateInertia(vectors: number[][], labels: number[], centroids: number[][]): number {
	let inertia = 0;

	for (let i = 0; i < vectors.length; i++) {
		const distance = calculateDistance(vectors[i], centroids[labels[i]], 'euclidean');
		inertia += distance * distance;
	}

	return inertia;
}

/**
 * Build the final K-Means result object
 */
function buildKMeansResult(
	vectors: number[][],
	labels: number[],
	centroids: number[][],
	iterations: number,
	inertia: number,
): KMeansResult {
	const k = centroids.length;
	const clusters: KMeansResult['clusters'] = [];

	for (let i = 0; i < k; i++) {
		const indices: number[] = [];
		const clusterVectors: number[][] = [];

		for (let j = 0; j < labels.length; j++) {
			if (labels[j] === i) {
				indices.push(j);
				clusterVectors.push(vectors[j]);
			}
		}

		clusters.push({
			centroid: centroids[i],
			vectors: clusterVectors,
			indices,
			size: clusterVectors.length,
		});
	}

	return {
		clusters,
		labels,
		iterations,
		inertia,
	};
}

/**
 * Perform K-Means clustering on a set of vectors
 */
export function kMeansClustering(
	vectors: number[][],
	k: number,
	maxIterations: number = 100,
	tolerance: number = 1e-4,
): KMeansResult {
	// Validation
	if (vectors.length === 0) {
		throw new Error('Cannot perform k-means clustering on an empty vector list.');
	}

	if (k <= 0) {
		throw new Error('Number of clusters (k) must be positive.');
	}

	if (k > vectors.length) {
		throw new Error(
			`Number of clusters (k=${k}) cannot exceed number of vectors (${vectors.length}).`,
		);
	}

	// Initialize centroids using k-means++
	let centroids = initializeCentroidsKMeansPlusPlus(vectors, k);
	let labels = new Array(vectors.length).fill(0);
	let previousInertia = Infinity;
	let iterations = 0;

	// Main k-means loop
	for (let iter = 0; iter < maxIterations; iter++) {
		iterations++;

		// Assign vectors to nearest centroids
		labels = assignToClusters(vectors, centroids);

		// Update centroids
		const newCentroids = updateCentroids(vectors, labels, k);

		// Calculate inertia (convergence metric)
		const inertia = calculateInertia(vectors, labels, newCentroids);

		// Check for convergence
		if (Math.abs(previousInertia - inertia) < tolerance) {
			centroids = newCentroids;
			previousInertia = inertia;
			break;
		}

		centroids = newCentroids;
		previousInertia = inertia;
	}

	// Build and return result
	return buildKMeansResult(vectors, labels, centroids, iterations, previousInertia);
}
