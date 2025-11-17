import { describe, it, expect } from 'vitest';
import { kMeansClustering } from '../../nodes/Centroid/operations/kmeans';

describe('K-Means Clustering', () => {
	it('should cluster simple 2D points into 2 clusters', () => {
		const vectors = [
			[0, 0],
			[1, 1],
			[10, 10],
			[11, 11],
		];

		const result = kMeansClustering(vectors, 2);

		expect(result.clusters).toHaveLength(2);
		expect(result.labels).toHaveLength(4);

		// Verify that similar points are in the same cluster
		expect(result.labels[0]).toBe(result.labels[1]); // [0,0] and [1,1]
		expect(result.labels[2]).toBe(result.labels[3]); // [10,10] and [11,11]
		expect(result.labels[0]).not.toBe(result.labels[2]); // Different clusters
	});

	it('should handle 3 clusters correctly', () => {
		const vectors = [
			[0, 0],
			[1, 0],
			[10, 10],
			[11, 10],
			[50, 50],
			[51, 50],
		];

		const result = kMeansClustering(vectors, 3);

		expect(result.clusters).toHaveLength(3);
		expect(result.labels).toHaveLength(6);
		expect(result.iterations).toBeGreaterThan(0);
		expect(result.inertia).toBeGreaterThanOrEqual(0);

		// Each cluster should have at least one point
		result.clusters.forEach((cluster) => {
			expect(cluster.size).toBeGreaterThan(0);
			expect(cluster.vectors.length).toBe(cluster.size);
			expect(cluster.indices.length).toBe(cluster.size);
		});
	});

	it('should converge within max iterations', () => {
		const vectors = Array.from({ length: 20 }, (_, i) => [
			Math.floor(i / 5) * 10,
			(i % 5) * 2,
		]);

		const result = kMeansClustering(vectors, 4, 50);

		expect(result.iterations).toBeLessThanOrEqual(50);
	});

	it('should throw error when k > number of vectors', () => {
		const vectors = [
			[1, 2],
			[3, 4],
		];

		expect(() => kMeansClustering(vectors, 5)).toThrow(
			'Number of clusters (k=5) cannot exceed number of vectors (2).',
		);
	});

	it('should throw error when k <= 0', () => {
		const vectors = [
			[1, 2],
			[3, 4],
		];

		expect(() => kMeansClustering(vectors, 0)).toThrow('Number of clusters (k) must be positive.');
	});

	it('should throw error for empty vector list', () => {
		expect(() => kMeansClustering([], 2)).toThrow(
			'Cannot perform k-means clustering on an empty vector list.',
		);
	});

	it('should handle single cluster (k=1)', () => {
		const vectors = [
			[1, 2],
			[3, 4],
			[5, 6],
		];

		const result = kMeansClustering(vectors, 1);

		expect(result.clusters).toHaveLength(1);
		expect(result.clusters[0].size).toBe(3);
		expect(result.labels).toEqual([0, 0, 0]);
	});
});
