import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		include: ['tests/**/*.test.ts'],
		coverage: {
			enabled: true,
			reporter: ['text', 'html'],
			lines: 0.8,
			functions: 0.8,
			branches: 0.8,
			statements: 0.8,
		},
	},
});
