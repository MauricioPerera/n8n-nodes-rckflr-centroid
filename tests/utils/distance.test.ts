import { describe, it, expect } from 'vitest';
import {
	euclideanDistance,
	manhattanDistance,
	cosineDistance,
	cosineSimilarity,
	pearsonCorrelation,
} from '../../nodes/Centroid/utils/distance';

describe('Distance Utilities', () => {
	describe('euclideanDistance', () => {
		it('should calculate correct distance for 2D vectors', () => {
			const v1 = [0, 0];
			const v2 = [3, 4];

			expect(euclideanDistance(v1, v2)).toBe(5);
		});

		it('should return 0 for identical vectors', () => {
			const v1 = [1, 2, 3];
			const v2 = [1, 2, 3];

			expect(euclideanDistance(v1, v2)).toBe(0);
		});

		it('should throw error for different dimensions', () => {
			const v1 = [1, 2];
			const v2 = [1, 2, 3];

			expect(() => euclideanDistance(v1, v2)).toThrow(
				'Vectors must have the same dimension for distance calculation.',
			);
		});
	});

	describe('manhattanDistance', () => {
		it('should calculate correct distance for 2D vectors', () => {
			const v1 = [0, 0];
			const v2 = [3, 4];

			expect(manhattanDistance(v1, v2)).toBe(7);
		});

		it('should handle negative values', () => {
			const v1 = [-2, 3];
			const v2 = [1, -1];

			expect(manhattanDistance(v1, v2)).toBe(7); // |1-(-2)| + |-1-3| = 3 + 4 = 7
		});
	});

	describe('cosineDistance', () => {
		it('should return 0 for identical vectors', () => {
			const v1 = [1, 2, 3];
			const v2 = [1, 2, 3];

			expect(cosineDistance(v1, v2)).toBeCloseTo(0, 10);
		});

		it('should return 1 for orthogonal vectors', () => {
			const v1 = [1, 0];
			const v2 = [0, 1];

			expect(cosineDistance(v1, v2)).toBeCloseTo(1, 10);
		});

		it('should return 2 for opposite vectors', () => {
			const v1 = [1, 0];
			const v2 = [-1, 0];

			expect(cosineDistance(v1, v2)).toBeCloseTo(2, 10);
		});

		it('should handle zero vectors', () => {
			const v1 = [0, 0];
			const v2 = [1, 1];

			expect(cosineDistance(v1, v2)).toBe(1); // Max distance
		});
	});

	describe('cosineSimilarity', () => {
		it('should return 1 for identical vectors', () => {
			const v1 = [1, 2, 3];
			const v2 = [1, 2, 3];

			expect(cosineSimilarity(v1, v2)).toBeCloseTo(1, 10);
		});

		it('should return 0 for orthogonal vectors', () => {
			const v1 = [1, 0];
			const v2 = [0, 1];

			expect(cosineSimilarity(v1, v2)).toBeCloseTo(0, 10);
		});

		it('should return -1 for opposite vectors', () => {
			const v1 = [1, 0];
			const v2 = [-1, 0];

			expect(cosineSimilarity(v1, v2)).toBeCloseTo(-1, 10);
		});
	});

	describe('pearsonCorrelation', () => {
		it('should return 1 for perfectly correlated vectors', () => {
			const v1 = [1, 2, 3, 4, 5];
			const v2 = [2, 4, 6, 8, 10]; // v2 = 2*v1

			expect(pearsonCorrelation(v1, v2)).toBeCloseTo(1, 10);
		});

		it('should return -1 for perfectly negatively correlated vectors', () => {
			const v1 = [1, 2, 3, 4, 5];
			const v2 = [5, 4, 3, 2, 1];

			expect(pearsonCorrelation(v1, v2)).toBeCloseTo(-1, 10);
		});

		it('should return 0 for uncorrelated vectors', () => {
			const v1 = [1, 2, 1, 2, 1];
			const v2 = [2, 2, 2, 2, 2]; // Constant

			expect(pearsonCorrelation(v1, v2)).toBe(0);
		});
	});
});
