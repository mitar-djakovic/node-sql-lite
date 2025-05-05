import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,cjs,mjs,ts}"],
		ignores: ["lint-staged.config.js"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				sourceType: "module",
			},
			globals: globals.node,
		},
		plugins: {
			js,
			"@typescript-eslint": tseslint.plugin,
			prettier: eslintPluginPrettier,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			...js.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			"prettier/prettier": "error",
			"simple-import-sort/imports": [
				"error",
				{
					groups: [
						// External packages
						["^node:", "^@?\\w"],
						// Internal aliases like @/ or utils/
						["^(@|utils)(/.*|$)"],
						// Relative imports
						["^\\u0000", "^\\.", "^\\.\\.(?!/?$)", "^\\.\\./?$"],
						// Style imports (optional, for CSS/SCSS etc.)
						["^.+\\.s?css$"],
					],
				},
			],
			"simple-import-sort/exports": "error",
		},
	},
]);
