import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { calculateCentroid, normalizeVectorsInput } from './utils';

export class Centroid implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Centroid',
		name: 'centroid',
		group: ['transform'],
		version: 1,
		description: 'Calculates the centroid of an array of vectors',
		defaults: {
			name: 'Centroid',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Array of Vectors',
				name: 'vectors',
				type: 'json',
				default: '',
				description: 'Enter an array of vectors directly (e.g., [[1,2,3],[4,5,6],[7,8,9]])',
			},
			{
				displayName: 'Merge Output With Input',
				name: 'mergeOutput',
				type: 'boolean',
				default: true,
				description:
					'Whether to merge the centroid result with the original item JSON (if input data is present)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const inputItems = this.getInputData();
		const itemCount = inputItems.length > 0 ? inputItems.length : 1;

		const returnItems: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
			const rawVectors = this.getNodeParameter('vectors', itemIndex, '') as unknown;
			const mergeOutput = this.getNodeParameter('mergeOutput', itemIndex, true) as boolean;

			let vectorsSource = rawVectors;
			const inputItem = inputItems[itemIndex];

			const shouldUseItemVectors =
				(vectorsSource === undefined ||
					vectorsSource === null ||
					(typeof vectorsSource === 'string' && vectorsSource.trim() === '') ||
					(Array.isArray(vectorsSource) && (vectorsSource as unknown[]).length === 0)) &&
				inputItem;

			if (shouldUseItemVectors && inputItem) {
				if (Array.isArray(inputItem.json)) {
					vectorsSource = inputItem.json;
				} else if (Array.isArray((inputItem.json as IDataObject).vectors)) {
					vectorsSource = (inputItem.json as IDataObject).vectors as unknown;
				}
			}

			if (
				vectorsSource === undefined ||
				vectorsSource === null ||
				(typeof vectorsSource === 'string' && vectorsSource.trim() === '')
			) {
				throw new NodeOperationError(
					this.getNode(),
					'No vector data was provided via the parameter or the input item.',
					{ itemIndex },
				);
			}

			try {
				const normalizedVectors = normalizeVectorsInput(vectorsSource);
				const centroid = calculateCentroid(normalizedVectors);

				const newItem: INodeExecutionData = {
					json: mergeOutput && inputItem ? { ...inputItem.json, centroid } : { centroid },
				};

				if (inputItem?.binary) {
					newItem.binary = inputItem.binary;
				}

				if (inputItem) {
					newItem.pairedItem = { item: itemIndex };
				}

				returnItems.push(newItem);
			} catch (error) {
				if (error instanceof Error) {
					throw new NodeOperationError(this.getNode(), error.message, {
						itemIndex,
						cause: error,
					});
				}

				throw error;
			}
		}

		return [returnItems];
	}
}
