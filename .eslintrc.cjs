/** @type {import('eslint').ESLint.ConfigData} */
const config = {
	env: {
		browser: true,
		es2020: true,
		webextensions: true,
	},
	extends: [
		'google',
		'eslint:recommended',
		'prettier',
		'plugin:prettier/recommended',
	],
	plugins: ['html'],
	root: true,
	parserOptions: {
		sourceType: 'module',
	},
	overrides: [
		{
			files: ['*.js', '*.html'],
			parserOptions: {
				project: ['tsconfig(.*)?.json'],
			},
		},
	],
};

module.exports = config;
