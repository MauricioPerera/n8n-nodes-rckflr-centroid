import { describe, it, expect } from 'vitest';
import { calculateDistanceMatrix } from '../../nodes/Centroid/operations/distanceMatrix';

describe('Distance Matrix', () => {
	it('should calculate euclidean distance matrix correctly', () => {
		const vectors = [
			[0, 0],
			[3, 4],
			[6, 8],
		];

		const result = calculateDistanceMatrix(vectors, 'euclidean');

		expect(result.distanceMatrix).toHaveLength(3);
		expect(result.metric).toBe('euclidean');

		// Diagonal should be zero
		expect(result.distanceMatrix[0][0]).toBe(0);
		expect(result.distanceMatrix[1][1]).toBe(0);
		expect(result.distanceMatrix[2][2]).toBe(0);

		// Distance from [0,0] to [3,4] should be 5
		expect(result.distanceMatrix[0][1]).toBe(5);
		expect(result.distanceMatrix[1][0]).toBe(5); // Symmetric

		// Distance from [0,0] to [6,8] should be 10
		expect(result.distanceMatrix[0][2]).toBe(10);
		expect(result.distanceMatrix[2][0]).toBe(10); // Symmetric
	});

	it('should calculate manhattan distance matrix correctly', () => {
		const vectors = [
			[0, 0],
			[1, 1],
			[2, 2],
		];

		const result = calculateDistanceMatrix(vectors, 'manhattan');

		expect(result.metric).toBe('manhattan');

		// Manhattan distance from [0,0] to [1,1] is 2
		expect(result.distanceMatrix[0][1]).toBe(2);

		// Manhattan distance from [0,0] to [2,2] is 4
		expect(result.distanceMatrix[0][2]).toBe(4);

		// Manhattan distance from [1,1] to [2,2] is 2
		expect(result.distanceMatrix[1][2]).toBe(2);
	});

	it('should calculate cosine distance matrix correctly', () => {
		const vectors = [
			[1, 0],
			[1, 0],
			[0, 1],
		];

		const result = calculateDistanceMatrix(vectors, 'cosine');

		expect(result.metric).toBe('cosine');

		// Same vectors should have distance 0
		expect(result.distanceMatrix[0][1]).toBeCloseTo(0, 10);

		// Orthogonal vectors should have distance 1
		expect(result.distanceMatrix[0][2]).toBeCloseTo(1, 10);
	});

	it('should throw error for empty vector list', () => {
		expect(() => calculateDistanceMatrix([], 'euclidean')).toThrow(
			'Cannot calculate distance matrix for an empty vector list.',
		);
	});

	it('should produce symmetric matrix', () => {
		const vectors = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		];

		const result = calculateDistanceMatrix(vectors, 'euclidean');

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				expect(result.distanceMatrix[i][j]).toBe(result.distanceMatrix[j][i]);
			}
		}
	});
});
