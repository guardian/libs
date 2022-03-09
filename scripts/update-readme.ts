import fs from 'fs';
import path from 'path';
import pkg from '../package.json';

const pathToReadme = path.join(__dirname, '../README.md');

let readme = fs.readFileSync(pathToReadme, 'utf8');

const inserts = [{ key: 'TS_VERSION', value: pkg.devDependencies.typescript }];

for (const { key, value } of inserts) {
	const regex = new RegExp(`<!-- ${key} -->.*?<!-- /${key} -->`, 'gm');
	readme = readme.replace(regex, `<!-- ${key} -->${value}<!-- /${key} -->`);
}

fs.writeFileSync(pathToReadme, readme);
