const isFiniteNumber = (value: unknown): value is number =>
	typeof value === 'number' && Number.isFinite(value);

export function normalizeVectorsInput(rawValue: unknown): number[][] {
	let vectors: unknown = rawValue;

	if (typeof vectors === 'string') {
		if (vectors.trim() === '') {
			throw new Error('The vector array string must not be empty.');
		}

		try {
			vectors = JSON.parse(vectors);
		} catch (error) {
			throw new Error('The vector array string must be valid JSON.');
		}
	}

	if (!Array.isArray(vectors) || vectors.length === 0) {
		throw new Error('You must provide a non-empty array of vectors.');
	}

	if (!Array.isArray(vectors[0])) {
		throw new Error('Each entry in the array must be a vector (an array of numbers).');
	}

	const dimension = (vectors[0] as unknown[]).length;

	if (dimension === 0) {
		throw new Error('Vectors must have at least one dimension.');
	}

	return (vectors as unknown[]).map((vector, vectorIndex) => {
		if (!Array.isArray(vector)) {
			throw new Error(`Entry at index ${vectorIndex} is not a vector (array).`);
		}

		if (vector.length !== dimension) {
			throw new Error('All vectors must share the same dimension.');
		}

		const normalizedVector = vector.map((value, componentIndex) => {
			if (!isFiniteNumber(value)) {
				throw new Error(
					`Vector component at index [${vectorIndex}][${componentIndex}] must be a finite number.`,
				);
			}

			return value;
		});

		return normalizedVector;
	});
}

// Utility to get a nested value by dot-separated path (e.g., "data.vectors")
export function getValueByPath(source: unknown, path: string): unknown {
	if (source === null || source === undefined) return undefined;
	if (!path || typeof path !== 'string') return undefined;

	const keys = path.split('.').filter(Boolean);
	let current: unknown = source;

	for (const key of keys) {
		if (typeof current !== 'object' || current === null) {
			return undefined;
		}
		const record = current as Record<string, unknown>;
		current = record[key];
	}

	return current;
}
