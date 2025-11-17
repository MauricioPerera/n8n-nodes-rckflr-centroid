import { describe, it, expect } from 'vitest';

import { Centroid } from '../nodes/Centroid/Centroid.node';

function createMockExecuteFunctions(params: Record<string, unknown>, inputItems: any[]) {
	return {
		getInputData() {
			return inputItems as any[];
		},
		getNodeParameter(name: string, _itemIndex: number, defaultValue?: unknown) {
			const value = params[name];
			return value === undefined ? defaultValue : value;
		},
		getNode() {
			return {} as any;
		},
	} as any;
}

describe('Centroid node execute() - Centroid Operation', () => {
	it('reads vectors from parameter when Vector Source = parameter', async () => {
		const node = new Centroid();
		const params = {
			operation: 'centroid',
			vectorSource: 'parameter',
			vectors: '[[0,0],[2,2]]',
			mergeOutput: false,
		};
		const mock = createMockExecuteFunctions(params, []);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toEqual({ centroid: [1, 1] });
	});

	it('reads vectors from item root when Vector Source = itemRoot', async () => {
		const node = new Centroid();
		const params = {
			operation: 'centroid',
			vectorSource: 'itemRoot',
			mergeOutput: false,
		};
		const items = [{ json: [[1, 2], [3, 4]] }];
		const mock = createMockExecuteFunctions(params, items);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toEqual({ centroid: [2, 3] });
	});

	it('reads vectors from item path when Vector Source = itemPath', async () => {
		const node = new Centroid();
		const params = {
			operation: 'centroid',
			vectorSource: 'itemPath',
			vectorPath: 'data.vectors',
			mergeOutput: false,
		};
		const items = [{ json: { data: { vectors: [[-1, 1], [1, -1]] } } }];
		const mock = createMockExecuteFunctions(params, items);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toEqual({ centroid: [0, 0] });
	});

	it('auto mode falls back to item.json.vectors when parameter is empty', async () => {
		const node = new Centroid();
		const params = {
			operation: 'centroid',
			vectorSource: 'auto',
			vectors: '',
			mergeOutput: false,
		};
		const items = [{ json: { vectors: [[0, 0], [4, 4]] } }];
		const mock = createMockExecuteFunctions(params, items);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toEqual({ centroid: [2, 2] });
	});

	it('merges output with original item when mergeOutput = true', async () => {
		const node = new Centroid();
		const params = {
			operation: 'centroid',
			vectorSource: 'parameter',
			vectors: '[[1,1],[3,3]]',
			mergeOutput: true,
		};
		const items = [{ json: { foo: 'bar' } }];
		const mock = createMockExecuteFunctions(params, items);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toEqual({ foo: 'bar', centroid: [2, 2] });
	});

	it('throws a clear error when no vector data is provided', async () => {
		const node = new Centroid();
		const params = {
			operation: 'centroid',
			vectorSource: 'parameter',
			vectors: '',
			mergeOutput: false,
		};
		const mock = createMockExecuteFunctions(params, []);

		await expect(node.execute.call(mock)).rejects.toThrow(
			'No vector data was provided via the parameter or the input item.',
		);
	});
});

describe('Centroid node execute() - K-Means Operation', () => {
	it('performs K-Means clustering', async () => {
		const node = new Centroid();
		const params = {
			operation: 'kmeans',
			vectorSource: 'parameter',
			vectors: '[[0,0],[1,1],[10,10],[11,11]]',
			mergeOutput: false,
			k: 2,
			maxIterations: 100,
			tolerance: 0.0001,
		};
		const mock = createMockExecuteFunctions(params, []);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toHaveProperty('clusters');
		expect(result[0][0].json).toHaveProperty('labels');
		expect(result[0][0].json.clusters).toHaveLength(2);
	});
});

describe('Centroid node execute() - Normalize Operation', () => {
	it('normalizes vectors with L2', async () => {
		const node = new Centroid();
		const params = {
			operation: 'normalize',
			vectorSource: 'parameter',
			vectors: '[[3,4]]',
			mergeOutput: false,
			normalizationType: 'l2',
		};
		const mock = createMockExecuteFunctions(params, []);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toHaveProperty('normalizedVectors');
		expect(result[0][0].json).toHaveProperty('metadata');
		expect(result[0][0].json.metadata.type).toBe('l2');
	});
});

describe('Centroid node execute() - Distance Matrix Operation', () => {
	it('calculates distance matrix', async () => {
		const node = new Centroid();
		const params = {
			operation: 'distanceMatrix',
			vectorSource: 'parameter',
			vectors: '[[0,0],[3,4],[6,8]]',
			mergeOutput: false,
			distanceMetric: 'euclidean',
		};
		const mock = createMockExecuteFunctions(params, []);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toHaveProperty('distanceMatrix');
		expect(result[0][0].json).toHaveProperty('metric');
		expect(result[0][0].json.metric).toBe('euclidean');
	});
});

describe('Centroid node execute() - KNN Operation', () => {
	it('finds K nearest neighbors', async () => {
		const node = new Centroid();
		const params = {
			operation: 'knn',
			vectorSource: 'parameter',
			vectors: '[[0,0],[1,1],[10,10]]',
			mergeOutput: false,
			queryVector: '[0,0]',
			neighborsCount: 2,
			distanceMetric: 'euclidean',
		};
		const mock = createMockExecuteFunctions(params, []);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toHaveProperty('neighbors');
		expect(result[0][0].json).toHaveProperty('queryVector');
		expect(result[0][0].json.neighbors).toHaveLength(2);
	});
});

describe('Centroid node execute() - Similarity Operation', () => {
	it('calculates similarity matrix', async () => {
		const node = new Centroid();
		const params = {
			operation: 'similarity',
			vectorSource: 'parameter',
			vectors: '[[1,0],[1,0],[0,1]]',
			mergeOutput: false,
			similarityMetric: 'cosine',
		};
		const mock = createMockExecuteFunctions(params, []);

		const result = await node.execute.call(mock);
		expect(result[0][0].json).toHaveProperty('similarities');
		expect(result[0][0].json).toHaveProperty('metric');
		expect(result[0][0].json.metric).toBe('cosine');
	});
});
