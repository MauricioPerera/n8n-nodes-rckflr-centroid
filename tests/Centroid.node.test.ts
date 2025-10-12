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

describe('Centroid node execute()', () => {
	it('reads vectors from parameter when Vector Source = parameter', async () => {
		const node = new Centroid();
		const params = {
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