import { defineConfig } from 'vitest/config';
import path from 'path';

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
	resolve: {
		alias: {
			'n8n-workflow': path.resolve(__dirname, 'node_modules/n8n-workflow/dist/index.js'),
		},
	},
});
