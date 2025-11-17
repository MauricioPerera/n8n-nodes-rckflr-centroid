import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { normalizeVectorsInput, getValueByPath } from './utils/validation';
import { calculateVectorCentroid } from './operations/centroid';
import { kMeansClustering } from './operations/kmeans';
import { calculateDistanceMatrix } from './operations/distanceMatrix';
import { normalizeVectors } from './operations/normalize';
import { findKNearestNeighbors } from './operations/knn';
import { calculateSimilarityMatrix } from './operations/similarity';

import type { DistanceMetric, NormalizationType, SimilarityMetric } from './types';

export class Centroid implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Centroid',
		name: 'centroid',
		group: ['transform'],
		version: 1,
		description: 'Performs vector operations: centroid, clustering, normalization, and more',
		defaults: {
			name: 'Centroid',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Calculate Centroid',
						value: 'centroid',
						description: 'Calculate the mean (centroid) of a set of vectors',
					},
					{
						name: 'K-Means Clustering',
						value: 'kmeans',
						description: 'Cluster vectors using K-Means algorithm',
					},
					{
						name: 'Distance Matrix',
						value: 'distanceMatrix',
						description: 'Calculate pairwise distances between all vectors',
					},
					{
						name: 'Normalize Vectors',
						value: 'normalize',
						description: 'Normalize vectors using various methods',
					},
					{
						name: 'K-Nearest Neighbors',
						value: 'knn',
						description: 'Find K nearest neighbors to a query vector',
					},
					{
						name: 'Similarity Matrix',
						value: 'similarity',
						description: 'Calculate pairwise similarity between all vectors',
					},
				],
				default: 'centroid',
			},
			{
				displayName: 'Array of Vectors',
				name: 'vectors',
				type: 'json',
				default: '',
				description: 'Enter an array of vectors directly (e.g., [[1,2,3],[4,5,6],[7,8,9]])',
			},
			{
				displayName: 'Vector Source',
				name: 'vectorSource',
				type: 'options',
				options: [
					{ name: 'Auto (Parameter or Item)', value: 'auto' },
					{ name: 'Parameter', value: 'parameter' },
					{ name: 'Item JSON (Root Array)', value: 'itemRoot' },
					{ name: 'Item JSON (Path)', value: 'itemPath' },
				],
				default: 'auto',
				description:
					"Choose where to read the vectors from. 'Auto' keeps existing behavior: parameter first, then item.json array or item.json.vectors.",
			},
			{
				displayName: 'Vector Path',
				name: 'vectorPath',
				type: 'string',
				default: 'vectors',
				description:
					"Dot-separated path under item.json to read vectors when 'Vector Source' is 'Item JSON (Path)'.",
				displayOptions: {
					show: {
						vectorSource: ['itemPath'],
					},
				},
			},
			{
				displayName: 'Merge Output With Input',
				name: 'mergeOutput',
				type: 'boolean',
				default: true,
				description:
					'Whether to merge the result with the original item JSON (if input data is present)',
			},
			// K-Means specific parameters
			{
				displayName: 'Number of Clusters (k)',
				name: 'k',
				type: 'number',
				default: 3,
				description: 'Number of clusters to create',
				displayOptions: {
					show: {
						operation: ['kmeans'],
					},
				},
			},
			{
				displayName: 'Max Iterations',
				name: 'maxIterations',
				type: 'number',
				default: 100,
				description: 'Maximum number of iterations for convergence',
				displayOptions: {
					show: {
						operation: ['kmeans'],
					},
				},
			},
			{
				displayName: 'Tolerance',
				name: 'tolerance',
				type: 'number',
				default: 0.0001,
				description: 'Convergence tolerance threshold',
				displayOptions: {
					show: {
						operation: ['kmeans'],
					},
				},
			},
			// Distance Matrix specific parameters
			{
				displayName: 'Distance Metric',
				name: 'distanceMetric',
				type: 'options',
				options: [
					{ name: 'Euclidean', value: 'euclidean' },
					{ name: 'Manhattan', value: 'manhattan' },
					{ name: 'Cosine', value: 'cosine' },
				],
				default: 'euclidean',
				description: 'Metric to use for distance calculation',
				displayOptions: {
					show: {
						operation: ['distanceMatrix', 'knn'],
					},
				},
			},
			// Normalization specific parameters
			{
				displayName: 'Normalization Type',
				name: 'normalizationType',
				type: 'options',
				options: [
					{ name: 'L1 (Manhattan)', value: 'l1' },
					{ name: 'L2 (Euclidean)', value: 'l2' },
					{ name: 'Min-Max Scaling', value: 'minmax' },
					{ name: 'Z-Score (Standardization)', value: 'zscore' },
				],
				default: 'l2',
				description: 'Type of normalization to apply',
				displayOptions: {
					show: {
						operation: ['normalize'],
					},
				},
			},
			// KNN specific parameters
			{
				displayName: 'Query Vector',
				name: 'queryVector',
				type: 'json',
				default: '',
				description: 'The vector to find neighbors for (e.g., [1, 2, 3])',
				displayOptions: {
					show: {
						operation: ['knn'],
					},
				},
			},
			{
				displayName: 'Number of Neighbors',
				name: 'neighborsCount',
				type: 'number',
				default: 5,
				description: 'Number of nearest neighbors to find',
				displayOptions: {
					show: {
						operation: ['knn'],
					},
				},
			},
			// Similarity specific parameters
			{
				displayName: 'Similarity Metric',
				name: 'similarityMetric',
				type: 'options',
				options: [
					{ name: 'Cosine', value: 'cosine' },
					{ name: 'Pearson Correlation', value: 'pearson' },
					{ name: 'Jaccard', value: 'jaccard' },
				],
				default: 'cosine',
				description: 'Metric to use for similarity calculation',
				displayOptions: {
					show: {
						operation: ['similarity'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const inputItems = this.getInputData();
		const itemCount = inputItems.length > 0 ? inputItems.length : 1;

		const returnItems: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
			const operation = this.getNodeParameter('operation', itemIndex, 'centroid') as string;
			const rawVectors = this.getNodeParameter('vectors', itemIndex, '') as unknown;
			const mergeOutput = this.getNodeParameter('mergeOutput', itemIndex, true) as boolean;
			const vectorSource = this.getNodeParameter('vectorSource', itemIndex, 'auto') as string;
			const vectorPath = this.getNodeParameter('vectorPath', itemIndex, 'vectors') as string;

			let vectorsSource = rawVectors;
			const inputItem = inputItems[itemIndex];

			// Determine source according to explicit selection
			if (vectorSource === 'parameter') {
				vectorsSource = rawVectors;
			} else if (vectorSource === 'itemRoot') {
				vectorsSource = inputItem?.json;
			} else if (vectorSource === 'itemPath') {
				vectorsSource = inputItem ? getValueByPath(inputItem.json, vectorPath) : undefined;
			} else {
				// auto: keep backwards-compatible behavior
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
				let result: any;

				// Execute the selected operation
				switch (operation) {
					case 'centroid':
						result = calculateVectorCentroid(normalizedVectors);
						break;

					case 'kmeans': {
						const k = this.getNodeParameter('k', itemIndex, 3) as number;
						const maxIterations = this.getNodeParameter('maxIterations', itemIndex, 100) as number;
						const tolerance = this.getNodeParameter('tolerance', itemIndex, 0.0001) as number;
						result = kMeansClustering(normalizedVectors, k, maxIterations, tolerance);
						break;
					}

					case 'distanceMatrix': {
						const distanceMetric = this.getNodeParameter(
							'distanceMetric',
							itemIndex,
							'euclidean',
						) as DistanceMetric;
						result = calculateDistanceMatrix(normalizedVectors, distanceMetric);
						break;
					}

					case 'normalize': {
						const normalizationType = this.getNodeParameter(
							'normalizationType',
							itemIndex,
							'l2',
						) as NormalizationType;
						result = normalizeVectors(normalizedVectors, normalizationType);
						break;
					}

					case 'knn': {
						const queryVectorRaw = this.getNodeParameter('queryVector', itemIndex, '') as unknown;
						const neighborsCount = this.getNodeParameter('neighborsCount', itemIndex, 5) as number;
						const distanceMetric = this.getNodeParameter(
							'distanceMetric',
							itemIndex,
							'euclidean',
						) as DistanceMetric;

						// Parse and validate query vector
						let queryVector: number[];
						if (typeof queryVectorRaw === 'string') {
							try {
								queryVector = JSON.parse(queryVectorRaw);
							} catch (error) {
								throw new Error('Query vector must be valid JSON array.');
							}
						} else if (Array.isArray(queryVectorRaw)) {
							queryVector = queryVectorRaw;
						} else {
							throw new Error('Query vector must be an array of numbers.');
						}

						result = findKNearestNeighbors(
							normalizedVectors,
							queryVector,
							neighborsCount,
							distanceMetric,
						);
						break;
					}

					case 'similarity': {
						const similarityMetric = this.getNodeParameter(
							'similarityMetric',
							itemIndex,
							'cosine',
						) as SimilarityMetric;
						result = calculateSimilarityMatrix(normalizedVectors, similarityMetric);
						break;
					}

					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
							{ itemIndex },
						);
				}

				const newItem: INodeExecutionData = {
					json: mergeOutput && inputItem ? { ...inputItem.json, ...result } : result,
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
					});
				}

				throw error;
			}
		}

		return [returnItems];
	}
}
