import { describe, it, expect } from 'vitest';
import { findKNearestNeighbors } from '../../nodes/Centroid/operations/knn';

describe('K-Nearest Neighbors', () => {
	it('should find 3 nearest neighbors correctly', () => {
		const vectors = [
			[0, 0],
			[1, 1],
			[2, 2],
			[10, 10],
			[11, 11],
		];

		const queryVector = [0, 0];

		const result = findKNearestNeighbors(vectors, queryVector, 3, 'euclidean');

		expect(result.neighbors).toHaveLength(3);
		expect(result.queryVector).toEqual([0, 0]);

		// Nearest should be [0,0], [1,1], [2,2]
		expect(result.neighbors[0].index).toBe(0);
		expect(result.neighbors[1].index).toBe(1);
		expect(result.neighbors[2].index).toBe(2);

		// Distances should be sorted
		expect(result.neighbors[0].distance).toBeLessThanOrEqual(result.neighbors[1].distance);
		expect(result.neighbors[1].distance).toBeLessThanOrEqual(result.neighbors[2].distance);
	});

	it('should work with different distance metrics', () => {
		const vectors = [
			[1, 0],
			[0, 1],
			[1, 1],
		];

		const queryVector = [1, 0];

		// Euclidean
		const euclideanResult = findKNearestNeighbors(vectors, queryVector, 2, 'euclidean');
		expect(euclideanResult.neighbors[0].index).toBe(0); // Exact match

		// Manhattan
		const manhattanResult = findKNearestNeighbors(vectors, queryVector, 2, 'manhattan');
		expect(manhattanResult.neighbors[0].index).toBe(0); // Exact match

		// Cosine
		const cosineResult = findKNearestNeighbors(vectors, queryVector, 2, 'cosine');
		expect(cosineResult.neighbors[0].index).toBe(0); // Exact match (cosine distance = 0)
	});

	it('should throw error when k > number of vectors', () => {
		const vectors = [
			[1, 2],
			[3, 4],
		];

		expect(() => findKNearestNeighbors(vectors, [0, 0], 5, 'euclidean')).toThrow(
			'Number of neighbors (k=5) cannot exceed number of vectors (2).',
		);
	});

	it('should throw error when k <= 0', () => {
		const vectors = [
			[1, 2],
			[3, 4],
		];

		expect(() => findKNearestNeighbors(vectors, [0, 0], 0, 'euclidean')).toThrow(
			'Number of neighbors (k) must be positive.',
		);
	});

	it('should throw error for empty vector list', () => {
		expect(() => findKNearestNeighbors([], [0, 0], 1, 'euclidean')).toThrow(
			'Cannot find neighbors in an empty vector list.',
		);
	});

	it('should throw error for mismatched dimensions', () => {
		const vectors = [
			[1, 2, 3],
			[4, 5, 6],
		];

		const queryVector = [1, 2]; // Only 2D

		expect(() => findKNearestNeighbors(vectors, queryVector, 1, 'euclidean')).toThrow(
			'Query vector dimension (2) must match vectors dimension (3).',
		);
	});

	it('should handle k = 1 correctly', () => {
		const vectors = [
			[5, 5],
			[1, 1],
			[10, 10],
		];

		const queryVector = [0, 0];

		const result = findKNearestNeighbors(vectors, queryVector, 1, 'euclidean');

		expect(result.neighbors).toHaveLength(1);
		expect(result.neighbors[0].index).toBe(1); // [1,1] is closest
	});

	it('should include correct vector data in results', () => {
		const vectors = [
			[1, 2],
			[3, 4],
			[5, 6],
		];

		const queryVector = [2, 3];

		const result = findKNearestNeighbors(vectors, queryVector, 2, 'euclidean');

		expect(result.neighbors[0].vector).toEqual([1, 2]);
		expect(result.neighbors[0].distance).toBeGreaterThan(0);
		expect(result.neighbors[0].index).toBeGreaterThanOrEqual(0);
	});
});
