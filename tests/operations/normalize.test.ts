import { describe, it, expect } from 'vitest';
import { normalizeVectors } from '../../nodes/Centroid/operations/normalize';

describe('Normalize Vectors', () => {
	it('should normalize with L2 norm', () => {
		const vectors = [
			[3, 4],
			[0, 5],
		];

		const result = normalizeVectors(vectors, 'l2');

		expect(result.metadata.type).toBe('l2');
		expect(result.metadata.originalNorms).toHaveLength(2);

		// [3,4] has norm 5, so normalized is [0.6, 0.8]
		expect(result.normalizedVectors[0][0]).toBeCloseTo(0.6, 5);
		expect(result.normalizedVectors[0][1]).toBeCloseTo(0.8, 5);

		// [0,5] has norm 5, so normalized is [0, 1]
		expect(result.normalizedVectors[1][0]).toBeCloseTo(0, 5);
		expect(result.normalizedVectors[1][1]).toBeCloseTo(1, 5);
	});

	it('should normalize with L1 norm', () => {
		const vectors = [[3, 4]];

		const result = normalizeVectors(vectors, 'l1');

		expect(result.metadata.type).toBe('l1');

		// [3,4] has L1 norm 7, so normalized is [3/7, 4/7]
		expect(result.normalizedVectors[0][0]).toBeCloseTo(3 / 7, 5);
		expect(result.normalizedVectors[0][1]).toBeCloseTo(4 / 7, 5);
	});

	it('should normalize with min-max scaling', () => {
		const vectors = [
			[0, 10],
			[5, 20],
			[10, 30],
		];

		const result = normalizeVectors(vectors, 'minmax');

		expect(result.metadata.type).toBe('minmax');
		expect(result.metadata.min).toEqual([0, 10]);
		expect(result.metadata.max).toEqual([10, 30]);

		// First dimension scaled from [0,10] to [0,1]
		expect(result.normalizedVectors[0][0]).toBe(0);
		expect(result.normalizedVectors[1][0]).toBe(0.5);
		expect(result.normalizedVectors[2][0]).toBe(1);

		// Second dimension scaled from [10,30] to [0,1]
		expect(result.normalizedVectors[0][1]).toBe(0);
		expect(result.normalizedVectors[1][1]).toBe(0.5);
		expect(result.normalizedVectors[2][1]).toBe(1);
	});

	it('should normalize with z-score', () => {
		const vectors = [
			[1, 2],
			[2, 4],
			[3, 6],
		];

		const result = normalizeVectors(vectors, 'zscore');

		expect(result.metadata.type).toBe('zscore');
		expect(result.metadata.mean).toHaveLength(2);
		expect(result.metadata.std).toHaveLength(2);

		// Mean should be [2, 4]
		expect(result.metadata.mean![0]).toBeCloseTo(2, 5);
		expect(result.metadata.mean![1]).toBeCloseTo(4, 5);

		// After z-score normalization, mean should be ~0
		const normalizedMean0 =
			result.normalizedVectors.reduce((sum, v) => sum + v[0], 0) / vectors.length;
		const normalizedMean1 =
			result.normalizedVectors.reduce((sum, v) => sum + v[1], 0) / vectors.length;

		expect(normalizedMean0).toBeCloseTo(0, 10);
		expect(normalizedMean1).toBeCloseTo(0, 10);
	});

	it('should handle zero vectors in L2 normalization', () => {
		const vectors = [[0, 0]];

		const result = normalizeVectors(vectors, 'l2');

		// Zero vector should remain zero
		expect(result.normalizedVectors[0]).toEqual([0, 0]);
	});

	it('should handle constant dimension in min-max scaling', () => {
		const vectors = [
			[5, 1],
			[5, 2],
			[5, 3],
		];

		const result = normalizeVectors(vectors, 'minmax');

		// First dimension is constant (all 5s), should become 0
		expect(result.normalizedVectors[0][0]).toBe(0);
		expect(result.normalizedVectors[1][0]).toBe(0);
		expect(result.normalizedVectors[2][0]).toBe(0);

		// Second dimension should be normalized normally
		expect(result.normalizedVectors[0][1]).toBe(0);
		expect(result.normalizedVectors[1][1]).toBe(0.5);
		expect(result.normalizedVectors[2][1]).toBe(1);
	});

	it('should throw error for empty vector list', () => {
		expect(() => normalizeVectors([], 'l2')).toThrow('Cannot normalize an empty vector list.');
	});
});
