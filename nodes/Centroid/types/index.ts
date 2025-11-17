export interface KMeansResult {
	clusters: Array<{
		centroid: number[];
		vectors: number[][];
		indices: number[];
		size: number;
	}>;
	labels: number[];
	iterations: number;
	inertia: number;
}

export interface KNNResult {
	neighbors: Array<{
		vector: number[];
		distance: number;
		index: number;
	}>;
	queryVector: number[];
}

export interface NormalizationResult {
	normalizedVectors: number[][];
	metadata: {
		type: string;
		originalNorms?: number[];
		min?: number[];
		max?: number[];
		mean?: number[];
		std?: number[];
	};
}

export interface DistanceMatrixResult {
	distanceMatrix: number[][];
	metric: string;
}

export interface SimilarityResult {
	similarities: number[][];
	metric: string;
}

export type DistanceMetric = 'euclidean' | 'manhattan' | 'cosine';
export type NormalizationType = 'l1' | 'l2' | 'minmax' | 'zscore';
export type SimilarityMetric = 'cosine' | 'pearson' | 'jaccard';
