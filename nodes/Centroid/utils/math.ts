/**
 * Calculate the norm (magnitude) of a vector
 */
export function vectorNorm(vector: number[], p: number = 2): number {
	if (p === 2) {
		// L2 norm (Euclidean)
		let sum = 0;
		for (const value of vector) {
			sum += value * value;
		}
		return Math.sqrt(sum);
	} else if (p === 1) {
		// L1 norm (Manhattan)
		let sum = 0;
		for (const value of vector) {
			sum += Math.abs(value);
		}
		return sum;
	} else if (p === Infinity) {
		// Infinity norm (Max)
		return Math.max(...vector.map(Math.abs));
	}

	throw new Error(`Unsupported norm type: ${p}`);
}

/**
 * Normalize a vector to unit length
 */
export function normalizeVector(vector: number[], p: number = 2): number[] {
	const norm = vectorNorm(vector, p);

	if (norm === 0) {
		return vector.slice(); // Return copy of zero vector
	}

	return vector.map((value) => value / norm);
}

/**
 * Calculate mean of an array of numbers
 */
export function mean(values: number[]): number {
	if (values.length === 0) {
		throw new Error('Cannot calculate mean of empty array.');
	}

	return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate standard deviation of an array of numbers
 */
export function standardDeviation(values: number[]): number {
	if (values.length === 0) {
		throw new Error('Cannot calculate standard deviation of empty array.');
	}

	const avg = mean(values);
	const squaredDiffs = values.map((value) => Math.pow(value - avg, 2));

	return Math.sqrt(mean(squaredDiffs));
}

/**
 * Find minimum value in array
 */
export function min(values: number[]): number {
	if (values.length === 0) {
		throw new Error('Cannot find minimum of empty array.');
	}

	return Math.min(...values);
}

/**
 * Find maximum value in array
 */
export function max(values: number[]): number {
	if (values.length === 0) {
		throw new Error('Cannot find maximum of empty array.');
	}

	return Math.max(...values);
}

/**
 * Get column from matrix (2D array)
 */
export function getColumn(matrix: number[][], columnIndex: number): number[] {
	return matrix.map((row) => row[columnIndex]);
}

/**
 * Calculate element-wise mean across vectors (centroid)
 */
export function calculateCentroid(vectors: number[][]): number[] {
	if (!Array.isArray(vectors) || vectors.length === 0) {
		throw new Error('Cannot calculate the centroid of an empty vector list.');
	}

	const dimension = vectors[0].length;
	const totals = new Array(dimension).fill(0);

	for (const vector of vectors) {
		if (vector.length !== dimension) {
			throw new Error('All vectors must share the same dimension.');
		}

		for (let index = 0; index < dimension; index++) {
			totals[index] += vector[index];
		}
	}

	return totals.map((component) => component / vectors.length);
}
