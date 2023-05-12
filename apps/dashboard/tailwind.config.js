const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		join(__dirname, '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
		...createGlobPatternsForDependencies(__dirname)
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
