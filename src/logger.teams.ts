/**
 * You can only subscribe to teams from this list.
 * Add your team name below to start logging.
 *
 * Make sure your label has a contrast ratio of 4.5 or more.
 * */
export const teams = {
	common: {
		background: '#052962',
		font: '#ffffff',
	},
	commercial: {
		background: '#77EEAA',
		font: '#004400',
	},
	cmp: {
		background: '#FF6BB5',
		font: '#2F0404',
	},
	dotcom: {
		background: '#000000',
		font: '#ff7300',
	},
	design: {
		background: '#185E36',
		font: '#FFF4F2',
	},
	tx: {
		background: '#2F4F4F',
		font: '#FFFFFF',
	},
};

export const generateSvg = (): string => {
	const filteredTeams = Object.entries(teams).filter((team) => {
		const [name] = team;
		return name !== 'common';
	});

	const padding = 10;
	const lineHeight = 25;
	const width = 300;
	const height = filteredTeams.length * lineHeight + padding * 2;

	const lines = filteredTeams.map((team) => {
		const [name, colours] = team;
		return `<div class="line">
			<span class="label common">@guardian</span>
			<span class="label ${name}" style="background-color: ${colours.background}; color: ${colours.font}">${name}</span>
			</div>`;
	});
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
	<style>
		.wrapper {
			font-family: monospace;
			padding: ${padding}px;
		}

		.line { height: ${lineHeight}px; }
		.label { display: inline-block; padding: 2px 3px; border-radius:3px }

		.common {
			background-color: ${teams.common.background};
			color: ${teams.common.font};
		}
	</style>
	<foreignObject x="0" y="0" width="100%" height="100%">
		<div class="wrapper" xmlns="http://www.w3.org/1999/xhtml">
			${lines.join('')}
		</div>
	</foreignObject>
</svg>`;
	return svg;
};
