import { loadScript } from './loadScript';

const goodURL = 'good-url';
const badURL = 'bad-url';

// mimic script loading events.
// when we detect that a script has been added to the DOM:
// - if the src is goodURL trigger a load event
// - if the src is badURL trigger an error event
const fakeLoader = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		mutation.addedNodes.forEach((addedNode) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (addedNode.src.includes(goodURL)) {
				addedNode.dispatchEvent(new Event('load'));
			}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (addedNode.src.includes(badURL)) {
				addedNode.dispatchEvent(new Event('error'));
			}
		});
	});
});

beforeEach(() => {
	document.body.innerHTML = '';
	document.body.appendChild(document.createElement('script'));
	fakeLoader.observe(document.body, {
		childList: true,
	});
});

afterEach(() => {
	fakeLoader.disconnect();
});

describe('loadScript', () => {
	it('adds a script to the page and resolves the promise it returns when the script loads', async () => {
		expect(document.scripts).toHaveLength(1);
		await expect(loadScript(goodURL)).resolves.toMatchObject({
			type: 'load',
		});
		expect(document.scripts).toHaveLength(2);
	});

	it('resolves immediately if a script with matching src is already on page and stops there', async () => {
		expect(document.scripts).toHaveLength(1);
		await expect(loadScript(goodURL)).resolves.toMatchObject({
			type: 'load',
		});
		// try injecting it again a random amount of times
		await expect(loadScript(goodURL)).resolves.toBeUndefined();
		await expect(loadScript(goodURL)).resolves.toBeUndefined();
		await expect(loadScript(goodURL)).resolves.toBeUndefined();
		expect(document.scripts).toHaveLength(2);
	});

	it('can add scripts with attributes', async () => {
		await loadScript(goodURL, {
			async: true,
			referrerPolicy: 'no-referrer',
			className: 'u6ytfiuyoibnpoim',
		});
		expect(document.scripts[0]?.async).toBeTruthy();
		expect(document.scripts[0]?.referrerPolicy).toBe('no-referrer');
		expect(document.scripts[0]?.className).toBe('u6ytfiuyoibnpoim');
	});

	it('rejects if the script fails to load', async () => {
		await expect(loadScript(badURL)).rejects.toBeDefined();
	});
});
