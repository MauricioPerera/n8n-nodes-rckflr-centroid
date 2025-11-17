import { describe, it, expect } from 'vitest';
import { calculateSimilarityMatrix } from '../../nodes/Centroid/operations/similarity';

describe('Similarity Matrix', () => {
	it('should calculate cosine similarity matrix correctly', () => {
		const vectors = [
			[1, 0],
			[1, 0],
			[0, 1],
		];

		const result = calculateSimilarityMatrix(vectors, 'cosine');

		expect(result.similarities).toHaveLength(3);
		expect(result.metric).toBe('cosine');

		// Diagonal should be 1 (self-similarity)
		expect(result.similarities[0][0]).toBe(1);
		expect(result.similarities[1][1]).toBe(1);
		expect(result.similarities[2][2]).toBe(1);

		// Same vectors should have similarity 1
		expect(result.similarities[0][1]).toBeCloseTo(1, 10);
		expect(result.similarities[1][0]).toBeCloseTo(1, 10);

		// Orthogonal vectors should have similarity 0
		expect(result.similarities[0][2]).toBeCloseTo(0, 10);
		expect(result.similarities[2][0]).toBeCloseTo(0, 10);
	});

	it('should calculate pearson correlation matrix correctly', () => {
		const vectors = [
			[1, 2, 3],
			[1, 2, 3],
			[3, 2, 1],
		];

		const result = calculateSimilarityMatrix(vectors, 'pearson');

		expect(result.metric).toBe('pearson');

		// Identical vectors should have correlation 1
		expect(result.similarities[0][1]).toBeCloseTo(1, 10);

		// Negatively correlated vectors should have correlation -1
		expect(result.similarities[0][2]).toBeCloseTo(-1, 10);
	});

	it('should calculate jaccard similarity matrix correctly', () => {
		const vectors = [
			[1, 1, 0, 0],
			[1, 1, 0, 0],
			[0, 0, 1, 1],
			[1, 0, 1, 0],
		];

		const result = calculateSimilarityMatrix(vectors, 'jaccard');

		expect(result.metric).toBe('jaccard');

		// Identical binary vectors should have Jaccard = 1
		expect(result.similarities[0][1]).toBe(1);

		// Completely different sets should have Jaccard = 0
		expect(result.similarities[0][2]).toBe(0);

		// Partial overlap: [1,1,0,0] and [1,0,1,0]
		// Intersection = 1, Union = 3, Jaccard = 1/3
		expect(result.similarities[0][3]).toBeCloseTo(1 / 3, 5);
	});

	it('should produce symmetric matrix', () => {
		const vectors = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		];

		const result = calculateSimilarityMatrix(vectors, 'cosine');

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				expect(result.similarities[i][j]).toBeCloseTo(result.similarities[j][i], 10);
			}
		}
	});

	it('should throw error for empty vector list', () => {
		expect(() => calculateSimilarityMatrix([], 'cosine')).toThrow(
			'Cannot calculate similarity matrix for an empty vector list.',
		);
	});

	it('should handle negative values in cosine similarity', () => {
		const vectors = [
			[1, -1],
			[-1, 1],
		];

		const result = calculateSimilarityMatrix(vectors, 'cosine');

		// These vectors are opposite, so cosine similarity should be -1
		expect(result.similarities[0][1]).toBeCloseTo(-1, 10);
	});
});
