#!/usr/bin/env bash

echo "import {generateSvg} from './src/logger.teams.ts'; Deno.writeTextFile('./static/logger.svg', generateSvg());" \
	| deno run --allow-read --allow-write -
