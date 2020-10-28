/* eslint-disable
	import/no-default-export
--
rollup wants it
*/

import typescript from '@rollup/plugin-typescript';
import size from 'rollup-plugin-size';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
	input: './src/index.ts',
	output: [
		{
			file: pkg.unpkg,
			format: 'umd',
			name: `gu.${pkg.name.split('@guardian/')[1]}`,
		},
	],
	plugins: [
		typescript({
			lib: [
				'es2015',
				'es2016',
				'es2017',
				'es2018',
				'es2019',
				'es2020',
				'dom',
			],
			target: 'es2015',
		}),
		terser(),
		size(),
	],
};
