import type { Collector } from './@types/tracker';
import { initTracker } from './tracker';

const dummyCollector: Collector = () => ({
	properties: {},
	metrics: {},
});

describe('tracker', () => {
	it('can be initialised', () => {
		const track = initTracker('label', dummyCollector);
		expect(typeof track).toBe('function');
	});
});
