import { whenIdle } from './whenIdle';

describe('whenIdle', () => {
	it('does not fire callback straight away', () => {
		let fired = false;
		const cb = () => {
			fired = true;
		};
		whenIdle(cb);
		expect(fired).toBe(false);
	});

	it('fires the callback after 600ms', async () => {
		let fired = false;
		const cb = () => {
			fired = true;
		};
		whenIdle(cb);
		expect(fired).toBe(false);
		await new Promise((r) => setTimeout(r, 600));
		expect(fired).toBe(true);
	});
});
