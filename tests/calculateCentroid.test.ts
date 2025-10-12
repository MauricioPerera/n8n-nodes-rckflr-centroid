import { describe, expect, it } from 'vitest';

import { calculateCentroid, normalizeVectorsInput } from '../nodes/Centroid/utils';

describe('normalizeVectorsInput', () => {
	it('parses vectors from JSON string', () => {
		const vectors = normalizeVectorsInput('[[0, 0], [2, 2]]');

		expect(vectors).toEqual([
			[0, 0],
			[2, 2],
		]);
	});

	it('throws when vectors have different dimensions', () => {
		expect(() => normalizeVectorsInput([[1, 2], [3]])).toThrow(
			'All vectors must share the same dimension.',
		);
	});

	it('throws on non-numeric values', () => {
		expect(() => normalizeVectorsInput([[1, 'a']])).toThrow(
			'Vector component at index [0][1] must be a finite number.',
		);
	});
});

describe('calculateCentroid', () => {
	it('computes the centroid for 2D vectors', () => {
		const centroid = calculateCentroid([
			[0, 0],
			[2, 2],
			[4, 4],
		]);

		expect(centroid).toEqual([2, 2]);
	});

	it('handles negative coordinates', () => {
		const centroid = calculateCentroid([
			[-1, -2, 3],
			[3, 4, -3],
			[0, 2, 0],
		]);

		expect(centroid).toEqual([2 / 3, 4 / 3, 0]);
	});

	it('throws for empty vectors list', () => {
		expect(() => calculateCentroid([])).toThrow(
			'Cannot calculate the centroid of an empty vector list.',
		);
	});
});
