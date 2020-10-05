import { loadScript } from './loadScript';

const goodURL = 'good-url';
const badURL = 'bad-url';

const getTestScript = (url: string) =>
	Array.from(document.scripts).find(({ src }) => src.includes(url));

const fakeLoadEvent = new MutationObserver((mutations) => {
	if (
		mutations.some((mutation) =>
			Array.from(mutation.addedNodes).some(
				({ nodeName }) => nodeName === 'SCRIPT',
			),
		)
	) {
		getTestScript(goodURL)?.onload?.(new Event('fake-onload-event'));
		getTestScript(badURL)?.onerror?.(new Event('fake-onload-event'));
	}
});

beforeEach(() => {
	document.body.innerHTML = '';
	document.body.appendChild(document.createElement('script'));
	fakeLoadEvent.observe(document.body, {
		childList: true,
	});
});

afterEach(() => {
	fakeLoadEvent.disconnect();
});

describe('loadScript', () => {
	it('adds a script to the page and resolves the promise it returns when the script loads', async () => {
		expect(document.scripts).toHaveLength(1);
		await expect(loadScript(goodURL)).resolves.toMatchObject({
			type: 'fake-onload-event',
		});
		expect(document.scripts).toHaveLength(2);
	});

	it('resolves immediately if a script with matching src is already on page and stops there', async () => {
		expect(document.scripts).toHaveLength(1);
		await expect(loadScript(goodURL)).resolves.toMatchObject({
			type: 'fake-onload-event',
		});
		await expect(loadScript(goodURL)).resolves.toBeUndefined();
		await expect(loadScript(goodURL)).resolves.toBeUndefined();
		await expect(loadScript(goodURL)).resolves.toBeUndefined();
		expect(document.scripts).toHaveLength(2);
	});

	it('can add scripts with attributes', async () => {
		await loadScript(goodURL, {
			async: true,
			referrerPolicy: 'no-referrer',
		});
		expect(getTestScript(goodURL)?.async).toBeTruthy();
		expect(getTestScript(goodURL)?.referrerPolicy).toBe('no-referrer');
	});

	it('rejects if the script fails to load', async () => {
		await expect(loadScript(badURL)).rejects.toBeDefined();
	});
});
