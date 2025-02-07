import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

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
		inputs: ['main'], // Accepts input nodes
		outputs: ['main'],
		properties: [
			{
				displayName: 'Array of Vectors',
				name: 'vectors',
				type: 'json',
				default: '',
				description: 'Enter an array of vectors directly (e.g., [[1,2,3],[4,5,6],[7,8,9]])',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let vectors = this.getNodeParameter('vectors', 0);

		// If there is no data in the parameter, try to get it from the input
		if (!vectors) {
			const items = this.getInputData();
			if (items.length > 0) {
				if (Array.isArray(items[0].json)) {
					vectors = items[0].json;
				} else if (Array.isArray(items[0].json.vectors)) {
					vectors = items[0].json.vectors;
				}
			}
		}

		// Convert to JSON if it's a string
		if (typeof vectors === 'string') {
			try {
				vectors = JSON.parse(vectors);
			} catch (error) {
				throw new NodeOperationError(this.getNode(), 'The format of the vector array is not valid.');
			}
		}

		// Check if the input is directly an array of vectors
		if (!Array.isArray(vectors) || vectors.length === 0) {
			throw new NodeOperationError(this.getNode(), 'You must provide a valid array of vectors.');
		}

		// Check that the first element is an array (vector)
		if (!Array.isArray(vectors[0])) {
			throw new NodeOperationError(this.getNode(), 'Each element of the array must be a vector (another array).');
		}

		const dimension = vectors[0].length;

		// Check that all vectors have the same dimension
		for (const vector of vectors) {
			if (!Array.isArray(vector) || vector.length !== dimension) {
				throw new NodeOperationError(
					this.getNode(),
					'All vectors must have the same dimension.'
				);
			}
		}

		// Calculate the sum of each component
		const sum = new Array(dimension).fill(0);
		for (const vector of vectors) {
			for (let j = 0; j < dimension; j++) {
				sum[j] += vector[j];
			}
		}

		// Calculate the centroid by dividing by the number of vectors
		const centroid = sum.map((value) => value / vectors.length);

		return [[{ json: { centroid } }]];
	}
}
