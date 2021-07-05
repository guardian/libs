// TODO: fix this
// node --trace-warnings --loader ts-node/esm --experimental-specifier-resolution=node scripts/generateSvg.ts

import fs from 'fs';
import { teams } from '../src/logger.teams';

// A bit weird, we’re writing this before the test runs!
fs.writeFileSync(__dirname + '/../static/logger.svg', generateSvg());

// Deno.writeTextFile('./static/logger.svg', generateSvg());

export function generateSvg(): string {
	const filteredTeams = Object.entries(teams).filter((team) => {
		const [name] = team;
		return name !== 'common';
	});

	const padding = 10;
	const lineHeight = 24;
	const width = 600;
	const height = filteredTeams.length * lineHeight + padding * 2 + 60;

	const lines = filteredTeams.map((team, index) => {
		const [name, colours] = team;
		return `<div class="line">
			<span class="label common">@guardian</span>
			<span class="label ${name}" style="background-color: ${colours.background}; color: ${colours.font}">${name}</span>
			<span class="label">message no.${index}</span>
			<span class="gap"></span>
			<span class="label log">console.log</span>
		</div>`;
	});
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
	<style>
		.wrapper {
			font-family: monospace;
			padding: ${padding}px;
			width: 100%;
			height: 100%;
		}

		* {
			box-sizing: border-box;
		}

		#console {
			width: 100%;
			height: 100%;
			border: 1px solid #999;
			padding: 5px;
			border-radius: 5px
		}
		.line {
			display: flex;
			height: ${lineHeight}px;
			border-bottom: 1px solid #ccc;
			padding: 2px 5px;
		}
		.label {
			display: inline-block;
			height: min-content;
			padding: 2px 3px;
			border-radius:3px
		}
		.label:nth-of-type(n+2) {
			margin-left: 3px;
		}
		.gap {
			flex-grow: 1;
		}
		.log {
			opacity: 0.7;
			text-decoration: underline;
		}

		.common {
			background-color: ${teams.common.background};
			color: ${teams.common.font};
		}
	</style>
	<foreignObject x="0" y="0" width="${width}" height="${height}">
		<div class="wrapper" xmlns="http://www.w3.org/1999/xhtml">
			<div id="console">
				<div class="line">> Console</div>
				${lines.join('')}
			</div>
		</div>
	</foreignObject>
</svg>`;
	return svg;
}
