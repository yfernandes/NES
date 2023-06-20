// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json", "./tsconfig.test.json"],
		tsconfigRootDir: __dirname,
	},
	reportUnusedDisableDirectives: true,
	plugins: ["@typescript-eslint/eslint-plugin", "eslint-plugin-jsdoc"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		// "plugin:@typescript-eslint/recommended-requiring-type-checking",
		"prettier",
	],
	root: true,
	env: {
		node: true,
		jest: true,
		es2021: true,
	},
	rules: {
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-empty-interface": "off",
	},
});
